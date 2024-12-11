let chaiHttp = require('chai-http');
let { chai, server } = require('./setup');
let app = require('../app');
chai.use(chaiHttp);

//Linn travels API
describe('Travels API', () => {
    it('GET /travels should return all travels', (done) => {
      chai.request(server)
        .get('/v1/travels') // Kontrollera att detta matchar din routedefinition
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
        .post('/travels')
        .send({
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
        .put('/travels/1')
        .send({
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