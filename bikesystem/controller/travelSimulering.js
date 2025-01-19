const axios = require("axios");

// URL till din endpoint
const CREATE_TRAVEL_URL = "http://localhost:3000/v1/travels/simulering";

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
const numberOfUsers = 10;

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

// Skapa resor för varje användare i en loop
const createTravelsForUsers = async () => {
  for (let i = 0; i < numberOfUsers; i++) {
    const user_id = i; // Använd `i + 1` för att skapa unika user_id
    const scooter_id = i; // Välj scooter_id baserat på index

    await createTravel(user_id, scooter_id); // Vänta tills varje resa är skapad
  }

  console.log("All travels created.");
};

// Kör skriptet
createTravelsForUsers();
