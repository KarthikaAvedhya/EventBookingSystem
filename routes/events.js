var express = require('express');
var router = express.Router();
var controller = require("../controller/eventController");


router.post('/',controller.createEvent);
router.post('/book',controller.bookEvent);
router.get('/bookingCount/:id',controller.getEventBookingCount);

module.exports = router;