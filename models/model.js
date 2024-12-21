// MySQL Setup
const mysql = require('mysql');
const redis = require('redis');

// MySQL Connection
const mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ebs" // eventbooking system
});

mysqlConnection.connect((err) => {
    if (err) {
        console.error("MySQL connection error:", err);
    }
    console.log("MySQL connection successful");
});

// Redis Connection
const redisClient = redis.createClient({
    url: 'redis://127.0.0.1:6379', // Use the URL format
});

(async () => {
    try {
        await redisClient.connect(); // Explicitly connect the Redis client
        console.log("Redis connection successful");

        // Example: Get a key-value pair after connecting
        const value = await redisClient.get("event:123:bookingCount");
        console.log("Redis GET response:", value);
    } catch (err) {
        console.error("Redis connection error:", err);
        process.exit(1); // Exit if Redis initialization fails
    }
})();

// Export connections
module.exports = {
    mysqlConnection,
    redisClient,
};
