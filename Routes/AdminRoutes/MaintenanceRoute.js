import express from 'express';
import {
    getPendingHousekeepingRequests,
    getCompletedHousekeepingRequests,
    updateHousekeepingRequestStatus,
    getPendingElectricalRequests,
    getCompletedElectricalRequests,
    updateElectricalRequestStatus,
    getPendingCarpentryRequests,
    getCompletedCarpentryRequests,
    updateCarpentryRequestStatus
} from '../../db/dbservice.js';

const router = express.Router();

// Middleware for error handling
const handleError = (res, error, message) => {
    console.error(`${message}:`, error.message);
    res.status(500).json({ message });
};

// Maintenance admin panel
router.get('/maintenanceadmin', async (req, res) => {
    try {
        const [
            pendingElectricalRequests,
            completedHousekeepingRequests,
            completedElectricalRequests,
            pendingHousekeepingRequests,
            pendingCarpentryRequests,
            completedCarpentryRequests
        ] = await Promise.all([
            getPendingElectricalRequests(),
            getCompletedHousekeepingRequests(),
            getCompletedElectricalRequests(),
            getPendingHousekeepingRequests(),
            getPendingCarpentryRequests(),
            getCompletedCarpentryRequests()
        ]);

        const section = req.query.section || 'housekeeping'; // Get section from query parameter

        res.render('adminpanels/Maintenance-admin-panel', {
            section,
            pendingElectricalRequests,
            completedElectricalRequests,
            pendingHousekeepingRequests,
            completedHousekeepingRequests,
            pendingCarpentryRequests,
            completedCarpentryRequests,
            userRole: 'maintenanceadmin'
        });
    } catch (error) {
        handleError(res, error, "Error fetching requests in Maintenance Admin");
    }
});

// Helper function for updating request status
const updateRequestStatus = async (req, res, updateFunction, section) => {
    const requestId = req.params.id;
    const isCompleted = req.body.completed === 'on';

    try {
        await updateFunction(requestId, isCompleted);
        // Redirect to the same section after updating
        res.redirect(`/maintenanceadmin?section=${section}`);
    } catch (error) {
        handleError(res, error, 'Error updating request status');
    }
};

// Routes for updating housekeeping and electrical requests
router.post('/maintenanceadmin/update-housekeeping/:id', (req, res) => 
    updateRequestStatus(req, res, updateHousekeepingRequestStatus, 'housekeeping'));

router.post('/maintenanceadmin/update-electrical/:id', (req, res) => 
    updateRequestStatus(req, res, updateElectricalRequestStatus, 'electrical'));

router.post('/maintenanceadmin/update-carpentry/:id', (req, res) => 
    updateRequestStatus(req, res, updateCarpentryRequestStatus, 'carpentry'));

export default router;
