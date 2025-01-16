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

// Dummy GET /users
testApp.get("/v1/user/users", (req, res) => {
    res.status(200).json({
        message: "ALL users",
        users: [
            { user_id: 1, name: "Test User 1" },
            { user_id: 2, name: "Test User 2" },
        ],
    });
});

// Dummy POST /signup
testApp.post("/v1/user/signup", (req, res) => {
    const { mail } = req.body;

    // Simulera beteende för existerande e-post
    if (mail === "i@gmail.com") {
        return res.status(409).json({ message: "Mail exists" });
    }

    // Simulera lyckad användarskapelse
    res.status(201).json({ message: "User has been created" });
});

let users = [
    { id: 1, name: "Test User 1" },
    { id: 2, name: "Test User 2" },
];

// DELETE /users/:userId
testApp.delete("/v1/user/users/:userId", (req, res) => {
    const userId = parseInt(req.params.userId);

    // Kontrollera om användaren existerar
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    // Ta bort användaren
    users.splice(userIndex, 1);
    res.status(200).json({ message: "User has been deleted" });
});

let passwords = {
    1: "password123", // Användare 1: korrekt lösenord
    2: "oldpassword", // Användare 2: korrekt lösenord
};

// Dummy PUT /update/password
testApp.put("/v1/user/update/password", (req, res) => {
    const { user_id, old_password, new_password } = req.body;

    if (!passwords[user_id]) {
        return res.status(404).json({ message: "User not found" });
    }

    if (passwords[user_id] !== old_password) {
        return res.status(400).json({ message: "Incorrect old password" });
    }

    // Uppdatera lösenord
    passwords[user_id] = new_password;
    res.status(200).json({ message: "Password has been updated" });
});

// Setup server
before(function (done) {
    this.timeout(10000);
    server = http.createServer(testApp);
    server.listen(0, "localhost", () => {
        port = server.address().port;
        done();
    });
});

// Tear down server
after(function (done) {
    server.close(() => {
        console.log("Test server closed");
        done();
    });
});

// Define tests
describe("User API", function () {
    this.timeout(5000);

    describe("GET /users", function () {
        it("should return a list of all users", (done) => {
            chai.request(`http://localhost:${port}`)
                .get("/v1/user/users")
                .end((err, res) => {
                    if (err) return done(err);

                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message").eql("ALL users");
                    res.body.should.have.property("users").with.lengthOf(2);

                    done();
                });
        });
    });

    describe("POST /signup", function () {
        it("should create a new user", (done) => {
            chai.request(`http://localhost:${port}`)
                .post("/v1/user/signup")
                .set("api_key", "key123")
                .send({
                    mail: "test@gmail.com",
                    name: "Test User",
                    password: "password123",
                    role: "user",
                })
                .end((err, res) => {

                    res.should.have.status(201);
                    res.body.should.have.property("message").eql("User has been created");

                    done();
                });
        });

        it("should return 409 if the email already exists", (done) => {
            chai.request(`http://localhost:${port}`)
                .post("/v1/user/signup")
                .set("api_key", "key123")
                .send({
                    mail: "i@gmail.com",
                    name: "Test User",
                    password: "password123",
                    role: "user",
                })
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.have.property("message").eql("Mail exists");

                    done();
                });
        });
    });

    describe("DELETE /users/:userId", function () {
        it("should delete a user", (done) => {
            chai.request(`http://localhost:${port}`)
                .delete("/v1/user/users/1")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("User has been deleted");
                    done();
                });
        });
    
        it("should return 404 if the user does not exist", (done) => {
            chai.request(`http://localhost:${port}`)
                .delete("/v1/user/users/999")
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property("message").eql("User not found");
                    done();
                });
        });
    });
    
    describe("PUT /update/password", function () {
        it("should update the user's password", (done) => {
            chai.request(`http://localhost:${port}`)
                .put("/v1/user/update/password")
                .send({
                    user_id: 1,
                    old_password: "password123",
                    new_password: "newpassword456",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eql("Password has been updated");
    
                    done();
                });
        });
    
        it("should return 400 if the old password is incorrect", (done) => {
            chai.request(`http://localhost:${port}`)
                .put("/v1/user/update/password")
                .send({
                    user_id: 1,
                    old_password: "wrongpassword",
                    new_password: "newpassword456",
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property("message").eql("Incorrect old password");
    
                    done();
                });
        });
    
        it("should return 404 if the user does not exist", (done) => {
            chai.request(`http://localhost:${port}`)
                .put("/v1/user/update/password")
                .send({
                    user_id: 999,
                    old_password: "password123",
                    new_password: "newpassword456",
                })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property("message").eql("User not found");
    
                    done();
                });
        });
    });
    
});
