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

// Dummy data för resor
let travels = [
    { id: 1, user_id: 1, scooter_id: 1, start_location_id: 1, cost: 100, start_time: "2023-01-01T10:00:00Z" },
    { id: 2, user_id: 2, scooter_id: 2, start_location_id: 2, cost: 150, start_time: "2023-01-02T12:00:00Z" },
];

// Testserverns endpoints
testApp.get("/v1/travels", (req, res) => {
    res.status(200).json({
        status: "success",
        travels: travels,
    });
});

testApp.post("/v1/travels", (req, res) => {
    const { user_id, scooter_id, start_location_id, start_time, cost } = req.body;
    if (!user_id || !scooter_id || !start_location_id || !start_time || !cost) {
        return res.status(400).json({ error: "All inputs are needed!" });
    }

    const newTravel = {
        id: travels.length + 1,
        user_id,
        scooter_id,
        start_location_id,
        start_time,
        cost,
    };

    travels.push(newTravel);
    res.status(201).json({ message: "New trip has been added", rideId: newTravel.id });
});

testApp.put("/v1/travels", (req, res) => {
    const { end_time, cost, ride_id, end_location_id } = req.body;
    const travel = travels.find((t) => t.id === ride_id);

    if (!travel) {
        return res.status(409).json({ message: "Travel not found" });
    }

    if (!end_time || !cost || !end_location_id) {
        return res.status(400).json({ error: "All inputs are needed!" });
    }

    travel.end_time = end_time;
    travel.cost = cost;
    travel.end_location_id = end_location_id;

    res.status(200).json({ message: "Trip has been updated!" });
});

testApp.get("/v1/travels/:rideId", (req, res) => {
    const rideId = parseInt(req.params.rideId);
    const travel = travels.find((t) => t.id === rideId);

    if (!travel) {
        return res.status(404).json({ error: "Travel not found" });
    }

    res.status(200).json({
        Status: "Success",
        Ride: travel,
    });
});

testApp.get("/v1/travels/user/:userId", (req, res) => {
    const userId = parseInt(req.params.userId);
    const userTravels = travels.filter((t) => t.user_id === userId);

    if (userTravels.length === 0) {
        return res.status(404).json({ error: "Travel not found" });
    }

    res.status(200).json({
        Status: "Success",
        Ride: userTravels,
    });
});

testApp.delete("/v1/travels/:rideId", (req, res) => {
    const rideId = parseInt(req.params.rideId);
    const index = travels.findIndex((t) => t.id === rideId);

    if (index === -1) {
        return res.status(404).json({ message: "Travel not found" });
    }

    travels.splice(index, 1);
    res.status(200).json({ message: "Ride deleted successfully" });
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
describe("Travels API", function () {
    describe("GET /v1/travels", function () {
        it("should return all travels", (done) => {
            chai.request(`http://localhost:${port}`)
                .get("/v1/travels")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("travels").with.lengthOf(2);
                    done();
                });
        });
    });

    describe("POST /v1/travels", function () {
        it("should add a new travel", (done) => {
            chai.request(`http://localhost:${port}`)
                .post("/v1/travels")
                .send({ user_id: 3, scooter_id: 3, start_location_id: 3, start_time: "2023-01-03T14:00:00Z", cost: 200 })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property("message").eql("New trip has been added");
                    done();
                });
        });
    });

    describe("PUT /v1/travels", function () {
        it("should update a travel", (done) => {
            chai.request(`http://localhost:${port}`)
                .put("/v1/travels")
                .send({ ride_id: 1, end_time: "2023-01-01T11:00:00Z", cost: 120, end_location_id: 2 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("Trip has been updated!");
                    done();
                });
        });
    });

    describe("GET /v1/travels/:rideId", function () {
        it("should return a specific travel", (done) => {
            chai.request(`http://localhost:${port}`)
                .get("/v1/travels/1")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("Ride");
                    done();
                });
        });
    });

    describe("GET /v1/travels/user/:userId", function () {
        it("should return travels for a specific user", (done) => {
            chai.request(`http://localhost:${port}`)
                .get("/v1/travels/user/1")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("Ride").with.lengthOf(1);
                    done();
                });
        });
    });

    describe("DELETE /v1/travels/:rideId", function () {
        it("should delete a travel", (done) => {
            chai.request(`http://localhost:${port}`)
                .delete("/v1/travels/1")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("Ride deleted successfully");
                    done();
                });
        });
    });
});
