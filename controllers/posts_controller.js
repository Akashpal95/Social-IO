const Post = require('../models/post');
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

