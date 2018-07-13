const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("../middleware/ensureLogin");
const User = require("../models/User");
const LaundryPickup = require("../models/Laundry-pickup");

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

router.get("/launderers/:id", ensureLoggedIn("/login"), (req, res, next) => {
  User.findById(req.params.id)
  .then(launderer => {
    res.render("laundry/launderer-profile", {theLaunderer: launderer})
  })
  .catch(err => {
    next(err);
  })
});

router.post("/laundry-pickups", ensureLoggedIn("/login"), (req, res, next) => {
  const user = req.user._id;
  const { pickupDate, laundererId } = req.body;

  var fieldsPromise = new Promise((resolve, reject) => {
    if (pickupDate === "" || laundererId === "") {
      reject(new Error("Invalid pickup"));
    } else {
      resolve();
    }
  });

  fieldsPromise.then(() => {
    const thePickup = new LaundryPickup({
      pickupDate,
      launderer: laundererId,
      user
    });

    return thePickup.save();
  })
  .then(pickup => {
    req.flash("success", "Your pickup has been scheduled");
    res.redirect("/dashboard");
  })
  .catch(err => {
    next(err);
  });
});

module.exports = router;
