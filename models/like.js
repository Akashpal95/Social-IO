const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user : {
        type:mongoose.Schema.ObjectId
    },
    //This defines the object id of the liked object->More appropriate name likedObject
    likeable : {
        type:mongoose.Schema.ObjectId,
        require:true,
        refPath: 'onModel'
    },
    //This field is used for the defining the type of the liked object since this is a dynamic reference
    onModel : {
        type: String,
        require:true,
        enum : ['Post', 'Comment']
    }
},{timestamps : true});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;