const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const { isUserLoggedIn } = require('../middleware.js');
const { wrapAsync } = require('../utils/errorHandle.js');
const { homePage, renderEditCourse, editTopCourse, renderAddNewTopCourse, addNewTopCourse, deleteTopCourse } = require('../controllers/admin_dashboard.js');
const Contact = require('../models/contact.js');
const AdminUser = process.env.ADMIN_USER;
router.get('/home', isUserLoggedIn, wrapAsync(homePage));

// top course section start here
// edit top course

router.get('/edit/topcourse/:id', isUserLoggedIn, wrapAsync(renderEditCourse));

router.put('/edit/topcourse/:id', isUserLoggedIn, wrapAsync(editTopCourse));

// add new top course
router.get('/addnew/topcourse', isUserLoggedIn, renderAddNewTopCourse);

router.post('/addnew/topcourse', isUserLoggedIn, wrapAsync(addNewTopCourse));

// delete topcourse
router.delete('/delete/topcourse/:id', isUserLoggedIn, wrapAsync(deleteTopCourse));
// top course section end here

// users edition route part start here
router.get('/edit/user/:id', isUserLoggedIn, wrapAsync(async (req, res) => {
    if (req.user.username != AdminUser) {
        req.flash("error", "You are not admin");
        res.redirect('/home');
    } else {
        let id = req.params.id;
        let data = await User.findById(id);
        res.render('./pages/edit_user_info_admin.ejs', { data });
    }
}));
router.put('/edit/user/:id', isUserLoggedIn, wrapAsync(async (req, res) => {
    if (req.user.username != AdminUser) {
        req.flash("error", "You are not admin");
        res.redirect('/home');
    } else {
        let id = req.params.id;
        let data = req.body.data;
        // console.log(data);
        let result = await User.findByIdAndUpdate(id, data);
        // console.log(result);
        req.flash("success", "User Updated!");
        res.redirect('/admin/home');
    }

}));

router.delete('/delete/user/:id', isUserLoggedIn, wrapAsync(async (req, res) => {
    if (req.user.username != AdminUser) {
        req.flash("error", "You are not admin");
        res.redirect('/home');
    } else {
        let id = req.params.id;
        let result = await User.findByIdAndDelete(id);
        req.flash("success", "User deleted!");
        res.redirect('/admin/home');
    }

}))

router.delete('/deletecontact/:id', wrapAsync(async (req, res) => {
    if (req.user.username != AdminUser) {
        req.flash("error", "You are not admin");
        res.redirect('/home');
    } else {
        let id = req.params.id;
        await Contact.findByIdAndDelete(id);
        req.flash("success", "Deleted!");
        res.redirect('/admin/home');
    }
}))
module.exports = router;