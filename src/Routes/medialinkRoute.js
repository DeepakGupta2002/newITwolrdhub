const express = require('express');
const { body, validationResult, param } = require('express-validator');
// const { SocialMediaLink } = require('../modal/socialmedia');
const { authenticateToken } = require('../midilwhere/auth');
const { SocialMediaLink } = require('../modal/socailmedia');
const socialMediaRouter = express.Router();

// Validation rules for Social Media Links
const socialMediaValidationRules = [
    body('facebook').isURL().withMessage('Facebook URL is required and must be a valid URL'),
    body('instagram').isURL().withMessage('Instagram URL is required and must be a valid URL'),
    body('twitter').isURL().withMessage('Twitter URL is required and must be a valid URL'),
    body('linkedin').isURL().withMessage('LinkedIn URL is required and must be a valid URL'),
    body('whatsapp').matches(/^\+[1-9]\d{1,14}$/).withMessage('WhatsApp number is required and must be in international format (e.g., +1234567890)'),
    body('call').matches(/^\+[1-9]\d{1,14}$/).withMessage('Call number is required and must be in international format (e.g., +1234567890)')
];

// Utility function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Create a new Social Media Link
socialMediaRouter.post('/social-media-links', authenticateToken, socialMediaValidationRules, handleValidationErrors, async (req, res) => {
    try {
        const socialMediaLink = new SocialMediaLink(req.body);
        await socialMediaLink.save();
        res.status(201).json(socialMediaLink);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all Social Media Links
socialMediaRouter.get('/social-media-links', async (req, res) => {
    try {
        const socialMediaLinks = await SocialMediaLink.find();
        res.status(200).json(socialMediaLinks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a Social Media Link by ID
socialMediaRouter.get('/social-media-links/:id', [
    param('id').isMongoId().withMessage('Invalid ID format')
], handleValidationErrors, async (req, res) => {
    try {
        const socialMediaLink = await SocialMediaLink.findById(req.params.id);
        if (!socialMediaLink) {
            return res.status(404).json({ error: 'Social Media Link not found' });
        }
        res.status(200).json(socialMediaLink);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a Social Media Link by ID
socialMediaRouter.put('/social-media-links/:id', authenticateToken, [
    param('id').isMongoId().withMessage('Invalid ID format'),
    ...socialMediaValidationRules.map(rule => rule.optional())
], handleValidationErrors, async (req, res) => {
    try {
        const socialMediaLink = await SocialMediaLink.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!socialMediaLink) {
            return res.status(404).json({ error: 'Social Media Link not found' });
        }
        res.status(200).json(socialMediaLink);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a Social Media Link by ID
socialMediaRouter.delete('/social-media-links/:id', authenticateToken, [
    param('id').isMongoId().withMessage('Invalid ID format')
], handleValidationErrors, async (req, res) => {
    try {
        const socialMediaLink = await SocialMediaLink.findByIdAndDelete(req.params.id);
        if (!socialMediaLink) {
            return res.status(404).json({ error: 'Social Media Link not found' });
        }
        res.status(200).json({ message: 'Social Media Link deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { socialMediaRouter };
