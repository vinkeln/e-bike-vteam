const mysql = require("mysql2/promise");
const config = require("../../config/db/elsparkcykel.json");

async function getUserEmails(mail) {
    let db = await mysql.createConnection(config);
    let sql= `SELECT * FROM user WHERE email = ?;`;

    let [result] = await db.query(sql, [mail]);
    await db.end();
    return result;
}


async function getUserid(userId) {
    let db = await mysql.createConnection(config);
    let sql= `SELECT user_id,password,name,email,role FROM user WHERE user_id = ?;`;

    let [result] = await db.query(sql, [userId]);
    await db.end();
    return result;
}



async function createUser(name,mail,hash,role) {
    let db = await mysql.createConnection(config);
    let sql= `INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?);`;

    await db.query(sql, [name, mail, hash, role]);
    await db.end();
}

async function getUsers() {
    let db = await mysql.createConnection(config);
    let sql= `SELECT user_id,name,email,balance FROM user;`;

    let [result] = await db.query(sql);
    await db.end();
    return result;
}



async function deleteUser(userId) {
    let db = await mysql.createConnection(config);
    let sql= `DELETE FROM user WHERE user_id = ?;`;

    await db.query(sql, [userId]);
    await db.end();
}

async function updatePassword(hashPassword,userId) {
    let db = await mysql.createConnection(config);
    let sql= `UPDATE user SET password = ? WHERE user_id = ?;`;

    await db.query(sql, [hashPassword,userId]);
    await db.end();
}


async function updateUser(userId,name,email) {
    let db = await mysql.createConnection(config);
    let sql= `
    UPDATE user
    SET
    name = ?,
    email = ? 
    WHERE
    user_id = ?
    ;`;

    await db.query(sql, [name,email,userId]);
    await db.end();
}

async function updateBalance(userId, balance) {
    let db;
    try {
        db = await mysql.createConnection(config); // Skapa anslutning till databasen
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
