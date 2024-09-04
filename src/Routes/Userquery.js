const express = require('express');
const mongoose = require('mongoose');
const { QueryUser } = require('../modal/queryUser');
const queryUser = express.Router();
const { check, validationResult } = require('express-validator');
const { authenticateToken } = require('../midilwhere/auth');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// Middleware to parse JSON bodies
queryUser.use(express.json());

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use Gmail's SMTP service
    secure: true,
    port:
        465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // For some email services to work correctly
    }
});

// Route to handle POST requests for user queries
queryUser.post('/queries',
    [
        check('name').notEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Valid email is required'),
        check('phone').isMobilePhone().withMessage('Valid phone number is required'),
        check('query').notEmpty().withMessage('Query is required')
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, query } = req.body;

        try {
            // Save the query to the database
            const newQuery = new QueryUser({ name, email, phone, query });
            await newQuery.save();

            // Prepare email options for the user
            const userMailOptions = {
                from: process.env.EMAIL_USER,
                to: email, // Send to the user's email
                subject: 'Your Query has been Received',
                text: `Hello ${name},\n\nThank you for reaching out to us. We have received your query. Our team will contact you soon.\n\nBest Regards,\nITworldhub.com`
            };

            // Send confirmation email to the user
            await transporter.sendMail(userMailOptions);

            // Prepare email options for yourself (admin)
            const adminMailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER, // Send to your own email
                subject: 'New Query Received',
                text: `A new query has been submitted by ${name}.\n\nDetails:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nQuery: ${query}`
            };

            // Send notification email to yourself
            await transporter.sendMail(adminMailOptions);

            res.status(201).json({ message: 'Query saved and emails sent successfully', query: newQuery });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: 'An error occurred while saving the query or sending emails',
                details: error.message
            });
        }
    });

// Route to handle GET requests for retrieving all queries
queryUser.get('/queries',
    authenticateToken,
    async (req, res) => {
        try {
            // Extract and validate query parameters
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 20;
            const sortBy = req.query.sortBy || 'createdAt';
            const order = req.query.order === 'asc' ? 'asc' : 'desc'; // Fixed sorting order

            // Validate limit and page
            if (limit < 1 || page < 1) {
                return res.status(400).json({ error: 'Page and limit must be positive integers.' });
            }

            // Calculate the number of documents to skip for pagination
            const skip = (page - 1) * limit;

            // Retrieve paginated and sorted query documents from the database
            const queries = await QueryUser.find()
                .sort({ [sortBy]: order === 'asc' ? 1 : -1 }) // Use 'asc' or 'desc' correctly
                .skip(skip)
                .limit(limit);

            // Get total count for pagination
            const totalQueries = await QueryUser.countDocuments();

            // Respond with the retrieved data and pagination info
            res.status(200).json({
                totalQueries,
                totalPages: Math.ceil(totalQueries / limit),
                currentPage: page,
                queries
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while retrieving the queries' });
        }
    });

// Route to handle DELETE requests for deleting a specific query by ID
queryUser.delete('/queries/:id',
    authenticateToken,
    async (req, res) => {
        const { id } = req.params;

        try {
            // Find the query document by ID and delete it
            const deletedQuery = await QueryUser.findByIdAndDelete(id);

            // Check if the document was found and deleted
            if (!deletedQuery) {
                return res.status(404).json({ error: 'Query not found' });
            }

            // Respond with success
            res.status(200).json({ message: 'Query deleted successfully', query: deletedQuery });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while deleting the query' });
        }
    });

module.exports = { queryUser };
