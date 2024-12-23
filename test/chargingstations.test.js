const chai = require('chai'); //Assertion library
const chaiHttp = require('chai-http'); //HTTP förfrågningar
const app = require('../app');
require('dotenv').config(); // Ladda miljövariabler
chai.use(chaiHttp); // Använd HTTP förfrågningar

// Definiera testerna
describe('Charging Stations API', () => {
  let server;
  let port;

  // Start servern innan testerna körs
  before((done) => {
    server = app.listen(0, () => {
      port = server.address().port;
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
//Hämta alla laddstationer
  it('GET /v1/chargingstations should return all charging stations', (done) => {
    chai.request(server)
      .get('/v1/chargingstations')
      .query({ api_key: process.env.API_KEY }) // Använd process.env.API_KEY
      .end((err, res) => {
        if (err) return done(err); // Hantera eventuella fel
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('status', 'success');
        chai.expect(res.body.chargingStations).to.be.an('array');
        done();
      });
  });
//Hämta laddstationer för en specifik stad
  it('GET /v1/chargingstations/:cityId should return charging stations for a specific city', (done) => {
    const cityId = 1; // Använd ett giltigt cityId
    chai.request(server)
      .get(`/v1/chargingstations/${cityId}`)
      .query({ api_key: process.env.API_KEY }) // Använd process.env.API_KEY
      .end((err, res) => {
        if (err) return done(err); // Hantera eventuella fel
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('status', 'success');
        chai.expect(res.body.chargingStations).to.be.an('array');
        done();
      });
  });
//Lägg till en ny laddstation
  it('POST /v1/chargingstations/add should add a new charging station', (done) => {
    chai.request(server)
      .post('/v1/chargingstations/add')
      .send({
        api_key: process.env.API_KEY, // Skicka med API-nyckeln
        latitude: 59.3293,
        longitude: 18.0686,
        total_ports: 10,
        city_id: 1
      })
      .end((err, res) => {
        if (err) return done(err); // Hantera eventuella fel
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('status', 'success');
        chai.expect(res.body).to.have.property('message', 'chargingstation has been added');
        done();
      });
  });
//Ta bort en laddstation
  it('DELETE /v1/chargingstations/:locationId should delete a charging station', (done) => {
    const locationId = 1; // Använd ett giltigt locationId
    chai.request(server)
      .delete(`/v1/chargingstations/${locationId}`)
      .send({ api_key: process.env.API_KEY }) // Skicka med API-nyckeln
      .end((err, res) => {
        if (err) return done(err); // Hantera eventuella fel
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('message', 'Charging station deleted successfully');
        done();
      });
  });
//Uppdatera en laddstation
  it('PUT /v1/chargingstations/update should update a charging station', (done) => {
    chai.request(server)
      .put('/v1/chargingstations/update')
      .send({
        api_key: process.env.API_KEY, // Skicka med API-nyckeln
        location_id: 1,
        latitude: 59.3293,
        longitude: 18.0686,
        total_ports: 15
      })
      .end((err, res) => {
        if (err) return done(err); // Hantera eventuella fel
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('message', 'Charging station updated successfully');
        done();
      });
  });
//Lägg till en ny port till en laddstation
  it('PUT /v1/chargingstations/update/port should add new ports to a charging station', (done) => {
    chai.request(server)
      .put('/v1/chargingstations/update/port')
      .send({
        api_key: process.env.API_KEY, // Skicka med API-nyckeln
        location_id: 1,
        new_ports: 5
      })
      .end((err, res) => {
        if (err) return done(err); // Hantera eventuella fel
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('message', 'Charging station port updated successfully');
        done();
      });
  });
});