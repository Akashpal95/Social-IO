module.exports.profile = function(req, res){
    return res.render('user_profile');
}

module.exports.activity = function(req, res){
    return res.end('<h1>List of activities</h1>');
}