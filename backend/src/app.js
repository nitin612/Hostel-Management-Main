import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/dbConfig.js";
import { authRouter as authRoutes } from "./routes/authRoutes.js";

dotenv.config(); // Load environment variables

// Debugging: Check if environment variables are loaded
if (!process.env.PORT) {
    console.warn("⚠️ Warning: PORT is not defined in .env file!");
}
if (!process.env.CONNECTION_STRING) {
    console.warn("⚠️ Warning: CONNECTION_STRING is not defined in .env file!");
}

const app = express();

// Middleware
app.use(express.json());

// Connect to Database
connectDb().catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1); // Exit process if DB connection fails
});

// Define Routes
app.get("/", (req, res) => {
    console.log("✅ Root endpoint hit");
    res.status(200).json({ message: "You will be successful!" });
});

app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

