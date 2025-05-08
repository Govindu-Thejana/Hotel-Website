// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import UserModel from "../models/user.js";
import sendEmail from "./emailService.js";
import authenticateToken from "../middleware/authenticateToken.js"; // Middleware to authenticate JWT

const router = express.Router();
const JWT_SECRET = "your-secret-key"; // Use env var in production

// Hashing helpers
const hashPassword = (password) => {
const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
return { salt, hash };
};

const verifyPassword = (password, hash, salt) => {
const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
return hashedPassword === hash;
};

// ✅ Register (User or Admin)
router.post("/register", async (req, res) => {
const { name, email, password, isAdmin } = req.body;


if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
}

try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
    }

    const { salt, hash } = hashPassword(password);
    const newUser = new UserModel({ name, email, password: hash, salt, isAdmin: !!isAdmin });
    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
} catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
}


});

router.post("/login", async (req, res) => {
const { email, password } = req.body;


const hardcodedAdmin = {
    email: "admin@example.com",
    password: "admin123", // Store hashed in production
};

if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
}

// ✅ Check for hardcoded admin
if (email === hardcodedAdmin.email && password === hardcodedAdmin.password) {
    const token = jwt.sign(
        { id: "admin-hardcoded-id", email: email, isAdmin: true },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
    return res.status(200).json({
        message: "Hardcoded Admin login successful",
        token,
        isAdmin: true,
    });
}

// ✅ Normal user logic
try {
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (!verifyPassword(password, user.password, user.salt)) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.status(200).json({
        message: user.isAdmin ? "Admin login successful" : "User login successful",
        token,
        isAdmin: user.isAdmin,
    });
} catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
}


});

// ✅ Protected Admin Route
router.get("/admin/protected", authenticateToken, async (req, res) => {
const user = await UserModel.findById(req.userId);
if (!user || !user.isAdmin) {
return res.status(403).json({ message: "Forbidden: Admins only" });
}

```
res.status(200).json({ message: "Welcome, Admin! This is a protected route." });
```

});

// ✅ Admin Forgot Password (Email)
router.post("/admin/forgot-password", async (req, res) => {
try {
const { email } = req.body;
const admin = await UserModel.findOne({ email, isAdmin: true });
if (!admin) {
return res.status(404).json({ message: "Admin not found" });
}


    const emailSent = await sendEmail(
        admin.email,
        "Password Reset",
        `Your password cannot be retrieved directly. Please reset it securely.`
    );

    if (emailSent) {
        res.status(200).json({ message: "Email sent successfully" });
    } else {
        res.status(500).json({ message: "Failed to send email" });
    }
} catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
}


});

export default router;

