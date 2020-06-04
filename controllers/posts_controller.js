const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function(req, res){

    if(req.isAuthenticated()){
        // req.body.user =;
        // console.log(req.user._id);
        Post.create({content:req.body.content, user:req.user._id},function(err, user){
            if(err){console.log(`Error in posting comment/status : ${err}`); return}
            return res.redirect('back');
        });
    }else{
    return res.redirect('back');
    }
    
}
module.exports.destroy = function(req, res){
    Post.findById(req.params.id, function(err, post){
        //Handle Error
        if(err){console.log('Error in finding post');return;}
        //._id is objectId and .id gives string format of ID
        if(post.user == req.user.id){
            post.remove();
            Comment.deleteMany({post:req.params.id}, function(err){
                return res.redirect('back');
            })
        }else{
            return res.redirect('back');
        }
    });
}
