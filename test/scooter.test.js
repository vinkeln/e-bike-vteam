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

// Dummy data för scooters
let scooters = [
    { id: 1, bike_serial_number: "ABC123", current_location_id: 1, battery_level: 90, last_service_date: "2023-01-01" },
    { id: 2, bike_serial_number: "DEF456", current_location_id: 2, battery_level: 80, last_service_date: "2023-02-01" },
];

testApp.get("/v1/scooters", (req, res) => {
    res.status(200).json({
        Message: "Success",
        bikes: scooters,
    });
});

testApp.get("/v1/scooters/:bikeId", (req, res) => {
    const bikeId = parseInt(req.params.bikeId);
    const scooter = scooters.find((s) => s.id === bikeId);

    if (!scooter) {
        return res.status(404).json({ message: "Scooter not found" });
    }

    res.status(200).json(scooter);
});

// Server setup
before((done) => {
    server = http.createServer(testApp);
    server.listen(0, "127.0.0.1", () => {
        port = server.address().port;
        console.log(`Test server is running on port ${port}`);
        done();
    });
});

after((done) => {
    server.close(() => {
        console.log("Test server closed");
        done();
    });
});

// Test suite
describe("Scooter API", () => {
    describe("GET /v1/scooters", () => {
        it("should return a list of all scooters", (done) => {
            chai.request(`http://127.0.0.1:${port}`)
                .get("/v1/scooters")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("bikes").with.lengthOf(2);
                    done();
                });
        });
    });

    describe("GET /v1/scooters/:bikeId", () => {
        it("should return a specific scooter", (done) => {
            chai.request(`http://127.0.0.1:${port}`)
                .get("/v1/scooters/1")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("bike_serial_number").eql("ABC123");
                    done();
                });
        });

        it("should return 404 if the scooter is not found", (done) => {
            chai.request(`http://127.0.0.1:${port}`)
                .get("/v1/scooters/999")
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property("message").eql("Scooter not found");
                    done();
                });
        });
    });
});
