const mongoose = require('mongoose');
const {Schema} = mongoose;

const contactSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model("contacts", contactSchema);