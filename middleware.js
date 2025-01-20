module.exports.isUserLoggedIn = (req, res, next)=>{
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        res.redirect('/home/login');
    }else{
        next();
    }
}

