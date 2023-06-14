const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../config/auth");

const Controller = require("../controllers/u-controller");

router.get("/welcome", Controller.getWelcome);
router.post("/signup", Controller.signup);
router.post("/login", Controller.login);
router.get("/logout", Controller.logout);

router.get("/test/:testId/questions",isAuthenticated,Controller.getQuestionsForTest);
router.post("/submit-test", isAuthenticated, Controller.submitTest);
router.post("/edit/phonenumber", isAuthenticated, Controller.editPhoneNumber);
router.get("/profile", isAuthenticated, Controller.getProfile);

module.exports = router;
