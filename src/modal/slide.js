const mongoose = require('mongoose');

// Define the Schema for Website Slide
const slideSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    title: {
        type: String,

    },
    alt: {
        type: String,
    },
    description: {
        type: String,
    },
    order: {
        type: Number,
        default: 0,
        min: 0, // Order should be a non-negative number
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

slideSchema.index({ order: 1 }); // Create an index on the 'order' field

// Create the Model from the Schema
const homeSlide = mongoose.model('Slide', slideSchema);

module.exports = { homeSlide }; // Ensure this line is correct
