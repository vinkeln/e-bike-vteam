const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
chai.use(chaiHttp);
const request = require("supertest");
const jwtToken = "secret";


describe("Payment API", () => {
    let server;

    const apiKey = "key123";

      before((done) => {
        server = app.listen(0, () => {
            done();
        });
    });
    
  

  after((done) => {
    server.close(() => {
      done();
    });
  });

    it("GET /v1/payment should return all payments",(done) => {
        chai.request(server)
        .get('/v1/payment?api_key=key123')
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          done();
        });    
    });

    it("GET /v1/payment should return all payments", async () => {
        const res = await request(server)
            .get("/v1/payment")
            .set("Authorization", jwtToken) 
            .query({ api_key: apiKey });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("payments");
    });

    it("POST /v1/payment should create a new payment", async () => {
        const res = await request(app)
            .post("/v1/payment")
            .send({
                api_key: apiKey,
                user_id: 1,
                amount: 100,
                payment_type: "card",
                status: "completed"
            });
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("message", "Payment created");
    });

    it("PUT /v1/payment/:paymentId should update a payment", async () => {
        const res = await request(app)
            .put("/v1/payment/1")
            .send({
                api_key: apiKey,
                amount: 150,
                status: "refunded"
            });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message", "Payment updated successfully");
    });

    it("DELETE /v1/payment/:paymentId should delete a payment", async () => {
        const res = await request(app)
            .delete("/v1/payment/1")
            .query({ api_key: apiKey });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message", "Payment deleted successfully");
    });

    it("GET /v1/payment/user/:userId should return all payments for a user", async () => {
        const res = await request(app)
            .get("/v1/payment/user/1")
            .query({ api_key: apiKey });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("payments");
    });
});
