const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user')

//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email'  
    },
    //done is a call back function
    function(email, password, done){
        
        //find a user and establish
        User.findOne({email:email}, function(err, user){
            if(err){
                console.log('Error in finding user --> passport');
                return done(err);//done takes 2 argument : 1 is error, 2 is authentication Status
            }
            if(!user || user.password != password){
                console.log('Invalid Username/Password');
                return done(null, false);//done takes 2 argument : 1 is error, 2 is authentication Status
            }
            return done(null, user);
        });
    }
));

//Serializing the user to decide which key to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});


//Deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in fetching user logged in.-->Passport');
            return done(err);
        }
        return done(null, user);//done takes 2 argument : 1 is error, 2 is user found
    });
});

module.exports = passport;



