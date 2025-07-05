//server.js, entry point to the app
require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { connectDB } = require('./config/database');

//get port
const port = process.env.PORT || 3000;

// Create HTTP server tests
const server = http.createServer(app);

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDB();
        server.listen(port, () => {
            console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// handle server errors
server.on('error', (error) => {
    if(error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
        process.exit(1);
    } else {
        console.error('Server error:', error);
    }
});

//start the server
startServer();