import express from 'express';
import Appointment from '../models/Appointment.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'yasirukularathne1234@gmail.com',
    pass: 'bgyb ytbh vxnj tphw',
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
      status: 'pending',
      createdAt: new Date(),
      confirmedAt: new Date(),
    });

    const savedAppointment = await appointment.save();
    
    // Send email to the owner
    await sendNotification(
      'yasirukularathne1234@gmail.com',
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
// Update an appointment (confirm, cancel, or update date/time)
router.put('/:id', async (req, res) => {
  try {
    const { status, date, time, options } = req.body;
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update date and time if provided
    if (date) appointment.date = new Date(date);
    if (time) appointment.time = time;

    // Update status if provided
    if (status) {
      appointment.status = status;

      if (status === 'cancelled') {
        appointment.cancelledAt = new Date();
        await sendNotification(
          appointment.email,
          'Appointment Cancelled',
          `Dear ${appointment.name},\n\nYour appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been cancelled.\n\nPlease contact us at 0779411017 if you would like to schedule a new appointment.\n\nBest regards,\nYour Team`
        );
      } else if (status === 'confirmed') {
        appointment.cancelledAt = undefined;
        await sendNotification(
          appointment.email,
          'Appointment Confirmed',
          `Dear ${appointment.name},\n\nYour appointment has been confirmed for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.\n\nIf you need to make any changes, please contact us at 0779411017.\n\nBest regards,\nYour Team`
        );
      }
    }

    // If date or time was updated, send notification
    if ((date || time) && !status) {
      await sendNotification(
        appointment.email,
        'Appointment Time Updated',
        `Dear ${appointment.name},\n\nYour appointment has been rescheduled to ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.\n\nIf this time doesn't work for you, please contact us at 0779411017.\n\nBest regards,\nYour Team`
      );
    }

    // Update options if provided
    if (options && Array.isArray(options)) {
      appointment.options = options;
      
      if (options.length > 0) {
        const optionsText = options
          .map((opt, index) => `Option ${index + 1}: ${new Date(opt.date).toLocaleDateString()} at ${opt.time}`)
          .join('\n');

        await sendNotification(
          appointment.email,
          'Alternative Appointment Dates Available',
          `Dear ${appointment.name},\n\nWe would like to propose the following alternative dates for your appointment:\n\n${optionsText}\n\nPlease contact us at 0779411017 to confirm your preferred time slot.\n\nBest regards,\nYour Team`
        );
      }
    }

    // Save the updated appointment
    appointment = await appointment.save();
    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(400).json({ message: error.message });
  }
});
// Update an appointment (confirm, cancel, or update date/time)
router.put('/:id', async (req, res) => {
  try {
    const { status, options } = req.body;
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update status (confirm or cancel)
    if (status) {
      appointment.status = status;

      // Add cancelledAt timestamp if status is cancelled
      if (status === 'cancelled') {
        appointment.cancelledAt = new Date();
        await sendNotification(
          appointment.email,
          'Appointment Cancelled',
          `Dear ${appointment.name},\n\nYour appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been cancelled.\n\nPlease contact us at 0779411017 if you would like to schedule a new appointment.\n\nBest regards,\nYour Team`
        );
      } else if (status === 'confirmed') {
        // Clear cancelledAt if appointment is being confirmed
        appointment.cancelledAt = undefined;
        await sendNotification(
          appointment.email,
          'Appointment Confirmed',
          `Dear ${appointment.name},\n\nYour appointment has been confirmed for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.\n\nIf you need to make any changes, please contact us at 0779411017.\n\nBest regards,\nYour Team`
        );
      }
    }

    // Update options (if asking for new date/time)
    if (options && Array.isArray(options)) {
      appointment.options = options;
      
      if (options.length > 0) {
        // Send email about alternative dates if options are provided
        const optionsText = options
          .map((opt, index) => `Option ${index + 1}: ${new Date(opt.date).toLocaleDateString()} at ${opt.time}`)
          .join('\n');

        await sendNotification(
          appointment.email,
          'Alternative Appointment Dates Available',
          `Dear ${appointment.name},\n\nWe would like to propose the following alternative dates for your appointment:\n\n${optionsText}\n\nPlease contact us at 0779411017 to confirm your preferred time slot.\n\nBest regards,\nYour Team`
        );
      }
    }

    // Save the updated appointment
    appointment = await appointment.save();
    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (appointment) {
      await sendNotification(
        appointment.email,
        'Appointment Deleted',
        `Dear ${appointment.name},\n\nYour appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been deleted from our system.\n\nPlease contact us at 0779411017 if you would like to schedule a new appointment.\n\nBest regards,\nYour Team`
      );
      res.json({ message: 'Appointment deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;