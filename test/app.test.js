const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
chai.use(chaiHttp);

describe('API Tests', () => {
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

  it('GET /v1/cities should return all cities', (done) => {
    chai.request(server)
      .get('/v1/cities?api_key=key123')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });

  it('GET /v1/parking should return all parking zones', (done) => {
    chai.request(server)
      .get('/v1/parking?api_key=key123')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an('object');
        chai.expect(res.body.parkings_zones).to.be.an('array');
        done();
      });
  });
});
