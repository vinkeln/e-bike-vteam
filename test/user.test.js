const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
require('dotenv').config(); // Läs in .env-filen
chai.use(chaiHttp);

describe('User API', () => {
  let server;

  // Start servern innan testerna körs
  before((done) => {
    server = app.listen(0, () => {
      const port = server.address().port; 
      chai.request(`http://localhost:${port}`);
      done();
    });
  });
  

  // Stäng servern efter att testerna är klara
  after((done) => {
    server.close(() => {
      done();
    });
  });

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
  });