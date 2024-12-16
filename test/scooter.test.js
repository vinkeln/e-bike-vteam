const request = require("supertest");
const app = require("../app");
const chai = require("chai");
const expect = chai.expect;

describe("Scooter API", () => {
    const apiKey = "key123";

    // Hämta alla scooters
    it("GET /v1/bikes should return all scooters", async () => {
        const res = await request(app)
            .get("/v1/bikes")
            .query({ api_key: apiKey });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("bikes");
    });

    // Hämta en specifik scooter
    it("GET /v1/bikes/:bikeId should return scooter details", async () => {
        const res = await request(app)
            .get("/v1/bikes/1")
            .query({ api_key: apiKey });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("scooter_id", 1);
    });

    // Lägg till en ny scooter
    it("POST /v1/bikes should add a new scooter", async () => {
        const res = await request(app)
            .post("/v1/bikes")
            .send({
                api_key: apiKey, 
                current_location_id: 1,
                battery_level: 80,
                last_service_date: "2024-12-10",
                current_longitude: 18.0686,
                current_latitude: 59.3293,
            });
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("message", "Scooter added");
    });

    // Uppdatera en scooter
    it("PUT /v1/bikes should update a scooter", async () => {
        const res = await request(app)
            .put("/v1/bikes")
            .send({
                api_key: apiKey,
                scooter_id: 1,
                current_location_id: 2,
                battery_level: 90,
                status: "active",
                last_service_date: "2024-12-15",
            });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message", "Scooter updated");
    });

    // Ta bort en scooter
    it("DELETE /v1/bikes/:bikeId should delete a scooter", async () => {
        const res = await request(app)
            .delete("/v1/bikes/1")
            .query({ api_key: apiKey });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message", "Scooter deleted successfully");
    });

    // Uppdatera status för en scooter
    it("PUT /v1/bikes/status/:bikeId should update scooter status", async () => {
        const res = await request(app)
            .put("/v1/bikes/status/1")
            .send({
                api_key: apiKey,
                status: "inactive",
            });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message", "Scooter updated");
    });
});
