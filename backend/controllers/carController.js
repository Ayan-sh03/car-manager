const upload = require("../middleware/upload");
const Car = require("../models/car");
const { validationResult } = require("express-validator");

// @desc    Create new car
// @route   POST /api/cars
// @access  Private
const createCar = async (req, res, next) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { title, description, tags } = req.body;

  // Handle tags as array
  const tagsArray = tags.split(",").map((tag) => tag.trim());

  // Handle images
  let images = [];
  if (req.files) {
    images = req.files.map((file) => file.path);
  }

  console.log(images);

  try {
    const car = await Car.create({
      user: req.user._id,
      title,
      description,
      tags: tagsArray,
      images,
    });

    console.log("the car ", car);
    res.status(201).json(car);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all cars of the authenticated user
// @route   GET /api/cars
// @access  Private
const getUserCars = async (req, res, next) => {
  try {
    const cars = await Car.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    next(error);
  }
};

// @desc    Global search through all cars of the authenticated user
// @route   GET /api/cars/search
// @access  Private
const searchCars = async (req, res, next) => {
  const { keyword } = req.query;

  try {
    const cars = await Car.find({
      user: req.user._id,
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json(cars);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single car by ID
// @route   GET /api/cars/:id
// @access  Private
const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, user: req.user._id });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(car);
  } catch (error) {
    next(error);
  }
};

// @desc    Update car by ID
// @route   PUT /api/cars/:id
// @access  Private
const updateCar = async (req, res, next) => {
  try {
    let car = await Car.findOne({ _id: req.params.id, user: req.user._id });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const { title, description, tags } = req.body;

    if (title) car.title = title;
    if (description) car.description = description;
    if (tags) car.tags = tags.split(",").map((tag) => tag.trim());

    // Handle new images
    if (req.files && req.files.length > 0) {
      if (car.images.length + req.files.length > 10) {
        return res
          .status(400)
          .json({ message: "Maximum of 10 images are allowed" });
      }
      const newImages = req.files.map((file) => file.path);
      car.images = car.images.concat(newImages);
    }

    await car.save();

    res.json(car);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete car by ID
// @route   DELETE /api/cars/:id
// @access  Private
const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({ message: "Car removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCar,
  getUserCars,
  searchCars,
  getCarById,
  updateCar,
  deleteCar,
};
