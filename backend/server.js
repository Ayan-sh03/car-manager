const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const cors = require("cors");
const setupSwagger = require("./swagger/swagger");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS
// Enable CORS with specific origins
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);

// Swagger documentation
setupSwagger(app);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
