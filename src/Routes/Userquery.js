const express = require('express');
const mongoose = require('mongoose');
const { QueryUser } = require('../modal/queryUser');
const queryUser = express.Router();
// Middleware to parse JSON bodies
queryUser.use(express.json());

// Route to handle POST requests for user queries
const { check, validationResult } = require('express-validator');
const { authenticateToken } = require('../midilwhere/auth');

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
            const newQuery = new QueryUser({ name, email, phone, query });
            await newQuery.save();
            res.status(201).json({ message: 'Query saved successfully', query: newQuery });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while saving the query' });
        }
    });

// Route to handle GET requests for retrieving all queries
queryUser.get('/queries',
    authenticateToken
    , async (req, res) => {
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
            // Handle errors
            console.error(error);
            res.status(500).json({ error: 'An error occurred while deleting the query' });
        }
    });

module.exports = { queryUser };
