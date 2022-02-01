const mongoose = require('mongoose');
const dotEnv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXEPTION!')
  console.log(err.name, err.message)
  process.exit(1)
})

dotEnv.config({
  path: './config.env',
});
const app = require('./app');

// console.log(process.env)

const DB = process.env.DB_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, { useNewUrlParser: true })
  .then((con) => {
    console.log('DB Connection Successfull');
  })
  

// mongoose.connection.on('error', (err) => {
//   console.log(err);
// });

// Opening the server
const server = app.listen(process.env.PORT, () => {
  console.log(`App runing on port ${process.env.PORT}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION!')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})