module.exports.profile = function(req, res){
    return res.end('<h1>User Profile</h1>');
}

module.exports.activity = function(req, res){
    return res.end('<h1>List of activities</h1>');
}