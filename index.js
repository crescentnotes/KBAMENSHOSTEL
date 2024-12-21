import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv'; // To manage environment variables
import homeroutes from './Routes/homeroute.js';
import gatepassroute from './Routes/gatepassroute.js';
import maintenanceroute from './Routes/maintenanceroute.js';
import aboutusroute from './Routes/aboutusroute.js';
import loginroute from './Routes/loginroute.js';
import registerroute from './Routes/registerroute.js';
import rtadminroute from './Routes/AdminRoutes/RtRoute.js';
import housekeepingroute from './Routes/MaintenanceRoute/HousekeepingRoute.js';
import electricalworkroute from './Routes/MaintenanceRoute/ElectricalWorkRoute.js';
import carpentryroute from './Routes/MaintenanceRoute/CarpentryRoute.js';
import rtadminloginroute from './Routes/AdminLoginRoute/rtAdminLoginRoute.js';
import maintenanceadminroute from './Routes/AdminRoutes/MaintenanceRoute.js';
import adminManagementLoginRoute from './Routes/AdminRoutes/HostelManagementRoute.js';
import { isAuthenticated, isRTAdminAuthenticated, isManagementAdminAuthenticated } from './middlewares/authMiddleware.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Allow port configuration via environment variable

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static('public'));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to false for local testing
        maxAge: 1000 * 60 * 60 // 1 hour session
    }
}));


// Public routes
app.use('/', adminManagementLoginRoute);
app.use('/', rtadminloginroute); // RT Admin Login
app.use('/', loginroute); // Public login route
app.use('/', registerroute); // Public registration route
app.use('/',maintenanceadminroute);
// Protected routes (require authentication)
app.use('/', isAuthenticated, homeroutes); 
app.use('/', isAuthenticated, gatepassroute);
app.use('/maintenance', isAuthenticated, maintenanceroute);
app.use('/aboutus', isAuthenticated, aboutusroute);
app.use('/', isRTAdminAuthenticated, rtadminroute); // Protect RT admin routes
app.use('/',carpentryroute);
app.use('/', housekeepingroute); // Assuming this route is public or needs protection
app.use('/', electricalworkroute); // Assuming this route is public or needs protection

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
