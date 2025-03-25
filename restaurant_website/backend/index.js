import express from 'express';
import mongoose from 'mongoose';
import itemRouter from './routes/itemRouter.js';
import userRouter from './routes/userRouter.js';
import orderRouter from './routes/orderRouter.js';
import productRouter from './routes/productRouter.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const mongoURI = process.env.mongoDBURL;

const app = express();
app.use(cors({
    origin: ["https://restaurantomato.vercel.app", "http://localhost:5174", "http://localhost:5173"], // Explicitly allow your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow credentials (cookies, authorization headers)
}));

// Database connection
mongoose.connect(mongoURI)
    .then(() => console.log("Connected to database"))
    .catch(err => console.error("Database connection error:", err));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// JWT Middleware
app.use((req, res, next) => {
    const header = req.header("Authorization");
    if (header) {
        const token = header.replace("Bearer ", "");
        jwt.verify(token, "random456", (err, decoded) => {
            if (err) {
                console.error("Invalid token:", err);
                return res.status(401).json({ message: "Unauthorized" });
            }
            req.user = decoded;
        });
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/item", itemRouter);
app.use("/api/user", userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/food', orderRouter);
app.use('/api/products', productRouter);

app.get('/', (request, response) => {
    console.log(request);
    return response.status(200).send("Welcome To our Restaurant");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
