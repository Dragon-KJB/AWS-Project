const jwt = require('jsonwebtoken');

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
    // Get token from headers
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     const token = req.header('x-auth-token');
//     if (!token) {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         console.error(err);
//         res.status(401).json({ message: 'Token is not valid' });
//     }
// };

// module.exports = authMiddleware;

// app.post('/bookService', authMiddleware, async (req, res) => {
//     console.log(req.user);  // Check if user is properly fetched from the JWT
//     const { service, date, time } = req.body;
//     const userId = req.user.id;  // Ensure userId is extracted correctly

//     // Continue with the booking logic...
// });
