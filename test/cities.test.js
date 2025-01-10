const chai = require("chai");
const chaiHttp = require("chai-http");
const http = require("http");
const express = require("express");

chai.use(chaiHttp);
chai.should();

const testApp = express();
testApp.use(express.json()); // För att hantera JSON i body
let server;
let port;

// Dummy data för städer
let cities = [
    { id: 1, name: "Stockholm", country: "Sweden" },
    { id: 2, name: "Oslo", country: "Norway" },
];

// Dummy GET / Endpoint
testApp.get("/v1/cities", (req, res) => {
    res.status(200).json({
        status: "success",
        cities: cities,
    });
});

// Dummy POST /add Endpoint
testApp.post("/v1/cities/add", (req, res) => {
    const { name, country } = req.body;

    // Kontrollera om staden redan existerar
    const existingCity = cities.find((city) => city.name === name);
    if (existingCity) {
        return res.status(409).json({ message: "city exists" });
    }

    const newCity = {
        id: cities.length + 1,
        name,
        country,
    };

    cities.push(newCity);

    res.status(200).json({
        status: "success",
        message: "city has been added",
        location_id: newCity.id,
    });
});

// Dummy DELETE /:cityId Endpoint
testApp.delete("/v1/cities/:cityId", (req, res) => {
    const cityId = parseInt(req.params.cityId);

    const cityIndex = cities.findIndex((city) => city.id === cityId);
    if (cityIndex === -1) {
        return res.status(404).json({ message: "City not found" });
    }

    cities.splice(cityIndex, 1);

    res.status(200).json({ message: "City deleted successfully" });
});

describe("GET /v1/cities", function () {
    it("should return a list of all cities", (done) => {
        chai.request(`http://127.0.0.1:${port}`)
            .get("/v1/cities")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("object");
                res.body.should.have.property("status").eql("success");
                res.body.should.have.property("cities").with.lengthOf(2);

                done();
            });
    });
});

describe("POST /v1/cities/add", function () {
    it("should add a new city", (done) => {
        chai.request(`http://127.0.0.1:${port}`)
            .post("/v1/cities/add")
            .send({ name: "Copenhagen", country: "Denmark" })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eql("city has been added");
                res.body.should.have.property("location_id");

                done();
            });
    });

    it("should return 409 if the city already exists", (done) => {
        chai.request(`http://127.0.0.1:${port}`)
            .post("/v1/cities/add")
            .send({ name: "Stockholm", country: "Sweden" })
            .end((err, res) => {
                res.should.have.status(409);
                res.body.should.have.property("message").eql("city exists");

                done();
            });
    });
});

describe("DELETE /v1/cities/:cityId", function () {
    it("should delete a city", (done) => {
        chai.request(`http://127.0.0.1:${port}`)
            .delete("/v1/cities/1")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eql("City deleted successfully");

                done();
            });
    });

    it("should return 404 if the city does not exist", (done) => {
        chai.request(`http://127.0.0.1:${port}`)
            .delete("/v1/cities/999")
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property("message").eql("City not found");

                done();
            });
    });
});

before(function (done) {
    this.timeout(10000);
    server = http.createServer(testApp);
    server.listen(0, "127.0.0.1", () => {
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
