const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000; //port 80 for production level code
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const db = require('./config/mongoose');
app.use(express.urlencoded());
app.use(cookieParser());


app.use(express.static('./assets'));
app.use(expressLayouts);//Put this line always before routes


//Extract Style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true)

//Setting up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//The order of these middlewares are very important
app.use(session({
    name:'codeial',
    //TODO change the secret before deployment
    secret:'blahsomething',
    saveUninitialized: false,
    resave:false,
    cookie: {
        maxAge : (1000*60 *100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

//use express router
app.use('/', require('./routes'))

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});
