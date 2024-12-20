var express = require('express');
var router = express.Router();
var controller = require("../controller/eventController");


router.post('/create',controller.createEvent);
router.post('/book',controller.bookEvent);
router.get('/bookingCount',controller.getEventBookingCount);

module.exports = router;