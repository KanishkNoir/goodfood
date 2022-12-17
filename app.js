const express = require("express");
const expressLayouts =require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app =express();
const port = process.env.PORT || 2424;

require("dotenv").config();

app.use(express.urlencoded( {extended:true }));
app.use(express.static("public"));
app.use(expressLayouts);


app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret: 'CookingBlogSecretSession',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
app.use(fileUpload());


//to store layouts
app.set('layout', './layouts/main');
app.set('view engine' , 'ejs');

const routes= require("./server/routes/recipeRoutes.js")
app.use("/", routes);

//command that our app is listening to specified port number

app.listen(port, ()=> console.log('Listening to port: '+ port));
