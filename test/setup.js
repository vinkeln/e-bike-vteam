const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Importera Express-appen
chai.use(chaiHttp);

let server;

before((done) => {
    server = app.listen(0, () => { // 0 låter systemet tilldela en dynamisk port
      console.log('Server started at address:', server.address());
      done();
    });
  });
  

after((done) => {
  if (server) {
    server.close(() => done());
  } else {
    done();
  }
});

module.exports = { server, chai };
