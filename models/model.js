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
        process.exit(1); // Exit if MySQL connection fails
    }
    console.log("MySQL connection successful");
});

// Redis Connection
const redisClient = redis.createClient({
    socket: {
        host: '127.0.0.1',
        port: 6379,
    },
});

redisClient.on('connect', () => {
    console.log("Redis connection successful");
});

redisClient.on('error', (err) => {
    console.error("Redis connection error:", err);
    process.exit(1); // Exit if Redis connection fails
});

// Initialize Redis connection (only once here)
(async () => {
    try {
        await redisClient.connect();
        console.log("Redis client initialized");
    } catch (err) {
        console.error("Redis initialization error:", err);
        process.exit(1); // Exit if Redis initialization fails
    }
})();

// Export connections
module.exports = {
    mysqlConnection,
    redisClient,
};
