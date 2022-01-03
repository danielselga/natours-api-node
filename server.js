const mongoose = require('mongoose');
const dotEnv = require('dotenv');
dotEnv.config({
  path: './config.env',
});
const app = require('./app');

console.log(process.env)

const DB = process.env.DB_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

try {
  mongoose.connect(DB, {
    useNewUrlParser: true,
  }).then(con => {
    console.log('DB Connection Successfull')
  })
} catch (err) {
  console.err(err);
}

mongoose.connection.on('error', err => {
  logError(err);
});

// Opening the server
app.listen(process.env.PORT, () => {
  console.log(`App runing on port ${process.env.PORT}...`);
});
