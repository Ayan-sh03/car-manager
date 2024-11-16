const express = require("express");
const {
  createCar,
  getUserCars,
  searchCars,
  getCarById,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const { protect } = require("../middleware/middleware");
const { body } = require("express-validator");
const upload = require("../middleware/upload");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Car management
 */

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Create a new car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - tags
 *             properties:
 *               title:
 *                 type: string
 *                 example: Tesla Model S
 *               description:
 *                 type: string
 *                 example: A sleek electric car with autopilot.
 *               tags:
 *                 type: string
 *                 example: electric,sedan,autopilot
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Car created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  protect,
  upload.array("images", 10),
  [
    body("title")
      .not()
      .isEmpty()
      .withMessage("Title is required")
      .isLength({ max: 100 })
      .withMessage("Title must not exceed 100 characters"),
    body("description")
      .not()
      .isEmpty()
      .withMessage("Description is required")
      .isLength({ max: 1000 })
      .withMessage("Description must not exceed 1000 characters"),
    body("tags").not().isEmpty().withMessage("At least one tag is required"),
  ],
  createCar
);

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all cars of the authenticated user
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cars
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getUserCars);

/**
 * @swagger
 * /api/cars/search:
 *   get:
 *     summary: Search cars by keyword
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to search in title, description, or tags
 *     responses:
 *       200:
 *         description: List of matching cars
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get("/search", protect, searchCars);

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Get a car by ID
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Car ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Car not found
 */
router.get("/:id", protect, getCarById);

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Update a car by ID
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Car ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Tesla Model S
 *               description:
 *                 type: string
 *                 example: Updated description.
 *               tags:
 *                 type: string
 *                 example: electric,sedan
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Car updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Car not found
 */
router.put(
  "/:id",
  protect,
  upload.array("images", 10),
  [
    body("title")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Title must not exceed 100 characters"),
    body("description")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Description must not exceed 1000 characters"),
    body("tags").optional(),
  ],
  updateCar
);

/**
 * @swagger
 * /api/cars/{id}:
 *   delete:
 *     summary: Delete a car by ID
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Car ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Car not found
 */
router.delete("/:id", protect, deleteCar);

module.exports = router;
