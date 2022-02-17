const fs = require('fs');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const Tour = require('./../../models/tourModels');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');

dotEnv.config({
  path: './config.env',
});

console.log(process.env)

const DB = process.env.DB_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

try {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
    })
    .then((con) => {
      console.log('DB Connection Successfull');
    });
} catch (err) {
  console.log(err);
}

// Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// Import data into db
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, {validateBeforeSave: false});
    await Review.create(reviews);

    console.log('Data successfuly loaded');
  } catch (err) {
    console.log(err);
  }
};

// Delete all data from db collection

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data succesfuly deleted');
    process.exit()
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv) // Array of arguments running on the node aplication

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}