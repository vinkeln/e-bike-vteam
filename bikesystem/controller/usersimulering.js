const axios = require("axios");

// URL till signup-endpoint
const SIGNUP_URL = "http://server:3000/v1/user/signup";

// Funktion för att generera en slumpmässig e-postadress
const generateRandomEmail = (index) => `user${index}@example.com`;

// Funktion för att skapa en användare
const createUser = async (index) => {
  const userData = {
    mail: generateRandomEmail(index),
    name: `User${index}`,
    password: "password123",
    role: "user",
    api_key: "key123", // Standardroll för användare
  };

  try {
    const response = await axios.post(SIGNUP_URL, userData);
    console.log(`User ${index} created:`, response.data.message);
  } catch (error) {
    console.error(
      `Failed to create user ${index}:`,
      error.response?.data || error.message
    );
  }
};

// Funktion för att skapa användare i batcher
const createUsersInBatches = async (userCount, batchSize = 100) => {
  const userPromises = [];

  for (let i = 1; i <= userCount; i++) {
    userPromises.push(createUser(i));

    // När batchen är full (batchSize användare), kör batchen
    if (i % batchSize === 0 || i === userCount) {
      // Vänta tills alla användare i batchen är skapade
      await Promise.all(userPromises);
      console.log(`Batch ${Math.ceil(i / batchSize)} created.`);

      // Reset userPromises för nästa batch
      userPromises.length = 0;

      // Vänta en liten stund innan nästa batch skickas för att minska belastningen
      await delay(4000); // Vänta 1 sekund mellan batcher
    }
  }

  console.log("All users created.");
};

// Funktion för att skapa en fördröjning
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Skapa 1000 användare
// createUsersInBatches(3000);
module.exports = {
  createUsersInBatches,
};
