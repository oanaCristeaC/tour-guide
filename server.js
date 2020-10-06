const dotenv = require('dotenv');

dotenv.config({
  path: './config.env',
});
const app = require('./app');

const port = process.env.PORT || 8000;

// App running
app.listen(port, () => {
  console.log(`App listen at port ${port}`);
});
