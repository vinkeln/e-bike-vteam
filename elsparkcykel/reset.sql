source setup.sql;

-- Ta bort tabeller om de redan finns
DROP TABLE IF EXISTS chargingstation;
DROP TABLE IF EXISTS parkingzone;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS scooter;
DROP TABLE IF EXISTS ride;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS city;
DROP TABLE IF EXISTS location;

source ddl.sql;
source ssl.sql;