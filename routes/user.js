const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();


router.post("/signup", (req, res) => {
    //if sats to conrol if  we have this mail already
    const mails = "abed@gmail.com";
    const mail = req.body.mail;

    if (mails === mail) {
        return res.status(409).json({
            message:"mail exists"
        });
    }


    bcrypt.hash(req.body.password, 10, (error,hash) => {
        if (error) {
            return res.status(500).json({
                error: error
            });
        }

        const name = req.body.name;
        const user = {
            username: name,
            usermail: mail,
            password:hash

        }
        res.status(201).json({
            userInfo: user,
            message: "Userhas been created"
        });
    

    });
});

router.post("/login",(req,res) => {
    const userMail = req.body.mail; 
    const userPassword = req.body.password;
    // find the user mail from database by a function that return the user info as a object
    const user = {
        mail: "abed@gmail.com",
        password: "$2b$10$kG64u45AF54Klob0nGFAauGp6M3lAyVLlTgMxIjpr8UWZFZMIpdQ6"
    }
    if (!user){
        return res.status(401).json({
            message: "Auth faild"
        });
    }
    bcrypt.compare(userPassword,user.password, (error,result) => {
        if (error) {
            return res.status(401).json({
                message: "Auth faild"
            });
        }
        if (result) {
            const token = jwt.sign({
                email: user.mail,
                userId: user.id
            },
            process.env.JWT_KEY,
        
            {
                expiresIn: "1h"
            }
        );
            return res.status(200).json({
                message: "Auth successful",
                token: token
            });
        }
        return res.status(401).json({
            message: "Auth faild"
        });
    });

});

router.delete("/:userId", (req, res) => {
    res.status(200).json({
        message:"user deleted"
    });
});


module.exports = router;