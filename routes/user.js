const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userModules = require("../src/user/modules.js");
const checkAuth = require("../middleware/check-auth.js");
const checkAdmin = require("../middleware/check-admin.js");


router.get("/users", checkAuth, checkAdmin, async (req, res) => {
    users = await userModules.getUsers();
    res.status(200).json({
        message:"parking it is working",
        users: users
    });
});


router.post("/signup", async (req, res) => {
    const { mail, name, password, role } = req.body;

    try {
       
        

        // Kontrollera om e-post redan finns
        const existingUser = await userModules.getUserEmails(mail)
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "Mail exists" });
        }
        // Hasha lösenordet
        const hash = await bcrypt.hash(password, 10);

        // Infoga ny användare i databasen
        await userModules.createUser(name,mail,hash,role);

        res.status(201).json({
            message: "User has been created",
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    } 
    
});

router.post("/login",async (req,res) => {
    const mail = req.body.mail;
    const userPassword = req.body.password;
    

    try {
        
        
        // Hämta användaren baserat på mail
        const existingUser = await userModules.getUserEmails(mail);

      
        
        // Om ingen användare hittas, returnera 401
        if (existingUser.length === 0) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }

        // Jämför lösenordet med det hashade lösenordet från databasen
        const match = await bcrypt.compare(userPassword, existingUser[0].password);
        
        if (!match) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }

        // Om lösenordet matchar, skapa JWT-token
        const token = jwt.sign(
            {
                email: existingUser[0].email,
                userId: existingUser[0].user_id
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        // Skicka tillbaka svaret med token
        return res.status(200).json({
            message: "Auth successful",
            token: token
        });

    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    } 

});

router.delete("/:userId", checkAuth , async (req, res) => {
    const  userId  = req.params.userId;  

    

    try {
        

        // Först, kolla om användaren finns genom att hämta användaren med user_id
        const existingUser = await userModules.getUserid(userId);

        if (!existingUser || existingUser.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Om användaren finns, radera användaren baserat på user_id
        userModules.deleteUser(userId);

        res.status(200).json({ message: "User has been deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.put("/update/password", checkAuth , async (req, res) => {
    const userId  = req.body.user_id;  
    const newPassword = req.body.new_password;
    const oldPassword = req.body.old_password;
    

    try {
        

        // Först, kolla om användaren finns genom att hämta användaren med user_id
        const existingUser = await userModules.getUserid(userId);

        if (existingUser.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(oldPassword, existingUser[0].password);

        if (!match) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        await userModules.updatePassword(hash,userId);

        res.status(200).json({ message: "password has been updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.put("/update/user", checkAuth , async (req, res) => {
    const userId  = req.body.user_id;  
    const {name, email} = req.body;
    
    

    try {
        

        // Först, kolla om användaren finns genom att hämta användaren med user_id
        const existingUser = await userModules.getUserid(userId);

        if (existingUser.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingEmail = await userModules.getUserEmails(email)
        if (existingEmail.length > 0) {
            return res.status(409).json({ message: "Mail exists" });
        }
        await userModules.updateUser(userId,name, email)
        res.status(200).json({ message: "information has been updated successfully" });
    } catch (error) {
        console.error("Error updating information:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.put("/update/balance", checkAuth , async (req, res) => {
    const userId  = req.body.user_id;
    const balance  = req.body.balance;
    
    try {
        

        // Först, kolla om användaren finns genom att hämta användaren med user_id
        const existingUser = await userModules.getUserid(userId);

        if (existingUser.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        
        await userModules.updateBalance(userId,balance)
        res.status(200).json({ message: "Balance has been updated successfully" });
    } catch (error) {
        console.error("Error updating Balance:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;