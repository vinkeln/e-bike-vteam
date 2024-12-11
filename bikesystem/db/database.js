const mysql = require('mysql2/promise');
const dbConfig = require('./dbconfig/dbconfig');

// Handle all database requets.
async function queryDatabase(query, params = []) {
    let db;
    try {
        db = await mysql.createConnection(dbConfig);
        const [result] = await db.query(query, params);
        return result;
    } finally {
        if (db) await db.end();
    }
}

module.exports = {
    queryDatabase
};
