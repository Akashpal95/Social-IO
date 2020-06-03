const Post = require('../models/post');
module.exports.home = function(req, res){
    
    Post.find({}, function(err, posts){

        return res.render('home',{
            title:'Codeial | home',
            posts: posts
        }); 
    });
        
}
module.exports.contact = function(req, res){
    return res.end('<h1>Contact us here!</h1>');
}
//module.exports.actionName = function(req, res){};