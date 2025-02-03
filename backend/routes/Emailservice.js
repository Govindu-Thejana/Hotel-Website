// emailService.js
import nodemailer from "nodemailer";

// Configure the transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "hasithaudara1028@gmail.com",
        pass: "kdar vzgy qltt ijql",
    },
});

// Function to send emails
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: "udarahasitha002@gmail.com",
        to,
        subject,
        text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

export default sendEmail;