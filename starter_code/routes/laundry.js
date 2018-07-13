const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("../middleware/ensureLogin");
const User = require("../models/User");

router.get("/dashboard", ensureLoggedIn("/login"), (req, res, next) => {
  res.render("laundry/dashboard");
});

router.post("/launderers", ensureLoggedIn("/login"), (req, res, next) => {
  const userId = req.user._id;
  const { fee } = req.body;

  User.findByIdAndUpdate(userId, { fee, isLaunderer: true })
    .then(user => {
      req.flash("success", "You have changed your fee.");
      res.redirect("/dashboard");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/launderers", ensureLoggedIn("/login"), (req, res, next) => {
  User.find({ isLaunderer: true, _id: {$ne: req.user._id}})
  .then(launderers => {
    res.render("laundry/launderers", {launderers})
  })
  .catch(err => {
    next(err);
  })
});
module.exports = router;
