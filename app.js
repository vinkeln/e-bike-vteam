"use strict";
require('dotenv').config();
console.log("Loaded API_KEY:", process.env.API_KEY);
const express = require("express");
const app = express();
const http = require("http"); // För att skapa en HTTP-server
const initializeSocketHandlers = require("./sockets/socketHandlers.js"); // Din Socket.IO-handler
const morgan = require("morgan"); // Middleware for logging HTTP requests
const rateLimit = require("express-rate-limit"); // Middleware to limit repeated requests
const citiesRoutes = require("./routes/cities.js"); // Cities routes file
const parkingsRoutes = require("./routes/parkings.js"); // Parkings routes file
const userRoutes = require("./routes/user.js"); // User routes file
const chargingStationsRoutes = require("./routes/chargingstations.js"); // chargingstations routes file
const travelsRoutes = require("./routes/travels.js"); // Travels routes file
const bikesRoutes = require("./routes/scooter.js"); // bikes routes file
const paymentsRoutes = require("./routes/payment.js"); // payment routes file
const port = process.env.PORT || 3000; // Default port or one specified in the environment

// Use Morgan middleware to log incoming HTTP requests
app.use(morgan('dev'));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse URL-encoded data and JSON payloads in incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to set up CORS (Cross-Origin Resource Sharing) headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Headers', '*'); // Allow all headers
    if (req.method === 'OPTIONS') {
        // Allow specific HTTP methods for preflight requests
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next(); // Move to the next middleware
});

// Middleware to log each request's path and method for debugging
app.use((req, res, next) => {
    console.log(`got a request ${req.path} (${req.method})`);
    next();
});

// Rate limiting middleware to restrict the number of requests per minute
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // Time frame of 1 minute
    max: 100, // Maximum 100 requests per IP in the time frame
    message: "Too many requests, please try again later.", // Message returned when limit is exceeded
});
app.use(limiter); // Apply rate limiting globally

// Middleware to handle API key authentication
app.use((req, res, next) => {
    let apiKey; // Variable to store the API key

    // Extract API key from the query string for GET requests
    if (req.method === 'GET') {
        apiKey = req.query['api_key'];
    } 
    // Extract API key from the request body for other methods (POST, PUT, DELETE)
    else if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        apiKey = req.body['api_key'];
    }

    // Validate the API key
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: "Forbidden: Invalid API key" }); // Return an error if invalid
    }

    next(); // API key is valid, move to the next middleware
});

// Mount versioned routes for cities, parking, and user-related endpoints
app.use("/v1/cities", citiesRoutes); // All city-related routes start with /v1/cities
app.use("/v1/parking", parkingsRoutes); // All parking-related routes start with /v1/parking
app.use("/v1/user", userRoutes); // All user-related routes start with /v1/user
app.use("/v1/travels", travelsRoutes); // All travels-related routes start with /v1/travels
app.use("/v1/chargingstations", chargingStationsRoutes); // All chargingstations-related routes start with /v1/chargingstations
app.use("/v1/bikes", bikesRoutes); // All bikes-related routes start with /v1/bikes
app.use("/v1/payment", paymentsRoutes); // All payment-related routes start with /v1/payment

paymentsRoutes
// Middleware to handle routes that are not defined (404 errors)
app.use((req, res, next) => {
    const error = new Error('Not found'); // Create an error with a message
    error.status = 404; // Set status code to 404
    next(error); // Pass the error to the error-handling middleware
});

// Centralized error-handling middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500); // Use the error's status or default to 500 (Internal Server Error)
    res.json({
        error: {
            message: error.message // Return the error message in the response
        }
    });
});


// Create HTTP Server and Integrate Socket.IO
const server = http.createServer(app);
initializeSocketHandlers(server); // Starta Socket.IO

// Start the server and listen on the specified port
server.listen(port, () => {
    console.log(`server is listening on port: ${port}`);
});
