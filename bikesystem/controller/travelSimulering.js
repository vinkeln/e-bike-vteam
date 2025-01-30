const axios = require("axios");

// URL till din endpoint
const CREATE_TRAVEL_URL = "http://server:3000/v1/travels/simulering";

// Funktion för att formatera datum till 'YYYY-MM-DD HH:mm:ss'
const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

// Hårdkodade data för resorna
const scooter_ids = [1, 2, 3, 4, 5]; // ID:n för olika scooters
const start_location_id = 1; // En hårdkodad plats
const start_time = formatDate(new Date()); // Aktuell tid
const cost = 15; // Kostnad för resan

// Antal resor som ska skapas
const numberOfUsers = 300; // Här kan du justera till 1000 eller fler

// Funktion för att skapa en resa
const createTravel = async (user_id, scooter_id) => {
  const travelData = {
    user_id,
    scooter_id,
    start_location_id,
    start_time,
    cost,
    api_key: "key123",
  };

  try {
    const response = await axios.post(CREATE_TRAVEL_URL, travelData);
    console.log(
      `Travel created for user ${user_id}, scooter ${scooter_id}:`,
      response.data
    );
  } catch (error) {
    console.error(
      `Failed to create travel for user ${user_id}, scooter ${scooter_id}:`,
      error.response?.data || error.message
    );
  }
};

// Funktion för att skapa resor i batcher
const createTravelsInBatches = async (userCount, batchSize = 100) => {
  const travelPromises = [];

  for (let i = 1; i <= userCount; i++) {
    const user_id = i + 2; // Använd `i` som user_id
    const scooter_id = i + 2; // Använd scooter_ids cykliskt

    travelPromises.push(createTravel(user_id, scooter_id));

    // När batchen är full (batchSize resor), kör batchen
    if (i % batchSize === 0 || i === userCount) {
      // Vänta tills alla resor i batchen är skapade
      await Promise.all(travelPromises);
      console.log(`Batch ${Math.ceil(i / batchSize)} created.`);

      // Reset travelPromises för nästa batch
      travelPromises.length = 0;

      // Vänta en liten stund innan nästa batch skickas för att minska belastningen
      await delay(5000); // Vänta 1 sekund mellan batcher
    }
  }

  console.log("All travels created.");
};

// Funktion för att skapa en fördröjning
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Kör funktionen för att skapa resor för 1000 användare
createTravelsInBatches(numberOfUsers);

module.exports = {
  createTravelsInBatches,
};
