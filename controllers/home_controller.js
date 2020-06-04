const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = function(req, res){
    
    // Post.find({}, function(err, posts){

    //     return res.render('home',{
    //         title:'Codeial | home',
    //         posts: posts
    //     }); 
    // });
    //Populate user of each Post
    Post.find({})
    .populate('user')//Both ways you can populate, path is used when nested data needs to be populated
    .populate({
        path:'comments',
        populate:{
            path: 'user'
        }
    })
    .exec(function(err, posts){

        User.find({}, function(err, users){
            
            return res.render('home',{
                title:'Codeial | home',
                posts: posts,
                all_users: users
            }); 

        });

    });
        
}
module.exports.contact = function(req, res){
    return res.end('<h1>Contact us here!</h1>');
}
//module.exports.actionName = function(req, res){};