const express = require("express");
const router = express.Router();
const {
  getUserRequests,
  updateUserRequests,
} = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");

// All routes in this file are protected and require a valid JWT
router.use(protect);

router.get("/", getUserRequests);

router.put("/", updateUserRequests);

module.exports = router;
