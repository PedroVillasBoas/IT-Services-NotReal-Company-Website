const express = require("express");
const router = express.Router();
const {
  getServices,
  createService,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getServices);

router.post("/", protect, createService);

module.exports = router;
