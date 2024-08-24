const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../Middleware/Aut_middlewer");
const paymentcnt = require("../Controller/Payment_controller");

//<==============buy subscription===================>
router.get("/buysubscription", isAuthenticated, paymentcnt.buySubscription);

//<===================payment verification and store in database================>//

router.post("/pymentverification",isAuthenticated,paymentcnt.paymentVerification)

//<====================get razorpay key=====================>//

router.get("/razorpaykey",isAuthenticated,paymentcnt. GetRazorpaykey);

//<================cancel subscription ===============>//
router.delete("/subscription/chencel",isAuthenticated,paymentcnt.CancelSubscription);

module.exports = router;
