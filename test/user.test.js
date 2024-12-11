let chaiHttp = require('chai-http');
let {server, chai } = require('./setup');
let app = require('../app');
chai.use(chaiHttp);

// Test för users API
  describe('User API', () => {
    it('POST /signup should create a new user', (done) => {
      chai.request(server)
        .post('/signup')
        .send({
          mail: "testuser@example.com",
          name: "Test User",
          password: "TestPassword123",
        })
        .end((err, res) => {
          chai.expect(res).to.have.status(201);
          chai.expect(res.body).to.have.property('message', 'User has been created');
          done();
        });

    });
  
    it('POST /login should log in the user', (done) => {
      chai.request(server)
        .post('/login')
        .send({
          mail: "testuser@example.com",
          password: "TestPassword123",
        })
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.have.property('message', 'Auth successful');
          chai.expect(res.body).to.have.property('token');
          done();
        });
    });
  
    it('GET /users should return all users', (done) => {
      chai.request(server)
        .get('/users')
        .set('Authorization', `Bearer YOUR_VALID_JWT_TOKEN`)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.have.property('message', 'ALL users');
          chai.expect(res.body.users).to.be.an('array');
          done();
        });
    });
  });