const { mysqlConnection, redisClient } = require('../models/model');
const amqp = require('amqplib/callback_api');

// Create Event API
module.exports.createEvent = async (req, res) => {
    try {
        let { name, capacity, status } = req.body;

        // SQL query to insert the event
        const values = [name, capacity, new Date(), new Date(), status];
        let sql = `INSERT INTO events(name, capacity, created_at, updated_at, status) VALUES(?)`;

        mysqlConnection.query(sql, [values], function (err, data) {
            if (err) {
                console.error("MySQL query error:", err);
                return res.status(500).json({ error: 'Please contact the administrator' });
            }

            // Successful event creation
            res.status(201).json({ status: 'true', message: "Event created successfully", eventId: data.insertId });
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: err.message });
    }
};

// Book Event API
module.exports.bookEvent = async (req, res) => {
    try {
        const { user_id, event_id } = req.body;
console.log("bodyyyyyy",req.body )
        // Check the current booking count using Redis first
        redisClient.get(`event:${event_id}:bookingCount`, async (err, count) => {
            if (err) {
                console.error("Redis error:", err);
                return res.status(500).json({ error: 'Error connecting to Redis' });
            }
console.log("counttt", count)
            // If the count is not cached, fetch it from the database
            if (!count) {
                let sql = `SELECT COUNT(*) AS bookingCount FROM bookings WHERE event_id = ?`;
                mysqlConnection.query(sql, [event_id], (err, result) => {
                    if (err) {
                        console.error("MySQL query error:", err);
                        return res.status(500).json({ error: 'Database error while fetching booking count' });
                    }

                    // Store the booking count in Redis
                    redisClient.set(`event:${event_id}:bookingCount`, result[0].bookingCount);
                    count = result[0].bookingCount;

                    // Continue booking logic
                    checkAndBookEvent(count, event_id, user_id, res);
                });
            } else {
                // Proceed with booking logic if count is cached
                checkAndBookEvent(count, event_id, user_id, res);
            }
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: err.message });
    }
};

// Helper function to handle booking logic
const checkAndBookEvent = (count, event_id, user_id, res) => {
    // Check if the event has reached capacity
    const eventSql = `SELECT capacity FROM events WHERE id = ?`;
    mysqlConnection.query(eventSql, [event_id], async (err, event) => {
        if (err) {
            console.error("MySQL query error:", err);
            return res.status(500).json({ error: 'Error fetching event details' });
        }

        let eventCapacity = event[0].capacity;

        // If capacity exceeded, return error
        if (count >= eventCapacity) {
            return res.status(400).json({ status: 'false', message: "Event capacity exceeded" });
        }

        // Prevent duplicate booking by the same user
        const bookingSql = `SELECT * FROM bookings WHERE event_id = ? AND user_id = ?`;
        mysqlConnection.query(bookingSql, [event_id, user_id], async (err, result) => {
            if (err) {
                console.error("MySQL query error:", err);
                return res.status(500).json({ error: 'Error checking duplicate bookings' });
            }

            if (result.length > 0) {
                return res.status(400).json({ status: 'false', message: "Duplicate booking detected" });
            }

            // Proceed with booking
            let bookingSqlInsert = `INSERT INTO bookings (event_id, user_id, created_at) VALUES (?, ?, ?)`;
            mysqlConnection.query(bookingSqlInsert, [event_id, user_id, new Date()], (err, data) => {
                if (err) {
                    console.error("MySQL query error:", err);
                    return res.status(500).json({ error: 'Error while booking event' });
                }

                // Update booking count in Redis
                redisClient.incr(`event:${event_id}:bookingCount`);

                // Send RabbitMQ message for email notification
                sendRabbitMQMessage(event_id, user_id);

                res.status(200).json({ status: 'true', message: 'Event booked successfully' });
            });
        });
    });
};

// Send RabbitMQ message for email notification
const sendRabbitMQMessage = (event_id, user_id) => {
    amqp.connect('amqp://localhost', function (err, conn) {
        if (err) {
            console.error('Failed to connect to RabbitMQ:', err);
            return;
        }

        conn.createChannel(function (err, channel) {
            if (err) {
                console.error('Failed to create channel:', err);
                return;
            }

            const message = JSON.stringify({
                eventId: event_id,
                userId: user_id,
                message: 'Booking confirmed'
            });

            // Send message to RabbitMQ
            channel.sendToQueue('email_notifications', Buffer.from(message));
            console.log('Message sent to RabbitMQ');
        });
    });
};

// Get Event Booking Count API
module.exports.getEventBookingCount = async (req, res) => {
    try {
        let { eventId } = req.params;

        // First check if the booking count is cached in Redis
        redisClient.get(`event:${eventId}:bookingCount`, (err, count) => {
            if (err) {
                console.error("Redis error:", err);
                return res.status(500).json({ error: 'Error fetching booking count from Redis' });
            }

            if (count) {
                return res.status(200).json({ status: 'true', bookingCount: count });
            }

            // If no cache, fetch from database
            let sql = `SELECT COUNT(*) AS bookingCount FROM bookings WHERE event_id = ?`;
            mysqlConnection.query(sql, [eventId], (err, result) => {
                if (err) {
                    console.error("MySQL query error:", err);
                    return res.status(500).json({ error: 'Error fetching booking count from database' });
                }

                // Cache the booking count in Redis
                redisClient.set(`event:${eventId}:bookingCount`, result[0].bookingCount);
                res.status(200).json({ status: 'true', bookingCount: result[0].bookingCount });
            });
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: err.message });
    }
};
