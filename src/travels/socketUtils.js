const ioClient = require("socket.io-client");

// Anslut till socket-servern
const socket = ioClient("http://localhost:3000");

// Kontrollera cykelns tillgänglighet
function checkScooterAvailability(
  scooterId,
  userId,
  socketEvent,
  bikeLocationId
) {
  return new Promise((resolve) => {
    socket.emit(socketEvent, { scooterId, userId, bikeLocationId });

    // Lyssna efter svar från servern
    socket.once("rideResponse", (response) => {
      resolve(response);
    });
  });
}

module.exports = { checkScooterAvailability };
