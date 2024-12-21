INSERT INTO scooter (current_location_id, battery_level, status, speed, last_service_date)
VALUES 
    (1, 85, 'ledig', 25.5, '2024-04-25'),
    (2, 60, 'upptagen', 15.3, '2024-04-20'),
    (3, 90, 'underhåll', 0, '2024-03-30');

INSERT INTO location (location_id, location_name, latitude, longitude, type, city_id)
VALUES
    (1, 'Central Park', 40.785091, -73.968285, 'parkeringszon', 1),
    (2, 'Downtown', 40.712776, -74.005974, 'laddstation', 2),
    (3, 'Uptown', 40.798213, -73.951217, 'resa', 3);

INSERT INTO city (city_id, name, country)
VALUES
    (1, 'New York', 'USA'),
    (2, 'Los Angeles', 'USA'),
    (3, 'San Francisco', 'USA');
