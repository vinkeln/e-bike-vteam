const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
chai.use(chaiHttp);

describe('API Cities', () => {
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

});
