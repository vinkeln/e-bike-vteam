import { io } from "socket.io-client";

// Skapa en socket-anslutning
const socket = io("http://localhost:3000"); // Ersätt med din serveradress

// Funktion för att kontrollera cykelns tillgänglighet
export const checkScooterAvailability = (scooterId) => {
  return new Promise((resolve, reject) => {
    // Skicka event till servern med cykelns ID
    socket.emit("checkScooterAvailability", { scooterId });

    // Lyssna efter svaret från servern
    socket.once("rideResponse", (response) => {
      resolve(response);
    });

    // Hantera fel
    socket.on("error", (error) => {
      reject(error);
    });
  });
};
