const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const { expect } = chai;

chai.use(chaiHttp);

describe('API Tests', () => {
    it('GET /v1/cities should return all cities', (done) => {
        chai.request(app)
            .get('/v1/cities?api_key=key123')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.cities).to.be.an('array');
                done();
            });
    });
});

    it('GET /v1/parking should return all parking zones', (done) => {
        chai.request(app)
            .get('/v1/parking?api_key=key123')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.parkings_zones).to.be.an('array');
                done();
            });
    });

    
    
