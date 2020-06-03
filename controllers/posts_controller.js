module.exports.postStatus = function(req, res){
    console.log('reached');
    console.log(req.body);
    res.locals.title = 'home'
    res.locals.status= req.body.status;
    return res.redirect('back');
    
}

