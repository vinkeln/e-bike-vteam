const mysql = require("mysql2/promise");
const config = require("../../config/db/elsparkcykel.json");

// Funktion för att hämta användarens e-post
async function getUserEmails(mail) {
    let db = await mysql.createConnection(config); // Skapa anslutning
    try {
        let sql = `SELECT * FROM user WHERE email = ?;`;
        let [result] = await db.query(sql, [mail]); // Parametriserad fråga
        return result;
    } catch (error) {
        console.error("Error in getUserEmails:", error.message);
        throw error; // Skickar vidare felet
    } finally {
        if (db) await db.end(); // Stänger anslutningen
    }
}

// Funktion för att hämta användarens detaljer med användar-ID
async function getUserid(userId) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `SELECT user_id, password, name, email, role FROM user WHERE user_id = ?;`;
        let [result] = await db.query(sql, [userId]); // Parametriserad fråga
        return result;
    } catch (error) {
        console.error("Error in getUserid:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}


// Funktion för att skapa en ny användare
async function createUser(name,mail,hash,role) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?);`;
        await db.query(sql, [name, mail, hash, role]); // Parametriserad fråga
    } catch (error) {
        console.error("Error in createUser:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}

// Funktion för att hämta alla användare
async function getUsers() {

    let db = await mysql.createConnection(config);
    try {
        let sql = `SELECT user_id, name, email,role,balance FROM user;`;
        let [result] = await db.query(sql); // Parametriserad fråga utan externa indata
        return result;
    } catch (error) {
        console.error("Error in getUsers:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}


// Funktion för att ta bort en användare
async function deleteUser(userId) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `DELETE FROM user WHERE user_id = ?;`;
        await db.query(sql, [userId]); // Parametriserad fråga
    } catch (error) {
        console.error("Error in deleteUser:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}

// Funktion för att uppdatera användarens lösenord
async function updatePassword(hashPassword, userId) {
    let db = await mysql.createConnection(config);
    try {
        let sql = `UPDATE user SET password = ? WHERE user_id = ?;`;
        await db.query(sql, [hashPassword, userId]); // Parametriserad fråga
    } catch (error) {
        console.error("Error in updatePassword:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}

// Funktion för att uppdatera användardetaljer
async function updateUser(userId,name,email) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `
            UPDATE user
            SET
                name = ?,
                email = ?
            WHERE
                user_id = ?;
        `;
        await db.query(sql, [name, email, userId]); // Parametriserad fråga
    } catch (error) {
        console.error("Error in updateUser:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}

// Funktion för att uppdatera användarens saldo
async function updateBalance(userId, balance) {
    let db = await mysql.createConnection(config); // Skapa anslutning till databasen
    try {
        let sql = `
            UPDATE user
            SET balance = balance + ?
            WHERE user_id = ?;
        `;
        
        // Kör SQL-frågan med parametrar
        await db.execute(sql, [balance, userId]);
    } catch (error) {
        console.error("Error updating balance:", error);
        throw error; // Rethrow för att hantera felet högre upp i kedjan
    } finally {
        if (db) {
            await db.end(); // Stäng anslutningen
        }
    }
}


module.exports = {
     getUserEmails,
     createUser,
     getUsers,
     getUserid,
     deleteUser,
     updatePassword,
     updateUser,
     updateBalance
};
