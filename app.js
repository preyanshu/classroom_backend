// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
dotenv.config();
main().catch((err) => console.error(err));
const cors = require('cors');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// MongoDB Connection
async function main() {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database connected");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

// Mount routes
app.use('/teacher', teacherRoutes);
app.use('/student', studentRoutes);
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

//homepage
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the homepage' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
