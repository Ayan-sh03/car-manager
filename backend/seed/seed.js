require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/user");
const Car = require("../models/car");

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Car.deleteMany();

    // Create a user
    const user = await User.create({
      username: "seeduser",
      email: "seeduser@example.com",
      password: "password123",
    });

    // Create cars
    const cars = [
      {
        user: user._id,
        title: "Tesla Model S",
        description: "A sleek electric car with autopilot.",
        tags: ["electric", "sedan", "autopilot"],
        images: [],
      },
      {
        user: user._id,
        title: "Ford Mustang",
        description: "A classic American muscle car.",
        tags: ["muscle", "classic", "coupe"],
        images: [],
      },
      // Add more cars as needed
    ];

    await Car.insertMany(cars);

    console.log("Database seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
