USE elsparkcykel;



DELIMITER //

CREATE FUNCTION CalculateDistance(
    lat1 DOUBLE, lon1 DOUBLE,
    lat2 DOUBLE, lon2 DOUBLE
) RETURNS DOUBLE
DETERMINISTIC
BEGIN
    DECLARE earth_radius_km DOUBLE DEFAULT 6371; -- Jordens radie i km
    DECLARE delta_lat DOUBLE;
    DECLARE delta_lon DOUBLE;
    DECLARE a DOUBLE;
    DECLARE c DOUBLE;

    SET delta_lat = RADIANS(lat2 - lat1);
    SET delta_lon = RADIANS(lon2 - lon1);
    SET a = SIN(delta_lat / 2) * SIN(delta_lat / 2) +
            COS(RADIANS(lat1)) * COS(RADIANS(lat2)) *
            SIN(delta_lon / 2) * SIN(delta_lon / 2);
    SET c = 2 * ATAN2(SQRT(a), SQRT(1 - a));
    RETURN earth_radius_km * c * 1000; -- Returnera distansen i meter
END //

DELIMITER ;



DELIMITER //

CREATE PROCEDURE CheckRideEndWithinZone(
    IN ride_id INT,
    OUT is_within_zone BOOLEAN
)
BEGIN
    DECLARE scooter_lat DOUBLE;
    DECLARE scooter_lon DOUBLE;
    DECLARE closest_location_id INT;
    DECLARE closest_location_type ENUM('laddstation', 'parkeringszon');
    DECLARE min_distance DOUBLE DEFAULT 100000; -- Startvärde för minsta distans (100 km)
    DECLARE current_distance DOUBLE;

    -- Hämta scooterns slutkoordinater
    SELECT latitude, longitude INTO scooter_lat, scooter_lon
    FROM location
    WHERE location_id = (SELECT end_location_id FROM ride WHERE ride_id = ride_id);

    -- Sök efter närmaste parkeringszon eller laddstation
    SELECT location_id, type,
           CalculateDistance(scooter_lat, scooter_lon, latitude, longitude) AS distance
    INTO closest_location_id, closest_location_type, current_distance
    FROM location
    WHERE type IN ('laddstation', 'parkeringszon')
    ORDER BY distance ASC
    LIMIT 1;

    -- Kontrollera om scootern är inom radien för den närmaste platsen
    IF (closest_location_type = 'laddstation' AND current_distance <= 20) OR
       (closest_location_type = 'parkeringszon' AND current_distance <= 10) THEN
        SET is_within_zone = TRUE;

        -- Uppdatera scooterns plats
        UPDATE scooter
        SET current_location_id = closest_location_id, status = 'ledig'
        WHERE scooter_id = (SELECT scooter_id FROM ride WHERE ride_id = ride_id);
    ELSE
        SET is_within_zone = FALSE;
    END IF;

    -- Avsluta resan som tidigare
    UPDATE ride
    SET end_time = NOW(), cost = (TIMESTAMPDIFF(MINUTE, start_time, NOW()) * 1.5)
    WHERE ride_id = ride_id;
END //

DELIMITER ;
