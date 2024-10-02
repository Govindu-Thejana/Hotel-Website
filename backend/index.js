import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from './models/user.js';
import roomRoute from './routes/roomRoute.js';


const app = express();
app.use(express.json());


//Middleware for passing request body
app.use(express.json());

// Middleware for handling CORS POLICY
app.use(cors());

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send("Welcome To SUNERAGIRA HOTEL");
});

app.use('/rooms', roomRoute);




mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });


app.post('/register', (req, res) => {
    UserModel.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json("Success")
                } else {
                    res.json("the password is incorrect")
                }
            } else {
                res.json("No record existed")

            }
        })
})


// POST create a new booking
app.post('/bookings', async (req, res) => {
    try {
        const { name, email, phoneNumber, checkIn, checkOut, guests, specialRequests, roomType, roomId, status, Breakfast, Lunch, Dinner, Extra } = req.body;

        if (!name || !email || !phoneNumber || !checkIn || !checkOut || !guests || !roomType || !roomId) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const newBooking = new BookingModel({
            name,
            email,
            phoneNumber,
            checkIn,
            checkOut,
            guests,
            specialRequests,
            roomType,
            roomId,
            status,
            Breakfast,
            Lunch,
            Dinner,
            Extra
        });

        const booking = await booking.create(newBooking);
        return res.status(201).send(booking);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});