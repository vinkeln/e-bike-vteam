const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth.js");
const checkAdmin = require("../middleware/check-admin.js"); // Middleware för att kontrollera administratörsbehörighet
const paymentModules = require("../src/payment/modules.js"); // Moduler för databashantering relaterade till betalningar

// Get all payments
router.get("/", checkAuth, checkAdmin, async (req, res) => {
  try {
    const payments = await paymentModules.getPayments();
    return res.status(200).json({
      status: "success",
      payments: payments,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Get a specific payment
router.get("/:paymentId", checkAuth, checkAdmin, async (req, res) => {
  const { paymentId } = req.params;

  if (isNaN(paymentId)) {
    return res.status(400).json({ error: "Invalid payment ID" });
  }

  try {
    const payment = await paymentModules.getPaymentById(paymentId);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    return res.status(200).json({
      status: "success",
      payment: payment,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Create a new payment
router.post("/", checkAuth, async (req, res) => {
  const { user_id, amount, payment_type } = req.body;
  const status = req.body.status || "genomförd";
  if (!user_id || !amount || !payment_type) {
    return res.status(400).json({ error: "All inputs are required!" });
  }

  try {
    const newPayment = await paymentModules.createPayment(
      user_id,
      amount,
      payment_type,
      status
    );

    return res.status(201).json({
      status: "success",
      message: "Payment created",
      paymentId: newPayment,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Update a payment
router.put("/:paymentId", checkAuth, checkAdmin, async (req, res) => {
  const { paymentId } = req.params;
  const { amount, status } = req.body;

  if (!amount && !status) {
    return res
      .status(400)
      .json({
        error:
          "At least one field (amount or status) must be provided for update.",
      });
  }

  try {
    const payment = await paymentModules.getPaymentById(paymentId);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    await paymentModules.updatePayment(paymentId, amount, status);

    return res.status(200).json({
      status: "success",
      message: "Payment updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Delete a payment
router.delete("/:paymentId", checkAuth, checkAdmin, async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await paymentModules.getPaymentById(paymentId);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    await paymentModules.deletePayment(paymentId);

    return res.status(200).json({
      status: "success",
      message: "Payment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Get all payments for a specific user
router.get("/user/:userId", checkAuth, async (req, res) => {
  const { userId } = req.params;

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const userPayments = await paymentModules.getPaymentsByUserId(userId);

    if (userPayments.length === 0) {
      return res.status(404).json({ error: "No payments found for this user" });
    }

    return res.status(200).json({
      status: "success",
      payments: userPayments,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

module.exports = router;
