-- Skapa databasen
CREATE DATABASE IF NOT EXISTS elsparkcykel;
USE elsparkcykel;

-- Ta bort tabeller om de redan finns
DROP TABLE IF EXISTS chargingstation;
DROP TABLE IF EXISTS parkingzone;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS scooter;
DROP TABLE IF EXISTS ride;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS city;

-- Tabell: user
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `balance` decimal(10,2) DEFAULT 0.00,
  `role` enum('user', 'admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabell location
CREATE TABLE `location` (
  `location_id` int(11) NOT NULL AUTO_INCREMENT,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `type` enum('laddstation', 'parkeringszon', 'resa','freepark') NOT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabell chargingstation
CREATE TABLE `chargingstation` (
  `station_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_id` int(11) NOT NULL,
  `total_ports` int(11) NOT NULL,
  `available_ports` int(11) NOT NULL,
  PRIMARY KEY (`station_id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `chargingstation_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabell parkingzone
CREATE TABLE `parkingzone` (
  `zone_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_id` int(11) NOT NULL,
  `max_speed` int(11) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  PRIMARY KEY (`zone_id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `parkingzone_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabell payment
CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp DEFAULT current_timestamp(),
  `payment_type` enum('prepaid', 'prenumeration') NOT NULL,
  `status` enum('genomförd', 'misslyckad') DEFAULT 'genomförd',
  PRIMARY KEY (`payment_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabell scooter
CREATE TABLE `scooter` (
  `scooter_id` int(11) NOT NULL AUTO_INCREMENT,
  `current_location_id` int(11) DEFAULT NULL,
  `battery_level` int(11) NOT NULL,
  `status` enum('ledig', 'upptagen', 'underhåll', 'avstänged') DEFAULT 'ledig',
  `speed` DECIMAL(5,2) DEFAULT NULL,
  `last_service_date` date DEFAULT NULL,
  PRIMARY KEY (`scooter_id`),
  KEY `current_location_id` (`current_location_id`),
  CONSTRAINT `scooter_ibfk_1` FOREIGN KEY (`current_location_id`) REFERENCES `location` (`location_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabell ride
CREATE TABLE `ride` (
  `ride_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `scooter_id` int(11) NOT NULL,
  `start_location_id` int(11) DEFAULT NULL,
  `end_location_id` int(11) DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `average_speed` decimal(5,2) DEFAULT NULL,
  `direction` varchar(50) DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ride_id`),
  KEY `user_id` (`user_id`),
  KEY `scooter_id` (`scooter_id`),
  KEY `start_location_id` (`start_location_id`),
  KEY `end_location_id` (`end_location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabell: city
CREATE TABLE `city` (
  `city_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) NOT NULL
);

-- Uppdatera location tabell
ALTER TABLE `location` ADD COLUMN `city_id` INT;

-- Lägg till en foreign key från location till city
ALTER TABLE `location`
ADD CONSTRAINT `fk_location_city`
FOREIGN KEY (`city_id`) REFERENCES `city`(`city_id`)
ON DELETE SET NULL;

ALTER TABLE `scooter`
ADD COLUMN `current_latitude` DOUBLE,
ADD COLUMN `current_longitude` DOUBLE;

ALTER TABLE `scooter`
ADD COLUMN `bike_serial_number` VARCHAR(50) NOT NULL UNIQUE AFTER `scooter_id`;

--Tabell: warnings // NY TABELL
CREATE TABLE `warnings` (
  `warning_id` INT NOT NULL AUTO_INCREMENT,
  `scooter_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `message` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `resolved` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`warning_id`),
  FOREIGN KEY (`scooter_id`) REFERENCES `scooter` (`scooter_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `location` (`location_id`, `latitude`, `longitude`, `type`)
VALUES (0, 0.00000000, 0.00000000, 'freepark');