const express = require("express");
const router = express.Router();
const { registerClient } = require("../controllers/clientController");

router.post("/register", registerClient);

module.exports = router;
