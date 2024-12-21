import express from 'express';
import pool from '../../db/index.js'; // Import the default pool instance

const router = express.Router();

// Housekeeping GET route to render the form
router.get('/housekeepingform', (req, res) => {
    res.render('maintenance/housekeepingform', { success: null, error: null });
});

// Housekeeping POST route to handle form submission
router.post('/housekeepingrequest', async (req, res) => {
    const { name, rrn, block, room_number } = req.body;

    // Validate that required fields are provided
    if (!name || !rrn || !block || !room_number) {
        return res.render('maintenance/housekeeping', {
            success: null,
            error: 'All fields are required.'
        });
    }

    try {
        // Insert housekeeping request into the database
        await pool.query(
            'INSERT INTO housekeeping_requests (name, rrn, block, room_number, maintenance_done, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [name, rrn, block, room_number, 'No', 'pending']
        );

        // Render the form again with a success message
        res.render('maintenance/housekeeping', {
            success: 'Housekeeping request submitted successfully!',
            error: null
        });
    } catch (error) {
        console.error('Error submitting housekeeping request:', error);
        res.render('maintenance/housekeeping', {
            success: null,
            error: 'Failed to submit the housekeeping request. Please try again.'
        });
    }
});

export default router;
