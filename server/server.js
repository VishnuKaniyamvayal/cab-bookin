import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import passengerRoutes from "./routes/passenger.js";

/* App Config */
dotenv.config();
const app = express();
const port = 5000;

/* Middlewares */
app.use(express.json());
app.use(cors());

app.use(express.static('uploads')); // Serve static files from the 'uploads' folder

/* API Routes */
app.use("/api/auth", authRoutes);
app.use("/api/passenger", passengerRoutes);

/* MongoDB connection */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://root:12345@cluster1.1txjjxf.mongodb.net/cabconnect")
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

connectDB();

app.get("/", (req, res) => {
  res.status(200).send("Welcome to LibraryApp");
});


app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = `uploads/${filename}`;
  res.sendFile(filePath, { root: '.' });
});

/* Port Listening In */
app.listen(port, () => {
  console.log(`Server is running in PORT ${port}`);
});
