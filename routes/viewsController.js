const express = require("express");
const router = express.Router();
const Controller = require("../controllers/u-controller");
const { isAuthenticated } = require("../config/auth");

router.get("/", (req, res) => {
  res.redirect("/api/welcome");
});
router.get("/welcome", (req, res) => {
  res.render("welcome");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/homepage", isAuthenticated, Controller.homepage);

module.exports = router;
