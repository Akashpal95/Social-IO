module.exports.postStatus = function(req, res){
    console.log('reached');
    console.log(req.body);
    return res.render('home', {
        title:'home',
        status:req.body.status
    });
    
}

