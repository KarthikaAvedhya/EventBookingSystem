# EventBookingSystem

## Project Description

The **Event Booking System** (EBS) is a web application designed to allow users to create and manage events, including setting capacity and booking details. It supports event creation, booking, and real-time updates using Redis for caching, MySQL for persistent storage, and RabbitMQ for messaging.

This application includes:
- **API Endpoints** for event creation and management.
- **Redis** for storing temporary data such as booking counts.
- **RabbitMQ** for background task processing such as email notifications.
- **MySQL** for storing event details.

## Project Setup

This section covers setting up the environment and dependencies to run the project locally.

### Prerequisites

Ensure the following services are installed and running:

- **Node.js** - v16.13.2
- **MySQL** (for database)
- **Redis** (for caching)
- **RabbitMQ** (for messaging queue)

### 1. Install Dependencies

Clone this repository and install the required dependencies.

```bash
git clone https://github.com/KarthikaAvedhya/EventBookingSystem.git
cd EventBookingSystem
npm install
2. Set Up MySQL
Install MySQL
Create Database : "ebs"

command : CREATE DATABASE ebs;
SQL Scripts
Create tables (e.g., events, bookings, etc.) based on your schema. Here's an example for the events table:

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status BOOLEAN NOT NULL DEFAULT true
);
3. Set Up Redis
Install Redis
Install Redis on Windows
Start Redis
To start the Redis server, use the following command:

bash
redis-server
Ensure Redis is running and accepting connections by typing PING in the Redis CLI, and it should return PONG.

4. Set Up RabbitMQ
Install RabbitMQ
Install RabbitMQ on Windows
Start RabbitMQ
To start RabbitMQ, run the following command:

rabbitmq-server
Make sure RabbitMQ is running by visiting the RabbitMQ Management UI. The default username and password are guest and guest.

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

RABBITMQ_URL=amqp://localhost

PORT=8000
These variables configure MySQL, Redis, RabbitMQ, and the server port. Make sure to adjust the values based on your local setup.

6. Running the Application
Start the API Server
To run the application, use the following command:

node app.js - to execute the apis
This will start the server on port 8000. The API is now accessible.

Start RabbitMQ Consumers
If you have RabbitMQ consumers (e.g., for sending email notifications), you can start them separately using the following command:
npm run start:consumer
This will listen to the RabbitMQ queue and process any tasks sent by the application (such as email notifications).

7. Running Tests
To run the tests for the application, use the following command:
node app.js

8. Example API Calls
Here are a few example API calls to test the system:

Create Event
POST /events

Postman : http://localhost:8000/events 
Request body:
{
    "name": "Music Concert",
    "capacity": 10,
    "status": true
}'
Response:
{
    "status": "true",
    "message": "Event created successfully",
    "eventId": 1
}

Postman :  http://localhost:8000/book 
Request body :
{
    "user_id":1,
    "event_id":1,
    "status":true
}
Get Booking Count for Event
GET /events/bookingCount
{
    "status": "true",
    "bookingCount": 25
}
