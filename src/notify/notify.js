// Notify admins about a low battery
function notifyAdmins(bikeId, batteryLevel) {
    console.log(`Admin: Bike ${bikeId} has low battery (${batteryLevel}%)`);
    // Add email or Slack notification code here
}

// Notify customers about a low battery
function notifyCustomer(bikeId, batteryLevel) {
    console.log(`Customer: Bike ${bikeId} has low battery (${batteryLevel}%)`);
    // Add SMS or push notification code here
}

module.exports = {
    notifyAdmins,
    notifyCustomer
};
