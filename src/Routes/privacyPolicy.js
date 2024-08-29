const express = require('express');
const mongoose = require('mongoose');
const { privacyPolicy } = require('../modal/privacy');
const { authenticateToken } = require('../midilwhere/auth');
const privacyPolicyRouter = express.Router();

// Middleware to parse JSON bodies
privacyPolicyRouter.use(express.json());

// Route to handle POST requests for adding a new privacy policy
privacyPolicyRouter.post('/privacy-policies', authenticateToken, async (req, res) => {
    const { title, description } = req.body;

    // Validate the request body
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        // Create a new privacyPolicy document
        const newprivacyPolicy = new privacyPolicy({ title, description });

        // Save the document to the database
        await newprivacyPolicy.save();

        // Respond with success
        res.status(201).json({ message: 'privacy Policy created successfully', privacyPolicy: newprivacyPolicy });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the privacy policy' });
    }
});


// Route to handle GET requests for retrieving all privacy policies
privacyPolicyRouter.get('/privacy-policies', async (req, res) => {
    try {
        // Retrieve all privacyPolicy documents from the database
        const privacyPolicies = await privacyPolicy.find();

        // Respond with the retrieved data
        res.status(200).json({ privacyPolicies });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the privacy policies' });
    }
});

// Route to handle GET requests for retrieving a single privacy policy by ID
privacyPolicyRouter.get('/privacy-policies/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the privacyPolicy document by ID
        const privacyPolicy = await privacyPolicy.findById(id);

        // Check if the document was found
        if (!privacyPolicy) {
            return res.status(404).json({ error: 'privacy Policy not found' });
        }

        // Respond with the retrieved data
        res.status(200).json({ privacyPolicy });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the privacy policy' });
    }
});

// Route to handle PUT requests for updating a privacy policy by ID
privacyPolicyRouter.put('/privacy-policies/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    // Validate the request body
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        // Find the privacyPolicy document by ID and update it
        const updatedprivacyPolicy = await privacyPolicy.findByIdAndUpdate(
            id,
            { title, description },
            { new: true } // Return the updated document
        );

        // Check if the document was found and updated
        if (!updatedprivacyPolicy) {
            return res.status(404).json({ error: 'privacy Policy not found' });
        }

        // Respond with success
        res.status(200).json({ message: 'privacy Policy updated successfully', privacyPolicy: updatedprivacyPolicy });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the privacy policy' });
    }
});

// Route to handle DELETE requests for deleting a privacy policy by ID
privacyPolicyRouter.delete('/privacy-policies/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        // Find the privacyPolicy document by ID and delete it
        const deletedprivacyPolicy = await privacyPolicy.findByIdAndDelete(id);

        // Check if the document was found and deleted
        if (!deletedprivacyPolicy) {
            return res.status(404).json({ error: 'privacy Policy not found' });
        }

        // Respond with success
        res.status(200).json({ message: 'privacy Policy deleted successfully', privacyPolicy: deletedprivacyPolicy });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the privacy policy' });
    }
});

module.exports = { privacyPolicyRouter };
