const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { Testimonial } = require('../modal/testimonial');
const { authenticateToken } = require('../midilwhere/auth');
const Testimonialrouter = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload'); // Set destination folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Set file name
    }
});

const upload = multer({ storage });

// Create a new testimonial
Testimonialrouter.post('/testimonials', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { clientName, rating, testimonialText } = req.body;
        let imageUrl = '';

        if (req.file) {
            // Upload the image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'image',
                folder: 'testimonials'
            });

            imageUrl = result.secure_url; // Get the secure URL from Cloudinary

            // Delete the local file after uploading to Cloudinary
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting local file:', err);
            });
        }

        const newTestimonial = new Testimonial({
            clientName,
            imageUrl,
            rating,
            testimonialText
        });
        await newTestimonial.save();
        res.status(201).json({ message: 'Testimonial created successfully', testimonial: newTestimonial });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(500).json({ message: 'Error creating testimonial', error });
    }
});

// Get all testimonials
// Testimonialrouter.get('/testimonials', authenticateToken, async (req, res) => {
//     try {
//         const testimonials = await Testimonial.find();
//         res.status(200).json(testimonials);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching testimonials', error });
//     }
// });
Testimonialrouter.get('/testimonials', async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching testimonials', error });
    }
});

// Get a specific testimonial by ID
Testimonialrouter.get('/testimonials/:id', authenticateToken, async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.status(200).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching testimonial', error });
    }
});

// Update a testimonial by ID
// Update a testimonial by ID
Testimonialrouter.put('/testimonials/:id', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { clientName, rating, testimonialText } = req.body;
        let imageUrl = '';

        if (req.file) {
            // Upload the image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'image',
                folder: 'testimonials'
            });

            imageUrl = result.secure_url; // Get the secure URL from Cloudinary

            // Delete the local file after uploading to Cloudinary
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting local file:', err);
            });
        }

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            { clientName, imageUrl, rating, testimonialText },
            { new: true }
        );
        if (!updatedTestimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.status(200).json({ message: 'Testimonial updated successfully', testimonial: updatedTestimonial });
    } catch (error) {
        res.status(500).json({ message: 'Error updating testimonial', error });
    }
});

// Delete a testimonial by ID
Testimonialrouter.delete('/testimonials/:id', authenticateToken, async (req, res) => {
    try {
        const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!deletedTestimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.status(200).json({ message: 'Testimonial deleted successfully', testimonial: deletedTestimonial });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting testimonial', error });
    }
});

module.exports = { Testimonialrouter };
