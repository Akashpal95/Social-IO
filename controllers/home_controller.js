const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = async function(req, res){
    
    //Populate user of each Post
    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')//Both ways you can populate, path is used when nested data needs to be populated
        .populate({
            path:'comments',
            populate:{
                path: 'user'
            }
        });


        let users = await User.find({});
                
        return res.render('home',{
            title:'Codeial | home',
            posts: posts,
            all_users: users
        }); 
    }catch(err){
        console.log('Error : ', err);
        return;
    }
        
}
module.exports.contact = function(req, res){
    return res.end('<h1>Contact us here!</h1>');
}
