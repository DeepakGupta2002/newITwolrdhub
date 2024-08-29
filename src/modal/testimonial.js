// models/Testimonial.js

const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    testimonialText: {
        type: String,
        required: true
    }
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = { Testimonial };
