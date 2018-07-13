const express = require('express');
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router  = express.Router();
const bcryptSalt = 10;

const passport = require('passport')

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ""
  });
});

router.post('/signup', (req, res, next) => {
  const { name, email, password} = req.body;

  var fieldsPromise = new Promise((resolve, reject) => {
    if (password === "" || email === "") {
      reject(new Error("Indicate a username, email and password to sign up"));
    } else if (!validateEmail(email)) {
      reject(new Error("You should write a valid email"));
    } else {
      resolve();
    }
  });

  fieldsPromise.then((() => {
    return User.findOne({ email });
  }))
  .then(user => {
    if (user) {
      throw new Error("User already exists");
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashPass
    });

    return newUser.save();
  })
  .then(() => {
    res.redirect("/");
  })
  .catch(err => {
    res.render('auth/signup', {
      errorMessage: err.message
    });
  });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    errorMessage: ""
  });
});

router.post('/login', passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect("/");
})


const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

module.exports = router;
