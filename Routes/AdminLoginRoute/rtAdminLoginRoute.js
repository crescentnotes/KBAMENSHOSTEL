import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../../db/index.js';  // Database connection setup
import { getAllGatepassRequests } from '../../db/dbservice.js';  // Retrieves gatepass requests
import { checkAuthenticated } from '../../middlewares/authMiddleware.js';  // Auth middleware

import { getGatepassRequestsByRTID } from '../../db/dbservice.js'; 
const router = express.Router();

// Render RT admin login page
router.get('/rtadmin/login', (req, res) => {
    res.render('adminlogins/Rt-admin-login', { error: null, username: '' });
});

// Handle RT admin login
router.post('/rtadmin/login', async (req, res) => {
    const { rtid, email, password } = req.body;

    if (!rtid || !email || !password) {
        console.error("RT ID, email, or password not provided.");
        return res.status(400).json({ message: "RT ID, email, and password are required." });
    }

    try {
        // Query to check RT admin credentials
        const result = await pool.query("SELECT * FROM rt WHERE rtid = $1 AND email = $2", [rtid, email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password;

            // Verify password
            bcrypt.compare(password, storedPassword, async (err, isMatch) => {
                if (err) {
                    console.error("Password comparison error:", err);
                    return res.status(500).json({ message: "Internal Server Error" });
                }

                if (isMatch) {
                    req.session.user = user;

                    // Insert login record
                    try {
                        await pool.query("INSERT INTO logins (email) VALUES ($1)", [email]);
                    } catch (insertErr) {
                        console.error("Error inserting login record:", insertErr);
                    }

                    // Fetch gate pass requests specific to this RT admin's `rtid`
                    const gatepassRequests = await getGatepassRequestsByRTID(rtid);

                    // Render the RT admin panel with requests for this specific RT
                    res.render('adminpanels/Rt-admin-panel', { user, gatepassRequests });
                } else {
                    res.status(401).json({ message: "Incorrect Password" });
                }
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
