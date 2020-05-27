module.exports.home = function(req, res){
    return res.render('home',{
        title:'home'
    });     
}
module.exports.contact = function(req, res){
    return res.end('<h1>Contact us here!</h1>');
}
//module.exports.actionName = function(req, res){};