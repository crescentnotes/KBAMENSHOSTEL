import express from 'express';
import pool from '../../db/index.js'; // Import the default pool instance

const router = express.Router();

// Carpentry POST route
router.post('/carpentryrequest', async (req, res) => {
    const { name, rrn, block, room_number, complaint } = req.body;

    // Validate that required fields are provided
    if (!name || !rrn || !block || !room_number || !complaint) {
        return res.render('maintenance/carpentry', {
            success: null,
            error: 'All fields are required.'
        });
    }

    try {
        // Insert carpentry request into the database
        await pool.query(
            'INSERT INTO carpentry_requests (name, rrn, block, room_number, complaint, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [name, rrn, block, room_number, complaint, 'pending']
        );

        // Render the form again with a success message
        res.render('maintenance/carpentry', {
            success: 'Carpentry work request submitted successfully!',
            error: null
        });
    } catch (error) {
        console.error('Error submitting carpentry request:', error);
        res.render('maintenance/carpentry', {
            success: null,
            error: 'Failed to submit the carpentry work request. Please try again.'
        });
    }
});

export default router;
