const mongoose = require('mongoose');

// Define the Schema for Piracy Policy
const privacyPolicySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

}, { timestamps: true });

// Create the Model from the Schema
const privacyPolicy = mongoose.model('PiracyPolicy', privacyPolicySchema);

module.exports = { privacyPolicy };
