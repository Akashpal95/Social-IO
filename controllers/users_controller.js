const User = require('../models/user');
//filesystem module
const fs = require('fs');
const path = require('path');

module.exports.profile = async function(req, res){
    try{
        let user = await User.findById(req.params.id);

        return res.render('user_profile', {
            title: 'Codeial | User Profile',
            profile_user:user
        });
    }catch(err){
        console.log('Error in finding user profile : ', err);
        return res.redirect('back');
    }
 
}

module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     //req.body can be sent or expanded for {name:req.body.name, email:req.body.email} which is basically same as req.body
    //     User.findByIdAndUpdate(req.params.id, req.body,function(err, user){
    //         return res.redirect('back');
    //     });
    // }else{
    //     //If update fails return http status code for error
    //     return res.status(401).send('Unauthorised');
    // }
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadAvatar(req, res, function(err){
                if(err){console.log('Multer Error : ', err)}
                
                user.name = req.body.name;
                user.email = req.body.email;
                
                if(req.file){
                    
                    if(user.avatar){
                        if(fs.existsSync(path.join(__dirname, '..',user.avatar))){
                            fs.unlinkSync(path.join(__dirname, '..',user.avatar))
                        }
                    }
                    
                    //Saving the path of the uploaded file in avatar field in user
                    user.avatar = User.avatarPath +"/" +req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });   
        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }else{
        req.flash('error', 'Unauthorized');
        //If update fails return http status code for error
        return res.status(401).send('Unauthorised');
    }
}

// render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = async function(req, res){
    console.log(req.body);
    try{
        if (req.body.password != req.body.confirm_password){
            return res.redirect('back');
        }

        let user = await User.findOne({email: req.body.email}); 

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}
                req.flash('success', 'You have signed up successfully!')
                return res.redirect('/users/sign-in');
            })
        }else{
            req.flash('error', err);
            console.log(user);
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Error in checking if the user already exists : ', err);
        return res.redirect('back');
    }
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    //First argument is type of flash message
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out');
    return res.redirect('/');
}