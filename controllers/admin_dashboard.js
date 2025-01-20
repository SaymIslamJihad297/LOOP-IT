const topCourses = require('../models/top_courses.js');
const User = require('../models/users.js');
const Contacts = require('../models/contact.js');
const adminUser = process.env.ADMIN_USER;

module.exports.homePage = async (req, res) => {
    if (req.user.username != adminUser) {
        req.flash("error", "You are not admin");
        res.redirect('/home');
    } else {
        let datas = await topCourses.find();
        let users = await User.find();
        let contacts = await Contacts.find();
        res.render('./pages/admin_home.ejs', { datas,users,contacts });
    }
}

module.exports.renderEditCourse = async (req, res) => {
    if (req.user.username != adminUser) {
        req.flash("error", "You are not admin");
        res.redirect('/home');
    } else {
        let id = req.params.id;
        let data = await topCourses.findById(id);
        // console.log(data);
        res.render('./pages/edit_top_course_admin.ejs', { data });
    }
}
module.exports.editTopCourse = async (req, res) => {
    if (req.user.username != adminUser) {
        req.flash("error", "You are not admin");
        res.redirect('/home');
    } else {
        let id = req.params.id;
        let data = req.body.data;
        let result = await topCourses.findByIdAndUpdate(id, data);
        console.log(result);
        req.flash("success", "Course Edited Successfully");
        res.redirect('/admin/home');
    }
}

module.exports.renderAddNewTopCourse = (req, res) => {
    if (req.user.username != adminUser) {
        req.flash("error", "You are not admin");
        res.redirect('/home');
    } else {
        res.render('./pages/add_top_course.ejs');
    }
}

module.exports.addNewTopCourse = async (req, res) => {
    if (req.user.username != adminUser) {
        req.flash("error", "You are not admin");
        res.redirect('/home');
    } else {
        let data = req.body.data;
        // console.log(data);
        let newData = new topCourses(data);
        let result = await newData.save();
        req.flash("success", "New Course Added");
        res.redirect('/admin/home');
    }

}

module.exports.deleteTopCourse = async (req, res) => {
    if (req.user.username != adminUser) {
        req.flash("error", "You are not admin");
        res.redirect('/home');
    } else {
        let id = req.params.id;
        let result = await topCourses.findByIdAndDelete(id);
        console.log(result);
        req.flash("success", "Successfully deleted course");
        res.redirect('/admin/home');
    }

}