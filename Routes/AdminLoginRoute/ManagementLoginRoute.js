// import express from 'express';
// import bcrypt from 'bcryptjs';
// import pool from '../../db/index.js';  // Database connection setup
// import { 
//     getPendingHousekeepingRequests, 
//     getCompletedHousekeepingRequests, 
//     updateHousekeepingRequestStatus,
//     getPendingElectricalRequests,
//     getCompletedElectricalRequests,
//     updateElectricalRequestStatus,
//     getAllUsers,
//     getRtUser,
//     getLoginAttempts,
//     registerUser,
//     deleteUser,
//     registerRT,
//     registerManager 
// } from '../../db/dbservice.js';
// const router = express.Router();

// // // Render admin login page
// // router.get('/admin/login', (req, res) => {

// //     res.render('adminlogins/management-admin-login', { message: null, email: '' });
// // });

// // // Handle admin login
// // // Handle admin login
// // router.post('/admin/login', async (req, res) => {
// //     const { email, password } = req.body;

// //     // Check if all fields are provided
// //     if (!email || !password) {
// //         return res.render('adminlogins/management-admin-login', { message: "Email and password are required.", email });
// //     }

// //     try {
// //         // Query to check admin credentials using email
// //         const result = await pool.query("SELECT * FROM admin WHERE email = $1", [email]);

// //         if (result.rows.length === 0) {
// //             // User not found
// //             return res.render('adminlogins/management-admin-login', { message: "User not found", email });
// //         }

// //         const user = result.rows[0];
// //         const storedPassword = user.password;

// //         // Verify the password by comparing the entered password with the stored hashed password
// //         const isMatch = await bcrypt.compare(password, storedPassword);

// //         if (isMatch) {
// //             // Save user session securely
// //             req.session.regenerate((err) => {
// //                 if (err) throw err;

// //                 req.session.user = {
// //                     username: user.username,
// //                     email: user.email,
// //                 };

// //                 // Insert login record into database
// //                 pool.query("INSERT INTO admin_logins (admin_email) VALUES ($1)", [user.email])
// //                     .catch((err) => console.error("Failed to log login attempt:", err));

// //                 // Fetch all data required for the admin panel
// //                 Promise.all([
// //                     getAllUsers(),
// //                     getRtUser(),
// //                     getLoginAttempts(),
// //                     getPendingHousekeepingRequests(),
// //                     getCompletedHousekeepingRequests(),
// //                     getPendingElectricalRequests(),
// //                     getCompletedElectricalRequests()
// //                 ])
// //                 .then(([users, Rtusers, loginAttempts, pendingHousekeepingRequests, completedHousekeepingRequests, pendingElectricalRequests, completedElectricalRequests]) => {
// //                     res.render('adminpanels/management-panel', {
// //                         users, 
// //                         Rtusers,
// //                         loginAttempts,
// //                         pendingHousekeepingRequests,
// //                         completedHousekeepingRequests,
// //                         pendingElectricalRequests,
// //                         completedElectricalRequests
// //                     });
// //                 })
// //                 .catch((error) => handleError(res, error, "Error fetching requests in Admin"));
// //             });
// //         } else {
// //             // Password does not match
// //             return res.render('adminlogins/management-admin-login', { message: "Incorrect Password", email });
// //         }
// //     } catch (err) {
// //         console.error("Database Query Error:", err);
// //         return res.render('adminlogins/management-admin-login', { message: "Internal Server Error", email });
// //     }
// // });
 

// export default router;

