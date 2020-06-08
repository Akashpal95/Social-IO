const Comment = require('../models/comment');
const Post = require('../models/post');
module.exports.create = async function(req, res){
    // console.log(req);
    //Find the post where the comment was written
    try{
        let post  = await Post.findById(req.body.post);
        if(post){
            //Create the comment along with post id
            let comment = await Comment.create({
                content:req.body.content,
                user:req.user._id,
                post: req.body.post
            });
            req.flash('success', 'Comment added Successfully!')
            post.comments.push(comment);
            post.save();

        }
        return res.redirect('back');
    }catch(err){
        req.flash('error', err);
        console.log('Error : ', err);
        return;
    }
    
}
module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);
        
        if(comment.user == req.user.id){
            let postId = comment.postl
            comment.remove();
            //$pull is required to remove a single item inside comments array in Post db
            let post = await Post.findByIdAndUpdate(postId, { $pull : {comments: req.params.id}});
            req.flash('success', 'Comment deleted!')
            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this comment!')
            return res.redirect('back');
        }
    }catch(error){
        req.flash('error', err);
        console.log('Error : ', err);
        return;
    }
    
}