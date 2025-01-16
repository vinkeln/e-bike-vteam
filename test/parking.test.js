const chai = require("chai");
const chaiHttp = require("chai-http");
const http = require("http");
const express = require("express");

chai.use(chaiHttp);
chai.should();

const testApp = express();
testApp.use(express.json());
let server;
let port;

// Dummy data för parkeringszoner
let parkings = [
    { id: 1, city_id: 1, latitude: 59.3293, longitude: 18.0686, capacity: 10, max_speed: 50 },
    { id: 2, city_id: 2, latitude: 59.9139, longitude: 10.7522, capacity: 20, max_speed: 60 },
];

testApp.get("/v1/parkings", (req, res) => {
    res.status(200).json({
        parkings_zones: parkings,
    });
});

testApp.get("/v1/parkings/:cityId", (req, res) => {
    const cityId = parseInt(req.params.cityId);
    const cityParkings = parkings.filter((p) => p.city_id === cityId);

    if (cityParkings.length === 0) {
        return res.status(409).json({ message: "city has no parkzones" });
    }

    res.status(200).json({
        status: "success",
        chargingStations: cityParkings,
    });
});

testApp.post("/v1/parkings/add", (req, res) => {
    const { latitude, longitude, capacity, max_speed, city_id } = req.body;

    const existingPark = parkings.find((p) => p.latitude === latitude && p.longitude === longitude);
    if (existingPark) {
        return res.status(409).json({ message: "parkingzone exists" });
    }

    const newPark = {
        id: parkings.length + 1,
        city_id,
        latitude,
        longitude,
        capacity,
        max_speed,
    };

    parkings.push(newPark);
    res.status(200).json({
        message: "parkingzone has been added",
        location_id: newPark.id,
    });
});

testApp.delete("/v1/parkings/:locationId", (req, res) => {
    const locationId = parseInt(req.params.locationId);
    const parkIndex = parkings.findIndex((p) => p.id === locationId);

    if (parkIndex === -1) {
        return res.status(404).json({ message: "parkingzone not found" });
    }

    parkings.splice(parkIndex, 1);
    res.status(200).json({ message: "Parking has been deleted successfully" });
});

testApp.put("/v1/parkings/update", (req, res) => {
    const { location_id, latitude, longitude, capacity, max_speed } = req.body;
    const park = parkings.find((p) => p.id === location_id);

    if (!park) {
        return res.status(404).json({ message: "parkingzone not found" });
    }

    park.latitude = latitude || park.latitude;
    park.longitude = longitude || park.longitude;
    park.capacity = capacity || park.capacity;
    park.max_speed = max_speed || park.max_speed;

    res.status(200).json({ message: "Parking updated successfully" });
});

describe("GET /v1/parkings", function () {
    it("should return a list of all parking zones", (done) => {
        chai.request(`http://localhost:${port}`)
            .get("/v1/parkings")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("parkings_zones").with.lengthOf(2);
                done();
            });
    });
});

describe("GET /v1/parkings/:cityId", function () {
    it("should return parkings for a city", (done) => {
        chai.request(`http://localhost:${port}`)
            .get("/v1/parkings/1")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("chargingStations").with.lengthOf(1);
                done();
            });
    });

    it("should return 409 if city has no parkzones", (done) => {
        chai.request(`http://localhost:${port}`)
            .get("/v1/parkings/999")
            .end((err, res) => {
                res.should.have.status(409);
                res.body.should.have.property("message").eql("city has no parkzones");
                done();
            });
    });
});

describe("POST /v1/parkings/add", function () {
    it("should add a new parking zone", (done) => {
        chai.request(`http://localhost:${port}`)
            .post("/v1/parkings/add")
            .send({ latitude: 59.8586, longitude: 17.6389, city_id: 1, capacity: 15, max_speed: 40 })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eql("parkingzone has been added");
                done();
            });
    });

    it("should return 409 if parking zone exists", (done) => {
        chai.request(`http://localhost:${port}`)
            .post("/v1/parkings/add")
            .send({ latitude: 59.3293, longitude: 18.0686, city_id: 1, capacity: 10, max_speed: 50 })
            .end((err, res) => {
                res.should.have.status(409);
                res.body.should.have.property("message").eql("parkingzone exists");
                done();
            });
    });
});

describe("DELETE /v1/parkings/:locationId", function () {
    it("should delete a parking zone", (done) => {
        chai.request(`http://localhost:${port}`)
            .delete("/v1/parkings/1")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eql("Parking has been deleted successfully");
                done();
            });
    });

    it("should return 404 if parking zone does not exist", (done) => {
        chai.request(`http://localhost:${port}`)
            .delete("/v1/parkings/999")
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property("message").eql("parkingzone not found");
                done();
            });
    });
});

describe("PUT /v1/parkings/update", function () {
    it("should update a parking zone", (done) => {
        chai.request(`http://localhost:${port}`)
            .put("/v1/parkings/update")
            .send({ location_id: 2, latitude: 59.9138, max_speed: 70 })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eql("Parking updated successfully");
                done();
            });
    });

    it("should return 404 if parking zone does not exist", (done) => {
        chai.request(`http://localhost:${port}`)
            .put("/v1/parkings/update")
            .send({ location_id: 999, latitude: 59.8586 })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property("message").eql("parkingzone not found");
                done();
            });
    });
});

before(function (done) {
    this.timeout(10000);
    server = http.createServer(testApp);
    server.listen(0, "localhost", () => {
        port = server.address().port;
        console.log(`Test server is running on port ${port}`);
        done();
    });
});

after(function (done) {
    server.close(() => {
        console.log("Test server closed");
        done();
    });
});
