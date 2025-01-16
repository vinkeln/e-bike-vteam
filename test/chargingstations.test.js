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

// Dummy data för laddstationer
let chargingStations = [
    { id: 1, city_id: 1, latitude: 59.3293, longitude: 18.0686, total_ports: 10 },
    { id: 2, city_id: 2, latitude: 59.9139, longitude: 10.7522, total_ports: 5 },
];

// Testserver Endpoints
testApp.get("/v1/chargingstations", (req, res) => {
    res.status(200).json({
        status: "success",
        chargingStations,
    });
});

testApp.get("/v1/chargingstations/:cityId", (req, res) => {
    const cityId = parseInt(req.params.cityId);
    const stations = chargingStations.filter((cs) => cs.city_id === cityId);

    if (stations.length === 0) {
        return res.status(409).json({ message: "city has no charging stations" });
    }

    res.status(200).json({
        status: "success",
        chargingStations: stations,
    });
});

testApp.post("/v1/chargingstations/add", (req, res) => {
    const { latitude, longitude, total_ports, city_id } = req.body;
    const existingStation = chargingStations.find(
        (cs) => cs.latitude === latitude && cs.longitude === longitude
    );

    if (existingStation) {
        return res.status(409).json({ message: "Chargingstation exists" });
    }

    const newStation = {
        id: chargingStations.length + 1,
        latitude,
        longitude,
        total_ports,
        city_id,
    };

    chargingStations.push(newStation);
    res.status(200).json({
        status: "success",
        message: "chargingstation has been added",
        location_id: newStation.id,
    });
});

testApp.delete("/v1/chargingstations/:locationId", (req, res) => {
    const locationId = parseInt(req.params.locationId);
    const index = chargingStations.findIndex((cs) => cs.id === locationId);

    if (index === -1) {
        return res.status(404).json({ message: "Charging station not found" });
    }

    chargingStations.splice(index, 1);
    res.status(200).json({ message: "Charging station deleted successfully" });
});

testApp.put("/v1/chargingstations/update", (req, res) => {
    const { location_id, latitude, longitude, total_ports } = req.body;
    const station = chargingStations.find((cs) => cs.id === location_id);

    if (!station) {
        return res.status(404).json({ message: "Charging station not found" });
    }

    station.latitude = latitude || station.latitude;
    station.longitude = longitude || station.longitude;
    station.total_ports = total_ports || station.total_ports;

    res.status(200).json({ message: "Charging station updated successfully" });
});

testApp.put("/v1/chargingstations/update/port", (req, res) => {
    const { location_id, new_ports } = req.body;
    const station = chargingStations.find((cs) => cs.id === location_id);

    if (!station) {
        return res.status(404).json({ message: "Charging station not found" });
    }

    station.total_ports += new_ports;
    res.status(200).json({ message: "Charging station port updated successfully" });
});

// Start och Stäng Testservern
before(function (done) {
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

// Testfall
describe("Charging Stations API", function () {
    describe("GET /v1/chargingstations", function () {
        it("should return all charging stations", (done) => {
            chai.request(`http://localhost:${port}`)
                .get("/v1/chargingstations")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("chargingStations").with.lengthOf(2);
                    done();
                });
        });
    });

    describe("GET /v1/chargingstations/:cityId", function () {
        it("should return charging stations for a city", (done) => {
            chai.request(`http://localhost:${port}`)
                .get("/v1/chargingstations/1")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("chargingStations").with.lengthOf(1);
                    done();
                });
        });

        it("should return 409 if city has no charging stations", (done) => {
            chai.request(`http://localhost:${port}`)
                .get("/v1/chargingstations/999")
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.have.property("message").eql("city has no charging stations");
                    done();
                });
        });
    });

    describe("POST /v1/chargingstations/add", function () {
        it("should add a new charging station", (done) => {
            chai.request(`http://localhost:${port}`)
                .post("/v1/chargingstations/add")
                .send({ latitude: 59.8586, longitude: 17.6389, total_ports: 15, city_id: 1 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("chargingstation has been added");
                    done();
                });
        });

        it("should return 409 if charging station exists", (done) => {
            chai.request(`http://localhost:${port}`)
                .post("/v1/chargingstations/add")
                .send({ latitude: 59.3293, longitude: 18.0686, total_ports: 10, city_id: 1 })
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.have.property("message").eql("Chargingstation exists");
                    done();
                });
        });
    });

    describe("DELETE /v1/chargingstations/:locationId", function () {
        it("should delete a charging station", (done) => {
            chai.request(`http://localhost:${port}`)
                .delete("/v1/chargingstations/1")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("Charging station deleted successfully");
                    done();
                });
        });

        it("should return 404 if charging station does not exist", (done) => {
            chai.request(`http://localhost:${port}`)
                .delete("/v1/chargingstations/999")
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property("message").eql("Charging station not found");
                    done();
                });
        });
    });

    describe("PUT /v1/chargingstations/update", function () {
        it("should update a charging station", (done) => {
            chai.request(`http://localhost:${port}`)
                .put("/v1/chargingstations/update")
                .send({ location_id: 2, latitude: 59.9138, total_ports: 20 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("Charging station updated successfully");
                    done();
                });
        });

        it("should return 404 if charging station does not exist", (done) => {
            chai.request(`http://localhost:${port}`)
                .put("/v1/chargingstations/update")
                .send({ location_id: 999, latitude: 59.8586 })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property("message").eql("Charging station not found");
                    done();
                });
        });
    });

    describe("PUT /v1/chargingstations/update/port", function () {
        it("should update ports for a charging station", (done) => {
            chai.request(`http://localhost:${port}`)
                .put("/v1/chargingstations/update/port")
                .send({ location_id: 2, new_ports: 5 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("Charging station port updated successfully");
                    done();
                });
        });

        it("should return 404 if charging station does not exist", (done) => {
            chai.request(`http://localhost:${port}`)
                .put("/v1/chargingstations/update/port")
                .send({ location_id: 999, new_ports: 5 })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property("message").eql("Charging station not found");
                    done();
                });
        });
    });
});