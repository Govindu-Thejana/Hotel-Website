import nodemailer from 'nodemailer';

// Nodemailer transporter setup (using Gmail as an example)
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

// Function to send an email
async function sendEmail(to, subject, text, html) {
    try {
        const mailOptions = {
            from: 'Suneragira Hotel <yasirukularathne1234@gmail.com>',
            to,
            subject,
            text, // Plain text version
            html, // HTML version
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}:`, result);
        return result;
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw error;
    }
}

// Function to generate booking email content
function generateBookingEmailContent(booking) {
    const checkIn = new Date(booking.checkIn).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const checkOut = new Date(booking.checkOut).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
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
            .addon-list {
                padding-left: 20px;
                margin: 10px 0;
            }
            .addon-list li {
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
                <h1>Booking Confirmation</h1>
            </div>
            <div class="content">
                <div class="section">
                    <h2>Welcome, ${booking.fullName}!</h2>
                    <p>Thank you for choosing Suneragira Hotel. We're excited to confirm your reservation and look forward to making your stay exceptional.</p>
                </div>
                <div class="section">
                    <h2>Booking Details</h2>
                    <div class="detail-row">
                        <span class="label">Confirmation Code:</span>
                        <span class="value">${booking.bookingConfirmationCode}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Check-in:</span>
                        <span class="value">${checkIn}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Check-out:</span>
                        <span class="value">${checkOut}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Room Type:</span>
                        <span class="value">${booking.roomId.roomType}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Guests:</span>
                        <span class="value">${booking.guests.adults} Adult${booking.guests.adults > 1 ? 's' : ''}${booking.guests.children > 0 ? `, ${booking.guests.children} Child${booking.guests.children > 1 ? 'ren' : ''}` : ''}</span>
                    </div>
                    ${booking.addons.length > 0 ? `
                    <div class="detail-row">
                        <span class="label">Add-ons:</span>
                        <ul class="addon-list">
                            ${booking.addons.map(addon => `<li>${addon.type}</li>`).join('')}
                        </ul>
                    </div>` : ''}
                    <div class="detail-row">
                        <span class="label">Total Amount:</span>
                        <span class="value">$${booking.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
                <div class="section">
                    <h2>Hotel Information</h2>
                    <p>Suneragira Hotel</p>
                    <p>123 Paradise Road, Colombo, Sri Lanka</p>
                    <p>Phone: +94 11 123 4567</p>
                    <p>Email: suneragirahotel@gmail.com</p>
                </div>
                <div class="section">
                    <h2>Stay Information</h2>
                    <div class="detail-row">
                        <span class="label">Check-in Time:</span>
                        <span class="value">2:00 PM</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Check-out Time:</span>
                        <span class="value">11:00 AM</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Cancellation Policy:</span>
                        <span class="value">${booking.roomId.cancellationPolicy}</span>
                    </div>
                    <p>Please present this confirmation at check-in. For any assistance, contact us anytime.</p>
                    <a href="https://suneragirahotel.vercel.app/my-bookings" class="button">Manage Booking</a>
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

// Function to generate plain text booking content
function generateBookingPlainTextContent(booking) {
    const checkIn = new Date(booking.checkIn).toLocaleDateString();
    const checkOut = new Date(booking.checkOut).toLocaleDateString();

    return `
    Dear ${booking.fullName},
    
    Thank you for choosing Suneragira Hotel for your upcoming stay! We are delighted to confirm your reservation.
    Below are the details of your booking:
    
    BOOKING DETAILS:
    - Confirmation Code: ${booking.bookingConfirmationCode}
    - Guest Name: ${booking.fullName}
    - Check-in Date: ${checkIn}
    - Check-out Date: ${checkOut}
    - Room Type: ${booking.roomId.roomType}
    - Number of Guests: Adults: ${booking.guests.adults}, Children: ${booking.guests.children}
    - Addons: ${booking.addons.join(', ')}
    - Total Amount: $${booking.totalAmount}

    HOTEL INFORMATION:
    - Hotel Name: Suneragira Hotel
    - Address: Nababawa.Nikaweratiya , Nikaweratiya, Sri Lanka
    - Phone: 0372 260 002
    - Email: suneragira@gmail.com
    
    ADDITIONAL INFORMATION:
    Check-In Time: 2:00 PM
    Check-Out Time: 11:00 AM
    Check-In Instructions: Please present this confirmation email or your confirmation number at the front desk upon arrival.
    Cancellation Policy: ${booking.roomId.cancellationPolicy} Cancellations made 48 hours or more prior to check-in: No cancellation fee. A full refund will be issued.
    
    We're excited to welcome you to Suneragira Hotel! Should you have any questions, need to modify your booking, or require additional assistance, please don't hesitate to reach out to us at reservations@suneragirahotel.com or +94 11 123 4567.

    Looking forward to making your stay memorable!

    Warm regards,
    Samantha Perera
    Reservations Manager
    Suneragira Hotel
    https://suneragirahotel.vercel.app
    `;
}

// Function to send booking confirmation email
export async function sendBookingConfirmation(booking) {
    const htmlContent = generateBookingEmailContent(booking);
    const textContent = generateBookingPlainTextContent(booking);
    return sendEmail(
        booking.email,
        `Booking Confirmation: ${booking.bookingConfirmationCode}`,
        textContent,
        htmlContent
    );
}

export default {
    sendBookingConfirmation,
};