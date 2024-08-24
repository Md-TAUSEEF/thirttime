const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const User = require("../Modules/User_module");
dotenv.config({ path: "./Config/.env" });
const crypto = require("crypto"); //this is using to create the url
const Payment=require("../Modules/Payment_modules");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY ,
  key_secret: process.env.RAZORPAY_SECREAT_KEY,
});



const buySubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ success: false, message: "Admin cannot buy subscriptions" });
    }

    const planId = process.env.PLAN_ID || "plan_OmcfISmyCKd7OC";

    // Create subscription using Razorpay instance
    const subscription = await instance.subscriptions.create({
      plan_id: planId,
      customer_notify: 1, // Notify customer via email/SMS
      total_count: 12,    // Number of months for subscription
    });

    // Update user subscription details
    user.subscription = {
      id: subscription.id,
      status: subscription.status,
    };

    await user.save();

    res.status(201).json({
      success: true,
      subscriptionId: subscription.id,
    });

  } catch (error) {
    console.error(`Error creating subscription: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to create subscription",
    });
  }
};


//<============Pyment veryfication =====================>//


//ishme hame razorpay doc se code lena hai

const paymentVerification = async (req, res) => {
  try {
    // Extracting parameters from request body
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Fetching the user from the database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Retrieving subscription ID from the user
    const subscriptionId = user.subscription.id;

    // Generating the signature for comparison
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Verifying the signature
    const isAuthentic = generated_signature === razorpay_signature;

    if (!isAuthentic) {
      // Handle the case where signature verification fails
      return res.status(400).json({ msg: "Payment verification failed" });
    }

    // Store payment details in the database
    await Payment.create({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    // Update user subscription status
    user.subscription.status = "active";
    await user.save();

    // Respond with success and appropriate URL
    res.status(200).json({ msg: "Payment successful", redirectUrl: `${process.env.FRONTEND_URL}/payment-success` });

  } catch (error) {
    console.error("Error during payment verification:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


//<=============get razorpay key==================>//

const GetRazorpaykey = async (req, res) => {
  try {
    res.status(200).json({ success: true, key: process.env.RAZORPAY_API_KEY });
  } catch (error) {
    console.error("Error fetching Razorpay key:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

//<============Cancel Subscription =====================>>//
const CancelSubscription = async (req, res) => {
  try {
    // Find the user by their ID (assumed to be stored in req.user._id)
    const user = await User.findById(req.user._id);

    // Get the subscription ID from the user's subscription object
    const subscriptionId = user.subscription.id;

    // Cancel the subscription using the subscription ID
    await instance.subscriptions.cancel(subscriptionId);

    // Find the payment record associated with the subscription
    const payment = await Payment.findOne({
      razorpay_order_id: subscriptionId,
    });

    // Calculate the time elapsed since the payment was created
    const gap = Date.now() - payment.createdAt;

    // Calculate the refund window (in milliseconds) based on the environment variable
    const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;

    // Initialize refund flag to false
    let refund = false;

    // Check if the current time is within the refund window
    if (refundTime > gap) {
      // Process the refund if within the refund window
      await instance.payments.refund(payment.razorpay_payment_id);
      refund = true;
    }

    // Remove the payment record from the database
    await payment.remove();

    // Clear the user's subscription ID and status as the subscription is cancelled
    user.subscription.id = undefined;
    user.subscription.status = undefined;

    // Save the updated user data to the database
    await user.save();

    // Send a successful response with a message based on whether a refund was issued
    res.status(200).json({
      success: true,
      message: refund
        ? "Subscription cancelled successfully. You will receive a refund within 7 days."
        : "Subscription cancelled successfully. You will not receive a refund.",
    });
  } catch (error) {
    // Log the error and send an error response
    console.error("Error cancelling subscription:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while cancelling the subscription.",
      error: error.message,
    });
  }
}

module.exports = {buySubscription,paymentVerification, GetRazorpaykey,CancelSubscription};
