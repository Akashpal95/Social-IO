const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const commentsMailer = require('../mailers/comments_mailer');

const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

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
            post.comments.push(comment);
            post.save();
            //To populate the user in comment
            comment = await comment.populate('user',['name', 'email']).execPopulate();
    
            //commentsMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function(err){
                if(err){
                console.log('Error in creating a queue : ', err)
                }
                console.log('Job enqueued : ',job.id);
            })

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment:comment,
                        username:req.user.name
                    },
                    message: 'Comment created!'
                });
            }
            
            req.flash('success', 'Comment added Successfully!')

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
            let postId = comment.post;
            comment.remove();
            //$pull is required to remove a single item inside comments array in Post db
            let post = await Post.findByIdAndUpdate(postId, { $pull : {comments: req.params.id}});
            
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment_id: req.params.id,
                    },
                    message: 'Comment deleted!'
                });
            }
            
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