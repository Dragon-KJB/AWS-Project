// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const Booking = require('./models/Booking'); // Add at the top with your other requires
// const corsOptions = {
//     origin: 'http://localhost',  // Allow frontend to communicate with backend
//     methods: 'GET,POST',
//     allowedHeaders: ['Content-Type', 'Authorization'],
// };
// app.use(cors(corsOptions));


// app.post('/bookService', async (req, res) => {
//     const { userId, service, date, time } = req.body;

//     if (!userId || !service || !date || !time) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     try {
//         const booking = new Booking({ userId, service, date, time });
//         await booking.save();
//         res.status(201).json({ message: 'Booking confirmed', booking });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Routes
app.use('/api', require('./routes/authRoutes'));

app.get('/api/test', (req, res) => {
    res.send('API is working!');
});


// Sample booking route
app.post('/bookService', (req, res) => {
    const { service, date, time } = req.body;

    if (!service || !date || !time) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Here you will handle the logic for booking (e.g., saving to DB)
    return res.status(200).json({ message: `Service booked: ${service} on ${date} at ${time}` });
});

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const authMiddleware = require('./middleware/authMiddleware');

// Protected route (e.g., for getting user details)
app.get('/api/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user);  // Fetch user by ID from token
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user: { firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/bookService', async (req, res) => {
    const { userId, service, date, time } = req.body;

    if (!userId || !service || !date || !time) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Logic to save booking to the database
    try {
        const newBooking = new Booking({ userId, service, date, time });
        await newBooking.save();
        res.status(200).json({ message: 'Booking successful!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
