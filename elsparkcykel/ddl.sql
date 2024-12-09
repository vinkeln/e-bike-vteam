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

-- Tabell payment
CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NULL DEFAULT current_timestamp(),
  `payment_type` enum('prepaid', 'prenumeration') NOT NULL,
  `status` enum('genomförd', 'misslyckad') DEFAULT 'genomförd',
  PRIMARY KEY (`payment_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
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

-- Tabell ride
CREATE TABLE `ride` (
  `ride_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `scooter_id` int(11) NOT NULL,
  `start_location_id` int(11) NOT NULL,
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
