// Middleware to check if a general user is authenticated
export const checkAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); // User is authenticated, proceed
    }
    res.redirect('/login'); // Redirect if not authenticated
};

// Middleware to allow unauthenticated access to specific public routes
export const isAuthenticated = (req, res, next) => {
    const publicPaths = ['/login', '/admin/login', '/rtadmin/login'];
    
    // Allow access if the route is public
    if (publicPaths.includes(req.path)) {
        return next();
    }

    // Check if the user is authenticated for other routes
    if (req.session.user) {
        return next();
    }

    // Redirect to login if not authenticated
    res.redirect('/login');
};
export const isManagementAdminAuthenticated = (req, res, next) => {
    // Allow access to management admin login page if not authenticated
    if (req.path.startsWith('/admin/login')) {
        // If already authenticated, redirect to management panel
        if (req.session.admin && req.session.admin.role === 'admin') {
            return res.redirect('/managementpanel');
        }
        return next(); // Allow access to login page if not authenticated
    }

    // For all other /admin routes, check if authenticated as admin
    if (req.path.startsWith('/managementpanel') || req.path.startsWith('/admin')) {
        if (req.session.admin && req.session.admin.role === 'admin') {
            return next(); // Allow access to management admin routes if authenticated
        }
        return res.render('adminlogins/managementadminpanel', { message: 'Please log in as an admin.' });
    }

    next(); // Allow other routes to continue
};

export const isRTAdminAuthenticated = (req, res, next) => {
    if (req.path.startsWith('/rtadmin/login')) {
        // If already authenticated as RT admin, redirect to RT admin dashboard
        if (req.session.rtAdmin && req.session.rtAdmin.role === 'RT') {
            return res.redirect('/rtadmin');
        }
        return next();
    }

    if (req.path.startsWith('/rtadmin')) {
        if (req.session.rtAdmin && req.session.rtAdmin.role === 'RT') {
            return next();
        }
        return res.render('adminlogins/Rt-admin-login', { message: 'Please log in as an RT admin.' });
    }

    next();
};

// // Middleware to check if a general user is authenticated
// export const checkAuthenticated = (req, res, next) => {
//     if (req.session.user) {
//         return next(); // User is authenticated, proceed
//     }
//     res.redirect('/login'); // Redirect if not authenticated
// };

// // Middleware to allow unauthenticated access to specific public routes
// export const isAuthenticated = (req, res, next) => {
//     const publicPaths = ['/login', '/admin/login', '/rtadmin/login'];

//     // Allow access if the route is public
//     if (publicPaths.includes(req.path)) {
//         return next();
//     }

//     // Check if the user is authenticated for other routes
//     if (req.session.user) {
//         return next();
//     }

//     // Redirect to login if not authenticated
//     res.redirect('/login');
// };

// // Utility function to check and handle role-based redirects
// const checkRoleAuthentication = (req, role, sessionKey, redirectUrl, loginView) => {
//     // If the user is already authenticated, redirect to the respective dashboard
//     if (req.session[sessionKey] && req.session[sessionKey].role === role) {
//         return res.redirect(redirectUrl);
//     }
//     return res.render(loginView, { message: `Please log in as ${role}.` });
// };

// // Middleware for Management Admin authentication
// export const isManagementAdminAuthenticated = (req, res, next) => {
//     const { path } = req;

//     if (path.startsWith('/admin/login')) {
//         // If already authenticated, redirect to management panel
//         if (req.session.admin && req.session.admin.role === 'admin') {
//             return res.redirect('/managementpanel');
//         }
//         return next(); // Allow access to the login page if not authenticated
//     }

//     if (path.startsWith('/managementpanel') || path.startsWith('/admin')) {
//         // Check if authenticated as admin
//         if (req.session.admin && req.session.admin.role === 'admin') {
//             return next(); // Allow access to the admin routes
//         }
//         return res.render('adminlogins/managementadminpanel', { message: 'Please log in as an admin.' });
//     }

//     next(); // Allow other routes to continue
// };

// // Middleware for RT Admin authentication
// export const isRTAdminAuthenticated = (req, res, next) => {
//     const { path } = req;

//     if (path.startsWith('/rtadmin/login')) {
//         // If already authenticated as RT admin, redirect to RT admin dashboard
//         if (req.session.rtAdmin && req.session.rtAdmin.role === 'RT') {
//             return res.redirect('/rtadmin');
//         }
//         return next(); // Allow access to RT admin login if not authenticated
//     }

//     if (path.startsWith('/rtadmin')) {
//         // Check if authenticated as RT admin
//         if (req.session.rtAdmin && req.session.rtAdmin.role === 'RT') {
//             return next(); // Allow access to RT admin routes
//         }
//         return res.render('adminlogins/Rt-admin-login', { message: 'Please log in as an RT admin.' });
//     }

//     next(); // Allow other routes to continue
// };

 
