// routes/appointments.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

// Create an appointment
router.post('/', [auth, [
  check('doctor', 'Doctor is required').not().isEmpty(),
  check('date', 'Date is required').not().isEmpty(),
  check('time', 'Time is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { doctor, date, time } = req.body;

  try {
    const newAppointment = new Appointment({
      patient: req.user.id,
      doctor,
      date,
      time
    });

    const appointment = await newAppointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all appointments for a user
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id }).populate('doctor', ['name', 'email']);
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
