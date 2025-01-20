const topCourses = require('../models/top_courses.js');
const Review = require('../models/review.js');

module.exports.createReview = async(req, res)=>{
    let courseId = req.params.id;
    let course = await topCourses.findById(courseId);
    let review = req.body.review;
    let newReview = new Review(review);
    newReview.author = req.user._id;
    course.reviews.push(newReview);
    await newReview.save();
    await course.save();

    req.flash("success", "Review Added");
    res.redirect(`/home/course/details/${courseId}`);
}

module.exports.deleteReview = async(req, res)=>{
    let {reviewId, courseId} = req.params;
    console.log(reviewId, courseId);
    let review = await Review.findById(reviewId);
    // res.send(review);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner");
        res.redirect(`/home/course/details/${courseId}`);
    }else{
        await topCourses.findByIdAndUpdate(courseId, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted");
        res.redirect(`/home/course/details/${courseId}`);
    }
}