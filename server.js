const dotEnv = require('dotenv')
dotEnv.config({
  path: './config.env'
})

const app = require('./app')

// Opening the server
app.listen(process.env.PORT, () => {
  console.log(`App runing on port ${process.env.PORT}...`);
});
