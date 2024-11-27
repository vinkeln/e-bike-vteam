"use strict";
const express = require("express");
const app = express();
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const citiesRoutes = require("./routes/cities.js");
const parkingsRoutes = require("./routes/parkings.js");
const userRoutes = require("./routes/user.js");
const port = process.env.PORT || 3000;

app.use(morgan('dev'));

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((req,res,next) =>  {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, GET, POST, PATCH, DELETE');
        return res.status(200).json({});

    }
    next();
})


app.use((req, res, next)=>{
    console.log(`got a requist ${req.path} (${req.method})`);
    next();
});

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per minute
    message: "Too many requests, please try again later.",
});
app.use(limiter);

app.use((req, res, next) => {
    let apiKey;

    if (req.method === 'GET') {
        apiKey = req.query['api_key'];
    } else if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        apiKey = req.body['api_key'];
    }

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: "Forbidden: Invalid API key" });
    }

    next();
});


app.use("/v1/cities",citiesRoutes);
app.use("/v1/parking",parkingsRoutes);
app.use("/v1/user",userRoutes);


app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


app.listen(port, () =>{
    console.log(`server is listening on port: ${port}`);
});
