import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import roomRoute from "./routes/roomRoute.js";
import bookedRoomRoutes from "./routes/bookedRoomRoutes.js";
import weddingRoute from "./routes/weddingRoute.js";


// Load environment variables from .env file
dotenv.config();

// MongoDB connection string from .env
const mongoURI = process.env.mongoDBURL;
const PORT = process.env.PORT;

const app = express(); // Initialize the app first
const backendURL = "https://hotel-website-three-azure.vercel.app"; // Your backend URL

const app = express(); // Initialize the app first
const backendURL = "https://hotel-website-backend-drab.vercel.app/"; // Your backend URL

// Middleware
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads")); // Serve uploaded files

// Error handling middleware for Multer
app.use((err, req, res, next) => {
  if (err.message.includes("Only image files are allowed!")) {
    return res.status(400).send({ message: err.message });
  }
  next(err);
});

app.get("/", (request, response) => {
  console.log(request);
  return response.status(200).send("Welcome To SUNERAGIRA HOTEL"); // Change status code to 200
});


// Connect to MongoDB and start the server
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
