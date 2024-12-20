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

- **Node.js**
- **MySQL** (for database)
- **Redis** (for caching)
- **RabbitMQ** (for messaging queue)

### 1. Install Dependencies

Clone this repository and install the required dependencies.

```bash
git clone https://github.com/your-repository/event-booking-system.git
cd event-booking-system
npm install
2. Set Up MySQL
Install MySQL
If MySQL is not already installed, follow these instructions based on your OS:

Install MySQL on Windows
Install MySQL on macOS
Install MySQL on Linux
Create Database
Log into MySQL:
bash
Copy code
mysql -u root -p
Create a new database:
sql
Copy code
CREATE DATABASE ebs;
Use this database:
sql
Copy code
USE ebs;
Create tables (e.g., events, bookings, etc.) based on your schema. Here's an example for the events table:
sql
Copy code
CREATE TABLE events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL
);
3. Set Up Redis
Install Redis
Install Redis on Windows
Install Redis on macOS using Homebrew
bash
Copy code
brew install redis
Install Redis on Linux
Start Redis
To start the Redis server, use the following command:

bash
Copy code
redis-server
Ensure Redis is running and accepting connections by typing PING in the Redis CLI, and it should return PONG.

4. Set Up RabbitMQ
Install RabbitMQ
Install RabbitMQ on Windows
Install RabbitMQ on macOS
Install RabbitMQ on Linux
Start RabbitMQ
To start RabbitMQ, run the following command:

bash
Copy code
rabbitmq-server
Make sure RabbitMQ is running by visiting the RabbitMQ Management UI. The default username and password are guest and guest.

5. Configure the Application
The application relies on several environment variables for configuration. Create a .env file at the root of the project and add the following variables:

bash
Copy code
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=ebs

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

RABBITMQ_URL=amqp://localhost

PORT=8000
These variables configure MySQL, Redis, RabbitMQ, and the server port. Make sure to adjust the values based on your local setup.

6. Running the Application
Start the API Server
To run the application, use the following command:

bash
Copy code
npm start
This will start the server on port 8000 (or the port defined in the .env file). The API is now accessible.

Start RabbitMQ Consumers
If you have RabbitMQ consumers (e.g., for sending email notifications), you can start them separately using the following command:

bash
Copy code
npm run start:consumer
This will listen to the RabbitMQ queue and process any tasks sent by the application (such as email notifications).

7. Running Tests
To run the tests for the application, use the following command:

bash
Copy code
npm test
Make sure your testing framework is set up (e.g., Jest). This will run the tests and output the results.

8. Example API Calls
Here are a few example API calls to test the system:

Create Event
POST /events

bash
Copy code
curl -X POST http://localhost:8000/events -H "Content-Type: application/json" -d '{
    "name": "Music Concert",
    "capacity": 500,
    "status": "active"
}'
Response:

json
Copy code
{
    "status": "true",
    "message": "Event created successfully",
    "eventId": 1
}
Get Event Details
GET /events/:id

bash
Copy code
curl http://localhost:8000/events/1
Response:

json
Copy code
{
    "status": "true",
    "event": {
        "event_id": 1,
        "name": "Music Concert",
        "capacity": 500,
        "created_at": "2024-12-20T10:00:00",
        "updated_at": "2024-12-20T10:00:00",
        "status": "active"
    }
}
Get Booking Count for Event
GET /events/:id/booking-count

bash
Copy code
curl http://localhost:8000/events/1/booking-count
Response:

json
Copy code
{
    "status": "true",
    "bookingCount": 25
}
