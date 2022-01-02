const app = require('./app')

// Opening the server
const port = 3000;
app.listen(port, () => {
  console.log(`App runing on port ${port}...`);
});
