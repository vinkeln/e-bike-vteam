CREATE DATABASE IF NOT EXISTS elsparkcykel;
USE elsparkcykel;

-- Tabell: city
CREATE TABLE `city` (
  `city_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabell: location
CREATE TABLE `location` (
  `location_id` INT NOT NULL AUTO_INCREMENT,
  `latitude` DECIMAL(10,8) NOT NULL,
  `longitude` DECIMAL(11,8) NOT NULL,
  `type` ENUM('laddstation', 'parkeringszon', 'resa') NOT NULL,
  `city_id` INT DEFAULT NULL,
  PRIMARY KEY (`location_id`),
  FOREIGN KEY (`city_id`) REFERENCES `city` (`city_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabell: user
CREATE TABLE `user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `balance` DECIMAL(10,2) DEFAULT 0.00,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `created_at` TIMESTAMP NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabell: chargingstation
CREATE TABLE `chargingstation` (
  `station_id` INT NOT NULL AUTO_INCREMENT,
  `location_id` INT NOT NULL,
  `total_ports` INT NOT NULL,
  `available_ports` INT NOT NULL,
  PRIMARY KEY (`station_id`),
  FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabell: parkingzone
CREATE TABLE `parkingzone` (
  `zone_id` INT NOT NULL AUTO_INCREMENT,
  `location_id` INT NOT NULL,
  `max_speed` INT DEFAULT NULL,
  `capacity` INT DEFAULT NULL,
  PRIMARY KEY (`zone_id`),
  FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabell: scooter
CREATE TABLE `scooter` (
  `scooter_id` INT NOT NULL AUTO_INCREMENT,
  `current_location_id` INT DEFAULT NULL,
  `battery_level` INT NOT NULL,
  `speed` DECIMAL(5,2) DEFAULT NULL,
  `status` ENUM('ledig', 'upptagen', 'underhåll') DEFAULT 'ledig',
  `last_service_date` DATE DEFAULT NULL,
  PRIMARY KEY (`scooter_id`),
  FOREIGN KEY (`current_location_id`) REFERENCES `location` (`location_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabell: warnings
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
