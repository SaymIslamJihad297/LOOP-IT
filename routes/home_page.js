const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const topCourses = require('../models/top_courses.js');
const Review = require('../models/review.js');
const passport = require('passport');
const { wrapAsync } = require('../utils/errorHandle.js');
const { renderHomePage, renderSignUpPage, signUpUser, renderLoginPage, loginUser, signOut } = require('../controllers/home_pages.js');
const { isUserLoggedIn } = require('../middleware.js');
const { createReview, deleteReview } = require('../controllers/course_reviews.js');
const Contacts = require('../models/contact.js');


router.get('/', wrapAsync(renderHomePage));

// sign up user
router.route('/signup')
    .get(renderSignUpPage)
    .post(wrapAsync(signUpUser));

// login user
router.route('/login')
    .get(renderLoginPage)
    .post(passport.authenticate('local', { failureRedirect: '/home/login', failureFlash: true }), loginUser);


// logout route
router.get('/signout', signOut);

// course details route
router.get('/course/details/:id', wrapAsync(async (req, res) => {
    let id = req.params.id;
    let course = await topCourses.findById(id).populate({ path: 'reviews', populate: "author" });
    res.render('./pages/course_details.ejs', { course });
}))

// course reviews
router.post('/review/:id', isUserLoggedIn, wrapAsync(createReview));

router.delete('/review/:reviewId/:courseId', isUserLoggedIn, wrapAsync(deleteReview));

// contact page
router.get('/contact', isUserLoggedIn,(req, res)=>{
    res.render('./pages/contact_page.ejs');
})
router.post('/contact', isUserLoggedIn, wrapAsync(async(req, res)=>{
    let contact = req.body.contact;
    console.log(contact);
    let newContact = new Contacts(contact);
    console.log(newContact);
    await newContact.save();
    req.flash("success", "Sent!");
    res.redirect("/home/contact");
}))
module.exports = router;