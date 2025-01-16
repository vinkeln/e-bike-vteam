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

// Dummy data för betalningar
let payments = [
    { id: 1, user_id: 1, amount: 100, payment_type: "credit_card", status: "completed" },
    { id: 2, user_id: 2, amount: 200, payment_type: "paypal", status: "pending" },
    { id: 3, user_id: 3, amount: 300, payment_type: "debit_card", status: "completed" },
];

// Testserverns endpoints
testApp.get("/v1/payments", (req, res) => {
    res.status(200).json({
        status: "success",
        payments: payments,
    });
});

testApp.get("/v1/payments/:paymentId", (req, res) => {
    const paymentId = parseInt(req.params.paymentId);
    const payment = payments.find((p) => p.id === paymentId);

    if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json({
        status: "success",
        payment: payment,
    });
});

testApp.post("/v1/payments", (req, res) => {
    const { user_id, amount, payment_type, status } = req.body;
    if (!user_id || !amount || !payment_type) {
        return res.status(400).json({ error: "All inputs are required!" });
    }

    const newPayment = {
        id: payments.length + 1,
        user_id,
        amount,
        payment_type,
        status: status || "completed",
    };

    payments.push(newPayment);
    res.status(201).json({
        status: "success",
        message: "Payment created",
        paymentId: newPayment.id,
    });
});

testApp.put("/v1/payments/:paymentId", (req, res) => {
    const paymentId = parseInt(req.params.paymentId);
    const { amount, status } = req.body;

    const payment = payments.find((p) => p.id === paymentId);

    if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
    }

    if (!amount && !status) {
        return res
            .status(400)
            .json({ error: "At least one field (amount or status) must be provided for update." });
    }

    payment.amount = amount || payment.amount;
    payment.status = status || payment.status;

    res.status(200).json({
        status: "success",
        message: "Payment updated successfully",
    });
});

testApp.delete("/v1/payments/:paymentId", (req, res) => {
    const paymentId = parseInt(req.params.paymentId);
    const index = payments.findIndex((p) => p.id === paymentId);

    if (index === -1) {
        return res.status(404).json({ error: "Payment not found" });
    }

    payments.splice(index, 1);
    res.status(200).json({ status: "success", message: "Payment deleted successfully" });
});

testApp.get("/v1/payments/user/:userId", (req, res) => {
    const userId = parseInt(req.params.userId);
    const userPayments = payments.filter((p) => p.user_id === userId);

    if (userPayments.length === 0) {
        return res.status(404).json({ error: "No payments found for this user" });
    }

    res.status(200).json({
        status: "success",
        payments: userPayments,
    });
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
describe("Payments API", function () {
    beforeEach(() => {
        // Återställ dummy-data innan varje test
        payments = [
            { id: 1, user_id: 1, amount: 100, payment_type: "credit_card", status: "completed" },
            { id: 2, user_id: 2, amount: 200, payment_type: "paypal", status: "pending" },
            { id: 3, user_id: 3, amount: 300, payment_type: "debit_card", status: "completed" },
        ];
    });

    describe("GET /v1/payments", function () {
        it("should return all payments", (done) => {
            chai.request(`http://localhost:${port}`)
                .get("/v1/payments")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("payments").with.lengthOf(3);
                    done();
                });
        });
    });

    describe("GET /v1/payments/:paymentId", function () {
        it("should return a specific payment", (done) => {
            chai.request(`http://localhost:${port}`)
                .get("/v1/payments/1")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("payment");
                    done();
                });
        });

        it("should return 404 if payment does not exist", (done) => {
            chai.request(`http://localhost:${port}`)
                .get("/v1/payments/999")
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property("error").eql("Payment not found");
                    done();
                });
        });
    });

    describe("POST /v1/payments", function () {
        it("should create a new payment", (done) => {
            chai.request(`http://localhost:${port}`)
                .post("/v1/payments")
                .send({ user_id: 4, amount: 400, payment_type: "bank_transfer" })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property("message").eql("Payment created");
                    done();
                });
        });

        it("should return 400 if required fields are missing", (done) => {
            chai.request(`http://localhost:${port}`)
                .post("/v1/payments")
                .send({ user_id: 4 })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property("error").eql("All inputs are required!");
                    done();
                });
        });
    });

    describe("PUT /v1/payments/:paymentId", function () {
        it("should update a payment", (done) => {
            chai.request(`http://localhost:${port}`)
                .put("/v1/payments/1")
                .send({ amount: 150, status: "pending" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("Payment updated successfully");
                    done();
                });
        });
    });

    describe("DELETE /v1/payments/:paymentId", function () {
        it("should delete a payment", (done) => {
            chai.request(`http://localhost:${port}`)
                .delete("/v1/payments/1")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("Payment deleted successfully");
                    done();
                });
        });
    });

    describe("GET /v1/payments/user/:userId", function () {
        it("should return payments for a specific user", (done) => {
            chai.request(`http://localhost:${port}`)
                .get("/v1/payments/user/1")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("payments").with.lengthOf(1);
                    done();
                });
        });
    });
});