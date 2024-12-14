const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  class: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Result", resultSchema);