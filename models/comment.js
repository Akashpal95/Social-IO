const mongoose = require("mongoose");

const commmentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like"
      }
    ]
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commmentSchema);
module.exports = Comment;
