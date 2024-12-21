import express from 'express';
import pool from '../../db/index.js'; // Import the default pool instance

const router = express.Router();

// Housekeeping POST route

router.post('/electricalrequest', async (req, res) => {
    const { name, rrn, block, room_number, complaint } = req.body;

    // Validate that required fields are provided
    if (!name || !rrn || !block || !room_number || !complaint) {
        return res.render('electricalwork', {
            success: false,


            message: 'All fields are required.'
        });
    }

    try {
        // Insert the electrical request into the database
        await pool.query(
            'INSERT INTO electrical_work_requests (name, rrn, block, room_number, complaint, maintenance_done, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [name, rrn, block, room_number, complaint, 'No', 'pending']
        );

        // Render the EJS template with a success message
        res.render('maintenance/electricalworks', {
            success: true,
            message: 'Electrical work request submitted successfully!'
        });
    } catch (error) {
        console.error('Error submitting request:', error);
        res.render('maintenance/electricalworks', {
            success: false,
            message: 'Failed to submit the request. Please try again.'
        });
    }
});

export default router;