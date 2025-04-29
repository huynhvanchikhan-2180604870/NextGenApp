const express = require("express");
const authenticationController = require("../controllers/authentication.controller");
const router = express.Router();

router.post("/signup", authenticationController.signup);
router.post("/signin", authenticationController.signin);
router.post("/signout", authenticationController.signout);
router.patch(
  "/send-verification-code",
  authenticationController.sendVerificationCode
);
router.patch(
  "/verify-verification-code",
  authenticationController.verifyVerificationCode
);
module.exports = router;
