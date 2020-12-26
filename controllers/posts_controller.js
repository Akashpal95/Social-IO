const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function (req, res) {
  if (req.isAuthenticated()) {
    try {
      let post = await Post.create({
        content: req.body.content,
        user: req.user._id
      });
      //To check if the req is a ajax req or not
      if (req.xhr) {
        return res.status(200).json({
          data: {
            post: post,
            username: req.user.name,
            user_id: req.user._id
          },
          message: 'Post Created!!'
        });
      }

      req.flash('success', 'Successfully Posted!!');
      return res.redirect('back');
    } catch (err) {
      req.flash('error', err);
      if (err) {
        console.log(`Error in posting comment/status : ${err}`);
        return;
      }
    }
  } else {
    return res.redirect('back');
  }
};
module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id).populate('comments');
    console.log('POST : ', post);
    //._id is objectId and .id gives string format of ID
    if (post.user == req.user.id) {
      await Like.deleteMany({ likeable: post, onModel: 'Post' });

      //Best method to delete likes associated with comments(not working)
      //Now it is working, mistake: $in requires array of objects, before i was not populating comments in post, so it was an array of id
      await Like.deleteMany({ _id: { $in: post.comments } });

      //Method 1 using forEach, not suggested
      // await post.comments.forEach(async element => {
      //   await Like.deleteMany({ likeable: element, onModel: 'Comment' });
      // });

      //Method 2, works fine but long
      //Promise.all can also be used to do the above work instead of forEach, as in forEach we are not catching the promise returned by each deleteMany
      //   await Promise.all(
      //     post.comments.map(async comment_id => {
      //       await Like.deleteMany({ likeable: comment_id, onModel: 'Comment' });
      //     })
      //   )
      //     .then(() => {
      //       console.log(
      //         'All likes associated with comments associated with posts are deleted as promised!!'
      //       );
      //     })
      //     .catch(err => {
      //       req.flash(
      //         'error',
      //         'Something Wong in deleting likes associated with comments associated with posts!!'
      //       );
      //       console.log('Error : ', err);
      //       return res.redirect('back');
      //     });
      await Comment.deleteMany({ post: req.params.id });
      post.remove();
      //To check if request is for API
      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id
          },
          message: 'Post deleted'
        });
      }

      req.flash('success', 'Post deleted!');
      return res.redirect('back');
    } else {
      req.flash('error', 'You cannot delete this post!');
      return res.redirect('back');
    }
  } catch (err) {
    //Handle Error
    req.flash('error', 'Something Wong!!');
    console.log('Error : ', err);
    return res.redirect('back');
  }
};
