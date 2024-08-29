const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the team member schema
const teamMemberSchema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: true }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt timestamps
});



// Create a model using the schema
const AboutTeamMember = mongoose.model('AboutTeamMember', teamMemberSchema);

module.exports = { AboutTeamMember };
