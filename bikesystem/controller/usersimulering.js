const axios = require("axios");

// URL till signup-endpoint
const SIGNUP_URL = "http://localhost:3000/v1/user/signup";

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

// Skapa 1000 användare
const createMultipleUsers = async () => {
  const userPromises = [];
  for (let i = 1; i <= 10; i++) {
    userPromises.push(createUser(i));
  }

  // Vänta tills alla förfrågningar är klara
  await Promise.all(userPromises);
  console.log("All users created.");
};

// Kör funktionen
createMultipleUsers();
