const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");
module.exports.toggleLikeCheck = function(req, res) {
  console.log("Like Toggled!!");
  console.log(req.query);
  return res.redirect("back");
};
module.exports.toggleLike = async function(req, res) {
  try {
    //likes/toggle/?id=abcdef&type=Post
    let likeable;
    let deleted = false;
    if (req.query.type == "Post") {
      likeable = await Post.findById(req.query.id).populate("likes");
    } else {
      likeable = await Comment.findById(req.query.id).populate("likes");
    }
    console.log("LIKEABLE : ", likeable);
    let existingLike = await Like.findOne({
      likeable: req.query.id,
      onModel: req.query.type,
      user: req.user._id
    });
    //delete if like already exists
    if (existingLike) {
      console.log("Like already exists!!");
      //pulling it out of the array in Post or Comment likes array
      likeable.likes.pull(existingLike._id);
      likeable.save();
      //Actually remove the like object from Like model
      existingLike.remove();
      deleted = true;
    } else {
      //Else make a new like
      let newLike = await Like.create({
        user: req.user._id,
        likeable: req.query.id,
        onModel: req.query.type
      });

      likeable.likes.push(newLike._id);
      likeable.save();
    }

    // return res.status(200).json({
    //   message: "Like Request Successfull!",
    //   data: {
    //     deleted: deleted
    //   }
    // });
    return res.redirect("back");
  } catch (err) {
    console.log(err);
    req.flash("error", "Hmm! It seems the like button isn't working.");
    console.log("Error : ", err);
    return res.redirect("back");
    // return res.status(500).json({
    //   message: "Internal Server Error!"
    // });
  }
};
