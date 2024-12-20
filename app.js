const { mysqlConnection, redisClient } = require('./models/model');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');
const eventRouter = require('./routes/events');

const app = express();

// Middleware Setup
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

// RabbitMQ Setup
const RABBITMQ_URL = 'amqp://localhost';
let rabbitChannel;

amqp.connect(RABBITMQ_URL, (err, connection) => {
    if (err) {
        console.error('RabbitMQ connection error:', err);
        process.exit(1); // Exit if RabbitMQ connection fails
    }
    console.log('Connected to RabbitMQ');

    connection.createChannel((err, channel) => {
        if (err) {
            console.error('RabbitMQ channel error:', err);
            process.exit(1); // Exit if RabbitMQ channel setup fails
        }
        rabbitChannel = channel;
        app.locals.rabbitChannel = rabbitChannel;

        const queue = 'emailNotifications';
        channel.assertQueue(queue, { durable: true });
        console.log(`RabbitMQ queue '${queue}' is ready`);
    });
});

// Pass Redis and MySQL clients to app.locals
app.locals.mysqlConnection = mysqlConnection;
app.locals.redisClient = redisClient;

// Routes Setup
app.use('/events', eventRouter);

// Start Server
const listener = app.listen(8000, () => {
    console.log('Listening to port:' + listener.address().port);
});

module.exports = app;
