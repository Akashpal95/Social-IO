const nodeMailer = require('../config/nodemailer');

//Another way of importing a method
exports.newComment = (comment) => {
    let htmlString  =nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    console.log('inside new comment mailer');
    nodeMailer.transporter.sendMail({
        from: 'your_mail@gmail.com',
        to:comment.user.email,
        subject: "New Comment",
        html : htmlString
    }, (err, info) => {
        if(err){
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent', info);
        return;
    });
}