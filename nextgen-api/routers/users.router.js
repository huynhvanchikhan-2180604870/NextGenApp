const express = require("express");
const userController = require("../controllers/users.controller");
const router = express.Router();
router.get("/profile", userController.getProfile);
module.exports = router;
