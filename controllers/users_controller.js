const User = require('../models/user');
const Friendship = require('../models/friendship');
const RPT = require('../models/reset_password_token');
const resetPasswordMailer = require('../mailers/reset_password_mailer');
const crypto = require('crypto');
//filesystem module
const fs = require('fs');
const path = require('path');

module.exports.profile = async function(req, res) {
  try {
    let user = await User.findById(req.params.id);

    return res.render('user_profile', {
      title: 'Codeial | User Profile',
      profile_user: user
    });
  } catch (err) {
    console.log('Error in finding user profile : ', err);
    return res.redirect('back');
  }
};

module.exports.update = async function(req, res) {
  // if(req.user.id == req.params.id){
  //     //req.body can be sent or expanded for {name:req.body.name, email:req.body.email} which is basically same as req.body
  //     User.findByIdAndUpdate(req.params.id, req.body,function(err, user){
  //         return res.redirect('back');
  //     });
  // }else{
  //     //If update fails return http status code for error
  //     return res.status(401).send('Unauthorised');
  // }
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadAvatar(req, res, function(err) {
        if (err) {
          console.log('Multer Error : ', err);
        }

        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          if (user.avatar) {
            if (fs.existsSync(path.join(__dirname, '..', user.avatar))) {
              fs.unlinkSync(path.join(__dirname, '..', user.avatar));
            }
          }

          //Saving the path of the uploaded file in avatar field in user
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }
        user.save();
        return res.redirect('back');
      });
    } catch (err) {
      req.flash('error', err);
      return res.redirect('back');
    }
  } else {
    req.flash('error', 'Unauthorized');
    //If update fails return http status code for error
    return res.status(401).send('Unauthorised');
  }
};

// render the sign up page
module.exports.signUp = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return res.render('user_sign_up', {
    title: 'Codeial | Sign Up'
  });
};

// render the sign in page
module.exports.signIn = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return res.render('user_sign_in', {
    title: 'Codeial | Sign In'
  });
};

// get the sign up data
module.exports.create = async function(req, res) {
  console.log(req.body);
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.redirect('back');
    }

    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      User.create(req.body, function(err, user) {
        if (err) {
          console.log('error in creating user while signing up');
          return;
        }
        req.flash('success', 'You have signed up successfully!');
        return res.redirect('/users/sign-in');
      });
    } else {
      req.flash('error', err);
      console.log(user);
      return res.redirect('back');
    }
  } catch (err) {
    console.log('Error in checking if the user already exists : ', err);
    return res.redirect('back');
  }
};

// sign in and create a session for the user
module.exports.createSession = function(req, res) {
  //First argument is type of flash message
  req.flash('success', 'Logged in Successfully');
  return res.redirect('/');
};

module.exports.destroySession = function(req, res) {
  req.logout();
  req.flash('success', 'You have logged out');
  return res.redirect('/');
};

module.exports.forgotPassword = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/users/profile');
  }
  return res.render('find_account');
};

module.exports.findAccount = async function(req, res) {
  console.log(req.body);
  try {
    let user = await User.findOne(req.body);
    console.log(user);
    if (user) {
      let token = await RPT.create({
        accessToken: crypto.randomBytes(20).toString('hex'),
        user: user._id
      });
      console.log(token);
      resetPasswordMailer.resetPassword(user, token);
    } else {
      console.log('User not found');
    }
    res.redirect('back');
  } catch (err) {
    console.log('Error in finding account to reset password: ', err);
    return res.redirect('back');
  }
};

module.exports.resetPasswordCheck = async function(req, res) {
  try {
    let token = await RPT.findOne({ accessToken: req.params.accessToken });
    if (token && token.isValid) {
      let user = await User.findById(token.user);
      console.log(user);
      console.log('User ID : ', user._id);
      return res.render('reset_password', {
        userID: user._id,
        tokenID: token._id
      });

      // return res.redirect('/users/sign-in');
    } else {
      console.log("Token doesn't exist or it has expired");
      return res.redirect('/');
    }
  } catch (err) {
    console.log('Error in reset password check: ', err);
    return res.redirect('/');
  }
};

module.exports.resetPassword = async function(req, res) {
  console.log(req.body);
  if (req.body.password != req.body.confirm_password) {
    return res.redirect('back');
  }
  let user = await User.findById(req.body.userID);
  user.password = req.body.password;
  user.save();
  RPT.findByIdAndDelete(req.body.tokenID, function(err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log('Deleted : ', docs);
    }
  });
  res.redirect('/users/sign-in');
};

module.exports.addFriend = async function(req, res) {
  //   console.log(req.params.friend_id);
  //   console.log(req.user.id);
  try {
    let existingFriendship = await Friendship.findOne({
      from_user: req.user.id,
      to_user: req.params.friend_id
    });

    if (!existingFriendship) {
      let friendship = await Friendship.create({
        from_user: req.user.id,
        to_user: req.params.friend_id
      });
      let from_user = await User.findById(req.user.id);
      let to_user = await User.findById(req.params.friend_id);
      from_user.friends.push(to_user._id);
      to_user.friends.push(from_user._id);
      from_user.save();
      to_user.save();
      req.flash('success', 'Successfully added as Friend!');
      if (req.xhr) {
        return res.status(200).json({
          message: 'Added as friend Successfully!',
          data: {
            isfriend: true
          }
        });
      }
    } else {
      req.flash('info', 'Already a friend!');
      if (req.xhr) {
        return res.status(409).json({
          message: 'Already a friend!',
          data: {
            isfriend: true
          }
        });
      }
    }
    return res.redirect('back');
  } catch {
    req.flash('error', 'Error in Adding Friend!');
    console.log('Error in adding Friend: ', err);
    return res.redirect('back');
  }
};

module.exports.removeFriend = async function(req, res) {
  try {
    let existingFriendship1 = await Friendship.findOne({
      from_user: req.user.id,
      to_user: req.params.friend_id
    });
    let existingFriendship2 = await Friendship.findOne({
      from_user: req.params.friend_id,
      to_user: req.user.id
    });
    let existingFriendship = existingFriendship1 || existingFriendship2;
    console.log(existingFriendship);
    if (existingFriendship) {
      let from_user = await User.findById(existingFriendship.from_user);
      let to_user = await User.findById(existingFriendship.to_user);
      from_user.friends.pull(existingFriendship.to_user);
      to_user.friends.pull(existingFriendship.from_user);
      from_user.save();
      to_user.save();

      existingFriendship.remove();
      req.flash('success', 'Successfully Removed from Friendlist!');
      if (req.xhr) {
        return res.status(200).json({
          message: 'Successfully Removed from Friendlist!',
          data: {
            isfriend: true
          }
        });
      }
    } else {
      req.flash('info', 'Already removed!');
      if (req.xhr) {
        return res.status(409).json({
          message: 'Already removed!',
          data: {
            isfriend: true
          }
        });
      }
    }
    return res.redirect('back');
  } catch (err) {
    req.flash('error', 'Error in Removing Friend!');
    console.log('Error in adding Friend: ', err);
    return res.redirect('back');
  }
};
