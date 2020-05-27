const express = require('express');
const app = express();
const port = 8000; //port 80 for production level code
const expressLayouts = require('express-ejs-layouts')

app.use(express.static('./assets'));
app.use(expressLayouts);//Put this line always before routes
app.use('/', require('./routes'))

//Extract Style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true)

//Setting up view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});
