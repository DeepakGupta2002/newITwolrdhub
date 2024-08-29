const mongoose = require('mongoose');

// Define the Schema for User Queries
const queryUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    query: {
        type: String,
        required: true,
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the Model from the Schema
const QueryUser = mongoose.model('QueryUser', queryUserSchema);

module.exports = { QueryUser };
