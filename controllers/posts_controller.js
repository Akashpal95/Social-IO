const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){

    if(req.isAuthenticated()){
        try{
            await Post.create({content:req.body.content, user:req.user._id});   
            req.flash('success', 'Successfully Posted!!')
            return res.redirect('back');   
        }catch(err){
            req.flash('error', err);
            if(err){console.log(`Error in posting comment/status : ${err}`); return};
        }
    }else{
        return res.redirect('back');
    }
    
}
module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
            
        //._id is objectId and .id gives string format of ID
        if(post.user == req.user.id){
            post.remove();
            await Comment.deleteMany({post:req.params.id});
            req.flash('success', 'Post deleted!')
            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this post!')
            return res.redirect('back');
        }
    }catch(err){
        //Handle Error
        req.flash('error', err);
        if(err){console.log('Error : ' , err);return;}
    }

}
