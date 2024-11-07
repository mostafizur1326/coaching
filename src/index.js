require('dotenv').config();
const connectDB = require('./db/db.js');
const app = require('./app.js');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on https://localhost:${PORT}`);
    })
  })
  .catch((error) => {
    console.log(`MongoDB database connection Failed: ${error}`)
  })