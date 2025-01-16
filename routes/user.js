// Importera nödvändiga bibliotek och moduler
const express = require("express");
const bcrypt = require("bcrypt"); // För lösenordshashning
const jwt = require("jsonwebtoken"); // För att skapa och verifiera JWT
const router = express.Router(); // Skapa en Express-router
const userModules = require("../src/user/modules.js"); // Moduler för databashantering relaterade till användare
const checkAuth = require("../middleware/check-auth.js"); // Middleware för att kontrollera autentisering
const checkAdmin = require("../middleware/check-admin.js"); // Middleware för att kontrollera administratörsbehörighet

// Endpoint för att hämta alla användare, endast tillgängligt för inloggade administratörer
router.get("/users", checkAuth, checkAdmin, async (req, res) => {
  users = await userModules.getUsers(); // Hämta användarlistan från databasen
  res.status(200).json({
    message: "ALL users",
    users: users,
  });
});

// Endpoint för att registrera en ny användare
router.post("/signup", async (req, res) => {
  const { mail, name, password, role } = req.body; // Hämta användardata från förfrågan

  try {
    // Kontrollera om e-posten redan finns i databasen
    const existingUser = await userModules.getUserEmails(mail);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Mail exists" });
    }
    // Hasha lösenordet för säker lagring
    const hash = await bcrypt.hash(password, 10);

    // Skapa en ny användare i databasen
    await userModules.createUser(name, mail, hash, role);

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

// Endpoint för inloggning av en användare
router.post("/login", async (req, res) => {
  const mail = req.body.mail;
  const userPassword = req.body.password;

  try {
    // Hämta användaren baserat på e-post
    const existingUser = await userModules.getUserEmails(mail);

    // Kontrollera om användaren existerar
    // Om ingen användare hittas, returnera 401
    if (existingUser.length === 0) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }

    // Jämför lösenordet med det hashade lösenordet från databasen
    const match = await bcrypt.compare(userPassword, existingUser[0].password);

    if (!match) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }

    // Skapa en JWT-token vid framgångsrik inloggning
    const token = jwt.sign(
      {
        email: existingUser[0].email,
        userId: existingUser[0].user_id,
      },
      process.env.JWT_KEY, // Hemlig nyckel för att signera token
      { expiresIn: "1h" } // Tokenens giltighetstid
    );

    // Skicka tillbaka svaret med token
    return res.status(200).json({
      message: "Auth successful",
      token: token,
      user_id: existingUser[0].user_id,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Endpoint för att ta bort en användare
router.delete("/:userId", checkAuth, async (req, res) => {
  const userId = req.params.userId; // Hämta användarens ID från URL-parametern

  try {
    // Kontrollera om användaren existerar
    const existingUser = await userModules.getUserid(userId);

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Radera användaren
    await userModules.deleteUser(userId);

    res.status(200).json({ message: "User has been deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Endpoint för att uppdatera en användares lösenord
router.put("/update/password", checkAuth, async (req, res) => {
  const userId = req.body.user_id;
  const newPassword = req.body.new_password;
  const oldPassword = req.body.old_password;

  try {
    // Kontrollera om användaren existerar
    const existingUser = await userModules.getUserid(userId);

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verifiera det gamla lösenordet
    const match = await bcrypt.compare(oldPassword, existingUser[0].password);

    if (!match) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }

    // Hasha och uppdatera det nya lösenordet
    const hash = await bcrypt.hash(newPassword, 10);
    await userModules.updatePassword(hash, userId);

    res.status(200).json({ message: "password has been updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Endpoint för att uppdatera användarens information (namn och e-post)
router.put("/update/user", checkAuth, async (req, res) => {
  const userId = req.body.user_id;
  const { name, email } = req.body;

  try {
    // Kontrollera om användaren existerar
    const existingUser = await userModules.getUserid(userId);
    console.log(existingUser, "jghfddsdfgh");
    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    if (existingUser[0].email === email) {
      // Uppdatera användarens namn och e-post
      await userModules.updateUser(userId, name, email);

      return res
        .status(200)
        .json({ message: "information has been updated successfully" });
    }
    // Kontrollera om den nya e-posten redan används
    const existingEmail = await userModules.getUserEmails(email);
    if (existingEmail.length > 0) {
      return res.status(409).json({ message: "Mail exists" });
    }

    await userModules.updateUser(userId, name, email);

    return res
      .status(200)
      .json({ message: "information has been updated successfully" });
  } catch (error) {
    console.error("Error updating information:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Endpoint för att uppdatera användarens saldo
router.put("/update/balance", checkAuth, async (req, res) => {
  const userId = req.body.user_id;
  const amount = req.body.amount;

  try {
    // Kontrollera om användaren existerar
    // Först, kolla om användaren finns genom att hämta användaren med user_id
    const existingUser = await userModules.getUserid(userId);

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Uppdatera användarens saldo
    await userModules.updateBalance(userId, amount);

    res.status(200).json({ message: "Balance has been updated successfully" });
  } catch (error) {
    console.error("Error updating Balance:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/deduct/balance", checkAuth, async (req, res) => {
  const userId = req.body.user_id; // User ID
  const amount = req.body.amount; // Amount to deduct

  if (!userId || !amount) {
    return res.status(400).json({ message: "User ID and amount are required" });
  }

  try {
    // Kontrollera om användaren existerar
    const existingUser = await userModules.getUserid(userId);

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Uppdatera användarens saldo
    await userModules.deductBalance(userId, amount);

    res.status(200).json({
      message: "Balance has been deducted successfully",
    });
  } catch (error) {
    console.error("Error deducting balance:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;