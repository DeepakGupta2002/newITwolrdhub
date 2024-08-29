const express = require('express');
const ourTeamrouter = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const { AboutTeamMember } = require('../modal/ourteam');
const { authenticateToken } = require('../midilwhere/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create a new team member
ourTeamrouter.post('/team', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);

        const newTeamMember = new AboutTeamMember({
            name: req.body.name,
            role: req.body.role,
            image: result.secure_url
        });

        await newTeamMember.save();

        // Remove the file from local uploads folder
        fs.unlinkSync(req.file.path);

        res.status(201).json(newTeamMember);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating team member' });
    }
});

// Get all team members
ourTeamrouter.get('/team', async (req, res) => {
    try {
        const teamMembers = await AboutTeamMember.find();
        res.status(200).json(teamMembers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching team members' });
    }
});

// Update a team member
ourTeamrouter.put('/team/:id', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            role: req.body.role
        };

        if (req.file) {
            // Upload new image and delete old one
            const result = await cloudinary.uploader.upload(req.file.path);

            updateData.image = result.secure_url;

            // Remove the file from local uploads folder
            fs.unlinkSync(req.file.path);
        }

        const updatedTeamMember = await AboutTeamMember.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedTeamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        res.status(200).json(updatedTeamMember);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating team member' });
    }
});

// Delete a team member
ourTeamrouter.delete('/team/:id', authenticateToken, async (req, res) => {
    try {
        const deletedTeamMember = await AboutTeamMember.findByIdAndDelete(req.params.id);

        if (!deletedTeamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        res.status(200).json({ message: 'Team member deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting team member' });
    }
});

module.exports = { ourTeamrouter };
