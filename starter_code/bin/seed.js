require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const dbUrl = process.env.DBURL;

mongoose.Promise = Promise;
mongoose
  .connect( dbUrl, { useMongoClient: true })
  .then(() => {
    console.log("Connected to Mongo!");

    User.collection.drop();

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync("1111", salt);
    
    const users = [
      {
        name: "No sé",
        email: "test@test.com",
        password: hashPass,
        isLaunderer: true,
        fee: 50
      },
      {
        name: "Test1",
        email: "test1@test.com",
        password: hashPass,
        isLaunderer: true,
        fee: 80
      },
      {
        name: "Test2",
        email: "test2@test.com",
        password: hashPass,
        isLaunderer: true,
        fee: 40
      }
    ]

    User.create(users)
      .then((data) => {
        console.log(`${data.length} launderers created.`);

        mongoose.disconnect();
      });
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });