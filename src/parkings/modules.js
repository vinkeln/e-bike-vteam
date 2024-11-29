const mysql = require("mysql2/promise");
const config = require("../../config/db/elsparkcykel.json");

async function getParkings() {
    let db = await mysql.createConnection(config);
    let sql= `
        SELECT 
            p.zone_id,
            p.location_id,
            p.max_speed,
            p.capacity,
            l.latitude,
            l.longitude,
            l.type
        FROM 
            parkingzone p
        INNER JOIN 
            location l 
        ON 
            p.location_id = l.location_id;`;

    let [result] = await db.query(sql,);
    await db.end();
    return result;
}

async function addPark(latitude,longitude,maxSpeed,capacity) {
    let db = await mysql.createConnection(config);

    try {
        // Starta en transaktion
        await db.beginTransaction();

        // Infoga platsen och hämta `insertId` direkt
        const [locationResult] = await db.query(
            "INSERT INTO location (latitude, longitude, type) VALUES (?, ?, 'parkeringszon')",
            [latitude, longitude]
        );
        const locationId = locationResult.insertId;

        // Infoga parkeringszonen
        await db.query(
            "INSERT INTO parkingzone (location_id, max_speed, capacity) VALUES (?, ?, ?)",
            [locationId, maxSpeed, capacity]
        );

        // Bekräfta transaktionen
        await db.commit();

        return {
            success: true,
            locationId: locationId,
            message: "Parking zone added successfully.",
        };
    } catch (error) {
        // Återställ transaktionen vid fel
        await db.rollback();
        return {
            success: false,
            error: error.message,
        };
    } finally {
        // Stäng anslutningen
        await db.end();
    }

    
    
}


async function getParkingLocation(locationId) {
    let db = await mysql.createConnection(config);
    let sql= `SELECT * FROM parkingzone WHERE location_id = ?;`;

    let [result] = await db.query(sql, [locationId]);
    await db.end();
    return result;
}

async function deletePark(locationId) {
    let db = await mysql.createConnection(config);
    let sql= `
    START TRANSACTION;
    DELETE
        FROM parkingzone 
    WHERE
        location_id = ?
    ;

    DELETE
        FROM location 
    WHERE
        location_id = ?
    ;
    COMMIT;
    
    `
    ;

    await db.query(sql, [locationId, locationId]);
    await db.end();
}

async function checkParkings(latitude, longitude) {
    let db = await mysql.createConnection(config);
    let sql= `
    SELECT *
        FROM location 
    WHERE
        latitude = ?
    AND
        longitude = ?
    ;`
    ;

    let [result] = await db.query(sql, [latitude, longitude]);
    await db.end();
    return result;
}


async function updatePark(locationId,latitude, longitude, capacity,maxSpeed) {
    let db = await mysql.createConnection(config);
    let sql= `
    START TRANSACTION;
    UPDATE parkingzone
    SET 
    capacity = ?,
    max_speed = ?
    WHERE
        location_id = ?
    ;

    UPDATE location
    SET 
    latitude = ?,
    longitude = ?
    WHERE
        location_id = ?
    ;
    COMMIT;
    
    `
    ;

    await db.query(sql, [capacity, maxSpeed,locationId,latitude,longitude,locationId]);
    await db.end();
}


module.exports = {
    getParkings,
    addPark,
    getParkingLocation,
    deletePark,
    checkParkings,
    updatePark
};
