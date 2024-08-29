const mongoose = require('mongoose');

// Define the Schema for Social Media Links
const socialMediaLinkSchema = new mongoose.Schema({
    facebook: {
        type: String,
        required: true
    },
    instagram: {
        type: String,
        required: true
    },
    twitter: {
        type: String,
        required: true
    },
    linkedin: {
        type: String,
        required: true
    }
    , whatsapp: {
        type: String,
        required: true
    },
    call: {
        type: String,
        required: true
    }

}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the Model from the Schema
const SocialMediaLink = mongoose.model('SocialMediaLink', socialMediaLinkSchema);

module.exports = { SocialMediaLink };
