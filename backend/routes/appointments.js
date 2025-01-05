import express from 'express';
import Appointment from '../models/Appointment.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'yasirukularathne1234@gmail.com',
    pass: 'bgyb ytbh vxnj tphw', // Replace with your actual password or app-specific password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Function to send email notifications
async function sendNotification(email, subject, text) {
  try {
    await transporter.sendMail({
      from: 'yasirukularathne1234@gmail.com',
      to: email,
      subject,
      text,
    });
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
}

// Create a new appointment
router.post('/', async (req, res) => {
  try {
    const { name, email, date, time } = req.body;

    const appointment = new Appointment({
      name,
      email,
      date,
      time,
    });

    const savedAppointment = await appointment.save();
    // Send email to the owner after creating the appointment
    await sendNotification(
      'yasirukularathne1234@gmail.com', // Owner's email
      'New Appointment Created',
      `A new appointment has been created:
      Name: ${name}
      Email: ${email}
      Date: ${date}
      Time: ${time}`
    );



    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific appointment
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an appointment (confirm, reject, or update date/time)
router.put('/:id', async (req, res) => {
  try {
    const { status, options } = req.body;
    let appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      // Update status (confirm or reject)
      if (status) {
        appointment.status = status;

        // Send email based on status update
        if (status === 'confirmed') {
          await sendNotification(
            appointment.email,
            'Appointment Confirmed',
            `Dear ${appointment.name}, your appointment on ${appointment.date} at ${appointment.time} is confirmed. Contact us for more details at 0779411017.`
          );
        } else if (status === 'rejected') {
          await sendNotification(
            appointment.email,
            'Appointment Rejected',
            `Dear ${appointment.name}, your appointment on ${appointment.date} at ${appointment.time} has been rejected. Contact us for more details at 0779411017.`
          );
        }
      }

      // Update options (if asked for new date/time)
      if (options && Array.isArray(options) && options.length > 0) {
        appointment.options = options;
      }

      // Save the updated appointment
      appointment = await appointment.save();
      res.json(appointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (appointment) {
      res.json({ message: 'Appointment deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
