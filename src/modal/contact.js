const mongoose = require('mongoose');

// Define the Schema for Contact Details
const contactSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },



}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the Model from the Schema
const Contact = mongoose.model('Contact', contactSchema);

module.exports = { Contact };
