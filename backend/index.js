import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import roomRoute from './routes/roomRoute.js';
import bookedRoomRoutes from './routes/bookedRoomRoutes.js';


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

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send("Welcome To SUNERAGIRA HOTEL");
});

app.use('/rooms', roomRoute);

app.use('/bookedRoom', bookedRoomRoutes);


