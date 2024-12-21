import express from 'express';
import bcrypt from 'bcryptjs';
import {
    getPendingHousekeepingRequests,
    getCompletedHousekeepingRequests,
    updateHousekeepingRequestStatus,
    getPendingElectricalRequests,
    getCompletedElectricalRequests,
    updateElectricalRequestStatus,
    getAllUsers,
    getLoginAttempts,
    registerUser,
    deleteUser,
    registerRT,
    deleteRT,
    registerManager,
    getRtUser,
    getPendingCarpentryRequests,
    getCompletedCarpentryRequests,
    updateCarpentryRequestStatus
} from '../../db/dbservice.js';
import { isManagementAdminAuthenticated } from '../../middlewares/authMiddleware.js';
import pool from '../../db/index.js';

const router = express.Router();

// Middleware for error handling
const handleError = (res, error, message) => {
    console.error(`${message}:`, error.message);
    res.status(500).json({ message });
};

// Function to render the management panel with data
const renderManagementPanel = async (res, extraData = {}) => {
    try {
        const [
            users,
            Rtusers,
            loginAttempts,
            pendingHousekeepingRequests,
            completedHousekeepingRequests,
            pendingElectricalRequests,
            completedElectricalRequests,
            pendingCarpentryRequests,
            completedCarpentryRequests
        ] = await Promise.all([
            getAllUsers(),
            getRtUser(),
            getLoginAttempts(),
            getPendingHousekeepingRequests(),
            getCompletedHousekeepingRequests(),
            getPendingElectricalRequests(),
            getCompletedElectricalRequests(),
            getPendingCarpentryRequests(),
            getCompletedElectricalRequests()
        ]);

        res.render('adminpanels/management-panel', {
            users,
            Rtusers,
            loginAttempts,
            pendingHousekeepingRequests,
            completedHousekeepingRequests,
            pendingElectricalRequests,
            completedElectricalRequests,
            pendingCarpentryRequests,
            completedCarpentryRequests,
            userRole: 'management'
        });
    } catch (error) {
        handleError(res, error, "Error fetching data for management panel");
    }
};

// Admin login page
router.get('/admin/login', isManagementAdminAuthenticated , (req, res) => {
    res.render('adminlogins/management-admin-login', { message: null, email: '' });
});

// Handle admin login
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('adminlogins/management-admin-login', { message: "Email and password are required.", email });
    }

    try {
        const result = await pool.query("SELECT * FROM admin WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.render('adminlogins/management-admin-login', { message: "User not found", email });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session.regenerate((err) => {
                if (err) throw err;

                req.session.user = {
                    username: user.username,
                    email: user.email,
                    role: 'admin'
                };

                req.session.save(async (err) => {
                    if (err) throw err;
                    try {
                        await pool.query("INSERT INTO admin_logins (admin_email) VALUES ($1)", [user.email]);
                    } catch (error) {
                        console.error("Failed to log login attempt:", error.message);
                    }

                    // Render the management panel directly instead of redirecting
                    renderManagementPanel(res);
                });
            });
        } else {
            res.render('adminlogins/management-admin-login', { message: "Incorrect Password", email });
        }
    } catch (err) {
        handleError(res, err, "Database Query Error");
    }
});

// Maintenance admin panel
// router.get('/maintenanceadmin', async (req, res) => {
//     try {
//         const [pendingElectricalRequests, completedElectricalRequests, pendingHousekeepingRequests] = await Promise.all([
//             getPendingElectricalRequests(),
//             getCompletedElectricalRequests(),
//             getPendingHousekeepingRequests() // Ensure this function is defined in your dbservice
//         ]);

//         res.render('adminpanels/Maintenance-admin-panel', {
//             pendingElectricalRequests,
//             completedElectricalRequests,
//             pendingHousekeepingRequests // Pass it to the EJS template
//         });
//     } catch (error) {
//         handleError(res, error, "Error fetching requests in Maintenance Admin");
//     }
// });


// Helper function for updating request status
const updateRequestStatus = async (req, res, updateFunction) => {
    const requestId = req.params.id;
    const isCompleted = req.body.completed === 'on';

    try {
        await updateFunction(requestId, isCompleted);
        // Render the management panel directly after updating
        renderManagementPanel(res, { success: true, message: "Request status updated successfully!" });
    } catch (error) {
        handleError(res, error, 'Error updating request status');
    }
};

// Routes for updating housekeeping and electrical requests
router.post('/management/update-housekeeping/:id', (req, res) => updateRequestStatus(req, res, updateHousekeepingRequestStatus));
router.post('/update-electrical/:id', (req, res) => updateRequestStatus(req, res, updateElectricalRequestStatus));
router.post('/update-carpentry/:id',(req,res)=>updateRequestStatus(req,res,updateCarpentryRequestStatus));
// User registration and deletion
router.post('/register-user', async (req, res) => {
    const { name, parent_mob_num, email, password, rtId, rrn } = req.body;

    try {
        // Register the user
        await registerUser(name, parent_mob_num, email, password, rtId, rrn);

        // Render the management panel directly instead of redirecting
        renderManagementPanel(res, { success: true, message: "User registered successfully!" });
    } catch (error) {
        if (error.message === "Email already exists") {
            return renderManagementPanel(res, { error: "User already exists" });
        }
        handleError(res, error, 'Error registering user');
    }
});


router.post('/delete-user/:id', async (req, res) => {
    try {
        await deleteUser(req.params.id);
        // Render management panel directly instead of redirecting
        renderManagementPanel(res, { success: true, message: "User deleted successfully!" });
    } catch (error) {
        handleError(res, error, 'Error deleting user');
    }
});

// RT registration and deletion
router.post('/register-rt', async (req, res) => {
    const { rtid, name, email, password } = req.body;

    try {
        await registerRT(rtid, name, email, password);
        // Render management panel directly instead of redirecting
        renderManagementPanel(res, { success: true, message: "RT registered successfully!" });
    } catch (error) {
        const errorMessage = error.message.includes('RT ID already exists')
            ? 'RT ID already exists. Please choose a different ID.'
            : 'Error registering RT';

        renderManagementPanel(res, { errorMessage });
    }
});

router.post('/delete-rt-user/:rtid', async (req, res) => {
    try {
        await deleteRT(req.params.rtid);
        // Render management panel directly instead of redirecting
        renderManagementPanel(res, { success: true, message: "RT deleted successfully!" });
    } catch (error) {
        const errorMessage = error.message === 'RT not found'
            ? 'RT not found'
            : 'An unexpected error occurred while deleting RT';

        renderManagementPanel(res, { errorMessage });
    }
});

// Manager registration
router.post('/register-manager', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await registerManager(username, hashedPassword, email);
        // Render management panel directly instead of redirecting
        renderManagementPanel(res, { success: true, message: "Manager registered successfully!" });
    } catch (error) {
        if (["Email already exists", "Username already exists"].includes(error.message)) {
            return renderManagementPanel(res, { error: "Manager already exists" });
        }
        handleError(res, error, 'Error registering manager');
    }
});

export default router;
