const User = require('../models/user')
module.exports.profile = function(req, res){
    
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id, function(err, user){
            if(err){console.log('Error in finding logged in user'); return;}
            if(user){
                return res.render('user_profile',{
                    title : "User Profile",
                    user:user
                });
            }
        });
    }else{
        return res.redirect('/users/sign-in');
    }
    // return res.render('user_profile',{
    //     email : req.body.email
    // });
}

module.exports.activity = function(req, res){
    return res.end('<h1>List of activities</h1>');
}
//Render sign up page
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title:'Codeial | Sign Up'
    });
} 
//Render Sign in page
module.exports.signIn = function(req, res){
    
    return res.render('user_sign_in', {
        title:'Codeial | Sign In'
    });
} 
//get the sign up data
module.exports.create = function(req, res){
    if(req.body.password !== req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email : req.body.email}, function(err, user){
        if(err){console.log('User email is already used.'); return;}
        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log('Error while creating user.'); return;}
                return res.redirect('/users/sign-in');
            });
        }else{
            return res.redirect('/users/sign-in');
        }
    });
    
}

//Sign in and create a session for the user
module.exports.createSession = function(req, res){
    //Steps to authenticate
    //find the user
    User.findOne({email:req.body.email}, function(err, user){
        if(err){console.log('Error in finding user for sign-in'); return;}
        //handle user found
        if(user){
            //handle password match
            if(user.password != req.body.password){
                return res.redirect('back');
            }
            //handle session creation
            res.cookie('user_id', user.id);
            res.redirect('/users/profile');
        }else{
            //handle user not found

        }
    });   
}

module.exports.signOut = function(req, res){
    res.clearCookie('user_id');
    res.redirect('back');
}
