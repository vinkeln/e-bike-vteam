// Function that radomly generates a movement for a bike
function getRandomMovement() {
  const latMovement = (Math.random() * 0.001 - 0.0005).toFixed(6);
  const lonMovement = (Math.random() * 0.001 - 0.0005).toFixed(6);
  return {
    lat: parseFloat(latMovement),
    lon: parseFloat(lonMovement),
  };
}

// Function to simulate bike movement
function moveCykel(lat, lon) {
  let currentLat = lat;
  let currentLon = lon;

  setInterval(() => {
    const movement = getRandomMovement();
    currentLat += movement.lat;
    currentLon += movement.lon;

    console.log(
      `New position for bike: Latitude ${currentLat}, Longitude ${currentLon}`
    );
  }, 5000);
}

module.exports = {
  moveCykel,
  getRandomMovement,
};
