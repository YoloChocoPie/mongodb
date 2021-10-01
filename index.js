// main controller

var express = require('express');
var app  = express();
app.listen(3000);

//middlewares
app.use(express.static('public'));
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 
var session = require('express-session');
app.use(session(
    {
        secret : '123456'
    }));
app.use((req, res, next) => 
    {
        res.locals.session =  req.session;
        next();
    });

//template engine
app.set('view engine', 'ejs');

// gọi tới hai contrllers

app.use('/', require('./controllers/customer.js'));
app.use('/admin', require('./controllers/admin.js'));