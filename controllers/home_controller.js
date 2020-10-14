const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = async function(req, res) {
  //Populate user of each Post
  try {
    let posts = await Post.find({})
      .sort('-createdAt')
      .populate('user', 'name') //Both ways you can populate, path is used when nested data needs to be populated
      .populate({
        path: 'comments',
        options: { sort: 'createdAt' }, //Sorting in descending order in populating sub paths
        populate: {
          path: 'user',
          select: 'name'
        }
      });

    let users = await User.find({});
    if (req.isAuthenticated()) {
      let user = await User.findById(req.user.id).populate({
        path: 'friends'
      });
      return res.render('home', {
        title: 'Codeial | home',
        posts: posts,
        all_users: users,
        friends: user.friends
      });
    }
    return res.render('home', {
      title: 'Codeial | home',
      posts: posts,
      all_users: users
    });
  } catch (err) {
    console.log('Error : ', err);
    return;
  }
};
module.exports.contact = function(req, res) {
  return res.end('<h1>Contact us here!</h1>');
};
