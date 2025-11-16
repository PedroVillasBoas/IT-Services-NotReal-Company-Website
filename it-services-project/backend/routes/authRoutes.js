const express = require("express");
const router = express.Router();
const {
  loginClient,
  changePassword,
} = require("../controllers/authController");

router.post("/login", loginClient);

router.put("/change-password", changePassword);

module.exports = router;
