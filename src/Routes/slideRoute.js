const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const { homeSlide } = require('../modal/slide');  // Ensure this import is correct
const { authenticateToken } = require('../midilwhere/auth');
require("dotenv/config");

const slideRouter = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

// Route to handle POST requests for adding a new slide
slideRouter.post('/slides', authenticateToken, upload.single('image'), async (req, res) => {
    const { title, alt, description, order } = req.body;
    const imagePath = req.file.path;

    try {
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: 'slides'
        });

        // Create a new Slide document
        const newSlide = new homeSlide({
            imageUrl: result.secure_url,
            title: title,
            alt: alt || '',
            description: description || '',
            order: order ? parseInt(order) : 0 // Default to 0 if not provided
        });

        // Save the document to the database
        await newSlide.save();

        // Delete the local file after upload
        fs.unlinkSync(imagePath);

        // Respond with success
        res.status(201).json({ message: 'Slide created successfully', homeSlide: newSlide });
    } catch (error) {
        console.error(error);

        // Delete the local file if there's an error
        fs.unlinkSync(imagePath);

        res.status(500).json({ error: 'An error occurred while creating the slide' });
    }
});

// Route to handle GET requests for retrieving all slides
slideRouter.get('/slides', async (req, res) => {
    try {
        // Retrieve all Slide documents from the database
        const slides = await homeSlide.find().sort({ order: 1 }); // Sort by order field

        // Respond with the retrieved data
        res.status(200).json({ slides });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the slides' });
    }
});

// Route to handle PUT requests for updating a slide by ID
slideRouter.put('/slides/:id', authenticateToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, alt, description, order } = req.body;
    const imagePath = req.file ? req.file.path : null;

    try {
        // Find the Slide document by ID
        const slide = await homeSlide.findById(id);

        // Check if the document was found
        if (!slide) {
            return res.status(404).json({ error: 'Slide not found' });
        }

        // If a new image is uploaded, upload it to Cloudinary and delete the old image from Cloudinary
        let imageUrl = slide.imageUrl;
        if (imagePath) {
            // Delete the old image from Cloudinary
            const publicId = path.basename(slide.imageUrl).split('.')[0];
            await cloudinary.uploader.destroy(publicId);

            // Upload the new image to Cloudinary
            const result = await cloudinary.uploader.upload(imagePath, {
                folder: 'slides'
            });
            imageUrl = result.secure_url;

            // Delete the local file
            fs.unlinkSync(imagePath);
        }

        // Update the Slide document
        slide.title = title || slide.title;
        slide.alt = alt || slide.alt;
        slide.description = description || slide.description;
        slide.imageUrl = imageUrl;
        slide.order = order ? parseInt(order) : slide.order; // Update order if provided

        // Save the updated document to the database
        await slide.save();

        // Respond with success
        res.status(200).json({ message: 'Slide updated successfully', slide });
    } catch (error) {
        console.error(error);

        // Delete the local file if there's an error
        if (imagePath) {
            fs.unlinkSync(imagePath);
        }

        res.status(500).json({ error: 'An error occurred while updating the slide' });
    }
});

// Route to handle DELETE requests for deleting a slide by ID
slideRouter.delete('/slides/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        // Find the Slide document by ID
        const slide = await homeSlide.findById(id);

        // Check if the document was found
        if (!slide) {
            return res.status(404).json({ error: 'Slide not found' });
        }

        // Delete the image from Cloudinary
        const publicId = path.basename(slide.imageUrl).split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        // Delete the document from the database
        await homeSlide.findByIdAndDelete(id);

        // Respond with success
        res.status(200).json({ message: 'Slide deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the slide' });
    }
});

module.exports = { slideRouter };
