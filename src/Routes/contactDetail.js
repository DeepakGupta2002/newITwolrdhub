const express = require('express');
const mongoose = require('mongoose');
const { Contact } = require('../modal/contact');
const { authenticateToken } = require('../midilwhere/auth');
const contactRouter = express.Router();

// Middleware to parse JSON bodies
contactRouter.use(express.json());

// Route to handle POST requests for adding new contact details
contactRouter.post('/contacts', authenticateToken, async (req, res) => {
    const { phone, email, address } = req.body;

    // Validate the request body
    if (!phone || !email) {
        return res.status(400).json({ error: 'Phone and email are required' });
    }

    try {
        // Create a new Contact document
        const newContact = new Contact({ phone, email, address });

        // Save the document to the database
        await newContact.save();

        // Respond with success
        res.status(201).json({ message: 'Contact saved successfully', contact: newContact });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred while saving the contact' });
    }
});

// Route to handle GET requests for retrieving all contact details
contactRouter.get('/contacts', async (req, res) => {
    try {
        // Retrieve all contact documents from the database
        const contacts = await Contact.find();

        // Respond with the retrieved data
        res.status(200).json({ contacts });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the contacts' });
    }
});



// Route to handle PUT requests for updating a contact by ID
contactRouter.put('/contacts/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { phone, email, address } = req.body;

    // Validate the request body
    if (!phone || !email) {
        return res.status(400).json({ error: 'Phone and email are required' });
    }

    try {
        // Find the contact document by ID and update it
        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { phone, email, address },
            { new: true } // Return the updated document
        );

        // Check if the document was found and updated
        if (!updatedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Respond with success
        res.status(200).json({ message: 'Contact updated successfully', contact: updatedContact });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the contact' });
    }
});

// Route to handle DELETE requests for deleting a contact by ID
contactRouter.delete('/contacts/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        // Find the contact document by ID and delete it
        const deletedContact = await Contact.findByIdAndDelete(id);

        // Check if the document was found and deleted
        if (!deletedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Respond with success
        res.status(200).json({ message: 'Contact deleted successfully', contact: deletedContact });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the contact' });
    }
});

module.exports = { contactRouter };
