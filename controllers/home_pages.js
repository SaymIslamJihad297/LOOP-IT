const topCourses = require('../models/top_courses.js');
const User = require('../models/users.js');

module.exports.renderHomePage = async (req, res) => {    
    let datas = await topCourses.find();
    // console.log(datas);
    res.render('./pages/home.ejs', { datas });
}

module.exports.renderSignUpPage = (req, res) => {
    if (!res.locals.isLoggedIn) {
        res.render("./pages/user_signup.ejs");
    } else {
        req.flash("You are already logged in");
        res.redirect('/home');
    }
}

module.exports.signUpUser = async(req, res, next) => {
    let user = req.body.user;
    let password = req.body.password;
    console.log(password);
    // console.log(user);
    let newUser = await User.register(user, password);
    console.log(newUser);
    req.login(newUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome!");
        res.redirect("/home");
    })
}

module.exports.renderLoginPage = (req, res) => {
    if (!res.locals.isLoggedIn) {
        res.render("./pages/user_login.ejs");
    }
    else {
        req.flash("You are already logged in");
        res.redirect('/home');
    }
}

module.exports.loginUser = (req, res) => {
    let { username, password } = req.body;
    // console.log(user);
    req.flash("success", "Logged In");
    res.redirect('/home');
}

module.exports.signOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "You have been logged out");
            res.redirect('/home');
        })
    }else{
        req.flash("error", "You are already logged out");
        res.redirect("/home");
    }
}