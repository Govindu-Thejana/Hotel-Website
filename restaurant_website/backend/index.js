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
import { WebSocketServer } from 'ws';
import Order from './models/order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const mongoURI = process.env.mongoDBURL;

const app = express();
const server = app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});

// WebSocket Server Setup
const wss = new WebSocketServer({ server });

app.use(cors({
    origin: ["https://amarasarestaurant.vercel.app", "https://amarasa-admin.vercel.app", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to database"))
    .catch(err => console.error("Database connection error:", err));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// WebSocket Connection Handling
wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');

    ws.send(JSON.stringify({ message: "Connected to order updates" }));

    const changeStream = Order.watch();
    changeStream.on('change', (change) => {
        console.log('Order change detected:', change);
        let updateData;
        switch (change.operationType) {
            case 'insert':
            case 'update':
                updateData = {
                    operation: change.operationType,
                    order: change.fullDocument || change.documentKey
                };
                break;
            case 'delete':
                updateData = {
                    operation: change.operationType,
                    orderId: change.documentKey._id
                };
                break;
            default:
                return;
        }
        ws.send(JSON.stringify(updateData));
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
        changeStream.close();
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// JWT Middleware and other routes remain the same
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

app.use("/api/item", itemRouter);
app.use("/api/user", userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/food', orderRouter);
app.use('/api/products', productRouter);

app.get('/', (request, response) => {
    console.log(request);
    return response.status(200).send("Welcome To our Restaurant");
});