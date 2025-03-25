import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Function to save a new user
export function saveUsers(req, res) {
    try {
        const { email, firstName, lastName, password } = req.body;

        // Validate input
        if (!email || !firstName || !lastName || !password) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }

        const hashPassword = bcrypt.hashSync(password, 10);
        const user = new User({
            email,
            firstName,
            lastName,
            password: hashPassword,
        });

        user.save((err) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to save user."
                });
            }

            res.json({
                message: "User saved successfully."
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error."
        });
    }
}

// Function to login a user
export function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill in both email and password."
            });
        }

        User.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to find user."
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: "User not found."
                });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(403).json({
                    message: "Password incorrect."
                });
            }

            const userData = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                phone: user.phone,
                isDisabled: user.isDisabled,
                isEmailVerified: user.isEmailVerified
            };

            const token = jwt.sign(userData, process.env.SECRET_KEY, {
                expiresIn: '1h' // Token expires in 1 hour
            });

            res.json({
                message: "Login successful.",
                token
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error."
        });
    }
}
