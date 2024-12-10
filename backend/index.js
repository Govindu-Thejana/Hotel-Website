import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import roomRoute from './routes/roomRoute.js';
import bookedRoomRoutes from './routes/bookedRoomRoutes.js';
import weddingRoute from "./routes/weddingRoute.js";
import appointments from './routes/appointments.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// MongoDB connection string from .env
const mongoURI = process.env.mongoDBURL;
const PORT = process.env.PORT;


const app = express(); // Initialize the app first
const backendURL = 'https://hotel-website-backend-drab.vercel.app/'; // Your backend URL

// Middleware
app.use(express.json());
app.use(cors());

app.get('/', (request, response) => {
    console.log(request);
    return response.status(200).send("Welcome To SUNERAGIRA HOTEL"); // Change status code to 200
});

app.use('/rooms', roomRoute);
app.use('/bookedRoom', bookedRoomRoutes);
app.use('/appointments', appointments);
app.use('/wedding', weddingRoute);

// Connect to MongoDB and start the server
mongoose
    .connect(mongoURI)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('MongoDB connection error:', error);
    });
