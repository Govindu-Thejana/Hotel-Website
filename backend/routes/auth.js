import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import UserModel from "../models/user.js";

const router = express.Router();
const JWT_SECRET = "your-secret-key"; // Use an environment variable in production

// Hardcoded admin credentials
const ADMIN_USERNAME = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

// Hash password using crypto
const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return { salt, hash };
};

// Verify password
const verifyPassword = (password, hash, salt) => {
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return hashedPassword === hash;
};

// Register a new user
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const { salt, hash } = hashPassword(password);
        const newUser = new UserModel({ name, email, password: hash, salt });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

// Login a user and generate JWT
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!verifyPassword(password, user.password, user.salt)) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

// Admin login and generate JWT
router.post("/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "2h" });
        return res.status(200).json({ message: "Admin login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid admin credentials" });
    }
});

// Middleware to verify JWT for admin
const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token is required" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admin only" });
        }
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired" });
        }
        return res.status(403).json({ message: "Invalid token" });
    }
};

// Example protected route for admin
router.get("/admin/protected", authenticateAdmin, (req, res) => {
    res.status(200).json({ message: "Welcome, Admin! This is a protected route." });
});

export default router;
