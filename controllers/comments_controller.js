const Comment = require('../models/comment');
const Post = require('../models/post');
module.exports.create = function(req, res){
    // console.log(req);
    //Find the post where the comment was written
    Post.findById(req.body.post, function(err, post){
        //Handle error
        if(err){console.log('Error in finding user who commented'); return}
        if(post){
            //Create the comment along with post id
            Comment.create({
                content:req.body.content,
                user:req.user._id,
                post: req.body.post
            }, function(err, comment){
                //Handle error
                if(err){console.log('Error in creating comment in db'); return}

                post.comments.push(comment);
                post.save();
                // return res.redirect('/');
            });
        }
    })
    return res.redirect('back');
}
module.exports.destroy = function(req, res){
    console.log(req.params.id);
    Comment.findById(req.params.id, function(err, comment){
        if(err){console.log('Error in finding comment to delete'); return;}
        if(comment.user == req.user.id){
            let postId = comment.postl
            comment.remove();
            //$pull is required to remove a single item inside comments array in Post db
            Post.findByIdAndUpdate(postId, { $pull : {comments: req.params.id}}, function(err){
                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
    });
}