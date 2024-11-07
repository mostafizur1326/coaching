require('dotenv').config();
const app = require('./app.js');
const connectDB = require('./db/db.js');

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