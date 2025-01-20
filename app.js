if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const home = require('./routes/home_page.js');
const adminPage = require('./routes/admin_page.js');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const User = require('./models/users.js');
const passport = require('passport');
const localStrategy = require('passport-local');
const {ExpressError} = require('./utils/errorHandle.js');
const MongoStore = require('connect-mongo');



const secretKey = process.env.SECRET_KEY;
const dbUrl = process.env.ATLAS_URL;


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: secretKey
    },
    touchAfter: 24*3600,
  })

store.on("error", ()=>{
    console.log("Error in mongo session store");
})
const sessionOption = {
    store,
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};


main().then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err);
})


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));


app.use(session(sessionOption)); // setting up express session
app.use(flash()); // setting up flash for flash messages
app.use(passport.initialize()); //initializing passport
app.use(passport.session()); // giving passport session permission
passport.use(new localStrategy(User.authenticate())); // using the local strategy
passport.serializeUser(User.serializeUser()); // serialize the user on session
passport.deserializeUser(User.deserializeUser()); // deserialize session.


app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.isLoggedIn = req.isAuthenticated();
    res.locals.currUser = req.user;
    res.locals.adminUser = process.env.ADMIN_USER;
    next();
})

app.get('/', (req, res)=>{
    res.redirect('/home');
})


app.use('/home', home);
app.use('/admin', adminPage);

app.all("*", (req, res)=>{
    req.flash("error", "Page not found");
    res.redirect('/home');
})

app.use((err, req, res, next)=>{
    let {status = 500, message="Some Error happend"} = err;
    res.status(status).render('error.ejs', {status, message});
})

async function main() {
    await mongoose.connect(dbUrl);
}

app.listen(8080, ()=>{
    console.log("Server started successfully");
})