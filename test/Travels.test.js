const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
require('dotenv').config(); // Lägg till denna rad för att ladda miljövariabler
chai.use(chaiHttp);

describe('Travels API', () => {
  let server;
  let port;

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

  //Linn travels API
  it('GET /travels should return all travels', (done) => {
    chai.request('http://localhost:3001') // Använd hårdkodad adress
        .get('/v1/travels')
        .query({ api_key: process.env.API_KEY }) // Använd process.env.API_KEY
        .end((err, res) => {
            if (err) return done(err); // Hantera eventuella fel
            chai.expect(res).to.have.status(200);
            chai.expect(res.body).to.have.property('message', 'Data retrieved successfully.');
            chai.expect(res.body.data).to.be.an('array');
            done();
        });
  });
  
  it('POST /travels should create a new travel', (done) => {
    chai.request(server)
      .post('/v1/travels')
      .send({
        api_key: process.env.API_KEY, // Skicka med API-nyckeln
        user_id: 1,
        scooter_id: 2,
        start_location_id: 3,
        start_time: "2023-12-10 10:00:00",
      })
      .end((err, res) => {
        chai.expect(res).to.have.status(201);
        chai.expect(res.body).to.have.property('message', 'New trip has been added');
        chai.expect(res.body).to.have.property('rideId');
        done();
      });
  });

  it('PUT /travels/:rideId should update a travel', (done) => {
    chai.request(server)
      .put('/v1/travels/1')
      .send({
        api_key: process.env.API_KEY, // Skicka med API-nyckeln
        end_location_id: 4,
        end_time: "2023-12-10 12:00:00",
        cost: 50,
      })
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('message', 'Trip has been updated!');
        done();
      });
  });
});