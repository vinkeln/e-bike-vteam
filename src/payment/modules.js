const mysql = require("mysql2/promise"); // Importerar MySQL2 med stöd för promises.
const config = require("../../config/db/elsparkcykel.json"); // Importerar databasens konfigurationsfil.

// Funktion för att hämta alla betalningar
async function getPayments() {

    let db = await mysql.createConnection(config);
    try {
        let sql = `SELECT * FROM payment;`;
        let [result] = await db.query(sql); // Parametriserad fråga utan externa indata
        return result;
    } catch (error) {
        console.error("Error in getPayments:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}

// Funktion för att hämta resan detaljer med ride id
async function getPaymentById(paymentId) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `SELECT * FROM payment WHERE payment_id = ?;`;
        let [result] = await db.query(sql, [paymentId]); // Parametriserad fråga
        return result[0];
    } catch (error) {
        console.error("Error in getPaymentById:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}

// Funktion för att skapa en ny betalning
async function createPayment(userId, amount, paymentType, status) {

    let db = await mysql.createConnection(config);
    try {
        console.log("from async",userId)
        const sql = `INSERT INTO payment (user_id, amount, payment_type, status) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(sql, [userId, amount, paymentType, status]); // Parametrized query
        const paymentId = result.insertId; // Get the inserted payment_id
        return paymentId;
    } catch (error) {
        console.error("Error in createPayment:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}

// Funktion för att uppdatera betalning
async function updatePayment(paymentId, amount, status) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `
            UPDATE payment 
            SET 
            amount = ?,
            status = ?
            WHERE payment_id = ?;
        `;
        await db.query(sql, [ amount, status, paymentId]); // Parametriserad fråga
    } catch (error) {
        console.error("Error in updatePayment:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}

// Funktion för att ta bort en betalning
async function deletePayment(paymentId) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `DELETE FROM payment WHERE payment_id = ?;`;
        await db.query(sql, [paymentId]); // Parametriserad fråga
    } catch (error) {
        console.error("Error in deletePayment:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}

// Funktion för att hämta resan detaljer med ride id
async function getPaymentsByUserId(userId) {

    let db = await mysql.createConnection(config);
    try {
        let sql = `SELECT * FROM payment WHERE user_id = ?;`;
        let [result] = await db.query(sql, [userId]); // Parametriserad fråga
        return result;
    } catch (error) {
        console.error("Error in getByuserId:", error.message);
        throw error;
    } finally {
        if (db) await db.end();
    }
}


module.exports = {
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
    getPaymentsByUserId
};