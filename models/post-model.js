const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  post_image: {
    type: String,
  },
  post_title: {
    type: String,
  },
  post_description: {
    type: String,
  },
}, { timestamps: true });

postSchema.statics.getAllPosts = function() {
  return this.find();
};
module.exports = mongoose.model("Post", postSchema);