import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from './models/user.js';
import roomRoute from './routes/roomRoute.js';
import BookingModel from "./models/bookingModel.js";

const app = express();

//Middleware for passing request body
app.use(express.json());

// Middleware for handling CORS POLICY
// Option 1: Allow All Origins with Default of cors(*)
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



// Create a new booking
app.post('/bookings', async (req, res) => {
    try {
        const {
            name, email, phoneNumber, checkIn, checkOut, guests, specialRequests, roomType, roomId, status, Breakfast, Lunch, Dinner, Extra } = req.body;
        if (!name || !email || !phoneNumber || !checkIn || !checkOut || !guests || !roomType || !roomId) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }
        const newBooking = new BookingModel({
            name,
            email,
            phoneNumber,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests,
            specialRequests,
            roomType,
            roomId,
            status: status || 'pending',
            Breakfast: Breakfast || 0,
            Lunch: Lunch || 0,
            Dinner: Dinner || 0,
            Extra: Extra || 'no'
        });

        const booking = await newBooking.save();  // Use .save() instead of create() for a Mongoose document
        return res.status(201).send(booking);
    } catch (error) {
        console.log(error.message);
        res.status(400).send({ message: error.message })
    }
});

// Get all bookings
app.get('/bookings', async (req, res) => {
    try {
        const bookings = await BookingModel.find({});
        return res.status(200).json({
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Get a specific booking
app.get('/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Validate the ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Room ID' });
        }
        const booking = await BookingModel.findById(req.params.id).populate('roomId');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        return res.status(200).json(room);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
        res.status(500).json({ message: error.message });
    }
});

// Update a booking
app.put('/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Booking ID' });
        }

        const {
            name, email, phoneNumber, checkIn, checkOut, guests, specialRequests, roomType, roomId, status, Breakfast, Lunch, Dinner, Extra
        } = req.body;

        if (!name || !email || !phoneNumber || !checkIn || !checkOut || !guests || !roomType || !roomId) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const updateBooking = await BookingModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updateBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Return the updated booking
        return res.status(200).send({ message: 'Booking updated successfully', booking: updateBooking });

    } catch (error) {
        console.log(error.message);
        res.status(400).send({ message: error.message });
    }
});


// Delete a booking
app.delete('/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Validate the ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Room ID' });
        }
        const deletedBooking = await BookingModel.findByIdAndDelete(id);
        if (!deletedBooking) return res.status(404).json({ message: 'Booking not found' });
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});


