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

// Function to generate appointment email content with enhanced UI
function generateAppointmentEmailContent(appointment, status = 'created') {
  const appointmentDate = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  let title, message;
  switch (status) {
    case 'confirmed':
      title = 'Appointment Confirmed';
      message = `Your appointment has been confirmed for ${appointmentDate} at ${appointment.time}.`;
      break;
    case 'cancelled':
      title = 'Appointment Cancelled';
      message = `Your appointment scheduled for ${appointmentDate} at ${appointment.time} has been cancelled.`;
      break;
    case 'updated':
      title = 'Appointment Updated';
      message = `Your appointment has been rescheduled to ${appointmentDate} at ${appointment.time}.`;
      break;
    case 'options':
      title = 'Alternative Appointment Options';
      message = `We have some alternative appointment options available for you.`;
      break;
    case 'deleted':
      title = 'Appointment Deleted';
      message = `Your appointment scheduled for ${appointmentDate} at ${appointment.time} has been removed from our system.`;
      break;
    default:
      title = 'Appointment Confirmation';
      message = `Thank you for scheduling an appointment with Suneragira Hotel.`;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                overflow: hidden;
            }
            .header {
                background: #003366;
                padding: 20px;
                text-align: center;
            }
            .header img {
                max-width: 180px;
            }
            .content {
                padding: 25px;
            }
            .section {
                background: #f8fafc;
                padding: 20px;
                border-radius: 12px;
                margin-bottom: 20px;
            }
            h1 {
                color: #fff;
                margin: 0;
                font-size: 24px;
                font-weight: 700;
            }
            h2 {
                color: #003366;
                font-size: 18px;
                margin: 0 0 15px;
                font-weight: 600;
            }
            p {
                margin: 0 0 10px;
                font-size: 14px;
                line-height: 1.5;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .label {
                color: #666;
                font-size: 13px;
            }
            .value {
                font-weight: 500;
                font-size: 13px;
            }
            .button {
                display: inline-block;
                background: #ff9800;
                color: #fff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 8px;
                margin-top: 15px;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.3s;
            }
            .button:hover {
                background: #e68900;
            }
            .options-list {
                padding-left: 20px;
                margin: 10px 0;
            }
            .options-list li {
                font-size: 13px;
                margin: 5px 0;
                color: #444;
            }
            .footer {
                background: #003366;
                color: #fff;
                text-align: center;
                padding: 15px;
                font-size: 12px;
            }
            .footer a {
                color: #fff;
                text-decoration: none;
                margin: 0 8px;
            }
            .social-icons {
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://suneragirahotel.vercel.app/images/logo.png" alt="Suneragira Hotel Logo">
                <h1>${title}</h1>
            </div>
            
            <div class="content">
                <div class="section">
                    <h2>Hello, ${appointment.name}!</h2>
                    <p>${message} Please find the details below.</p>
                </div>

                <div class="section">
                    <h2>Appointment Details</h2>
                    <div class="detail-row">
                        <span class="label">Name : </span>
                        <span class="value">${appointment.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Date : </span>
                        <span class="value">${appointmentDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Time : </span>
                        <span class="value">${appointment.time}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Reason : </span>
                        <span class="value">${appointment.reason}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Status : </span>
                        <span class="value">${appointment.status}</span>
                    </div>
                    ${appointment.options && status === 'options' ? `
                    <div class="detail-row">
                        <span class="label">Alternative Options : </span>
                        <ul class="options-list">
                            ${appointment.options.map(opt => `<li>${new Date(opt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at ${opt.time}</li>`).join('')}
                        </ul>
                    </div>` : ''}
                </div>

                <div class="section">
                    <h2>Contact Information</h2>
                    <p>Suneragira Hotel</p>
                    <p>Nababawa , Nikaweratiya, Sri Lanka</p>
                    <p>Phone: +94 11 123 4567</p>
                    <p>Email: suneragirahotel@gmail.com</p>
                    ${status !== 'deleted' && status !== 'cancelled' ? `
                    <p>For any changes or questions, please contact us at the above details.</p>
                    <a href="https://suneragirahotel.vercel.app/contact" class="button">Contact Us</a>
                    ` : ''}
                </div>
            </div>

            <div class="footer">
                <p>© 2025 Suneragira Hotel. All Rights Reserved.</p>
                <p>123 Paradise Road, Colombo, Sri Lanka</p>
                <div class="social-icons">
                    <a href="https://www.facebook.com/Hotel.Suneragira">Facebook</a> |
                    <a href="https://www.instagram.com/explore/locations/1072762726170493/hotel-suneragira/">Instagram</a> |
                    <a href="https://www.youtube.com/@SuneragiraNikaweratiya">YouTube</a>
                </div>
                <p><a href="https://suneragirahotel.vercel.app">Visit Our Website</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Function to send appointment notification email
async function sendAppointmentConfirmation(email, subject, appointment, status) {
  try {
    const emailContent = generateAppointmentEmailContent(appointment, status);

    await transporter.sendMail({
      from: 'Suneragira Hotel <yasirukularathne1234@gmail.com>',
      to: email,
      subject,
      html: emailContent,
    });
    console.log(`Appointment ${status} email sent successfully to ${email}`);
  } catch (error) {
    console.error(`Error sending ${status} email:`, error.message);
  }
}

// Create a new appointment
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, date, time, reason } = req.body;

    const appointment = new Appointment({
      name,
      email,
      phone,
      date,
      time,
      reason,
      status: 'pending',
      createdAt: new Date(),
    });

    const savedAppointment = await appointment.save();

    // Send email to the owner
    await sendAppointmentConfirmation(
      'yasirukularathne1234@gmail.com',
      'New Appointment Created',
      savedAppointment,
      'created'
    );

    // Send confirmation to the client
    await sendAppointmentConfirmation(
      email,
      'Appointment Confirmation',
      savedAppointment,
      'created'
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

// Update an appointment
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

    // Handle status updates
    if (status) {
      appointment.status = status;

      if (status === 'cancelled') {
        appointment.cancelledAt = new Date();
        await sendAppointmentConfirmation(
          appointment.email,
          'Appointment Cancelled',
          appointment,
          'cancelled'
        );
      } else if (status === 'confirmed') {
        appointment.cancelledAt = undefined;
        await sendAppointmentConfirmation(
          appointment.email,
          'Appointment Confirmed',
          appointment,
          'confirmed'
        );
      }
    }

    // If date or time was updated, send notification
    if ((date || time) && !status) {
      await sendAppointmentConfirmation(
        appointment.email,
        'Appointment Time Updated',
        appointment,
        'updated'
      );
    }

    // Update options if provided
    if (options && Array.isArray(options)) {
      appointment.options = options;

      if (options.length > 0) {
        await sendAppointmentConfirmation(
          appointment.email,
          'Alternative Appointment Dates Available',
          appointment,
          'options'
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
      await sendAppointmentConfirmation(
        appointment.email,
        'Appointment Deleted',
        appointment,
        'deleted'
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