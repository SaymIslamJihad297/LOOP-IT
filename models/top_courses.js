const mongoose = require('mongoose');
const {Schema} = mongoose;


const topCourseSchema = new Schema({
    courseName: {
        type: String,
        required: true,
    },
    courseDetails: {
        type: String,
        required: true,
    },
    imageLink:{
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvyHJb1AEUkJXj5rPjZ6GZrjL-S0SwFzIfBkpqhuBwFUjUJ7ars5IuSjx5ekAbMJx7Wvc&usqp=CAU",
    },
    corsePrice: {
        type: Number,
        required: true,
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Reviews",
        }
    ]
})

module.exports = mongoose.model("topCourses", topCourseSchema);