const express=require("express");
const router=express.Router();
const{isAuthenticated,Authenticatedadmin}=require("../Middleware/Aut_middlewer");
const OtherRts=require("../Controller/Other_controller");
router.post("/contactform",OtherRts. Contactform);
router.post("/contactreq",OtherRts.courseRequest)
router.get("/admin/stats",isAuthenticated,Authenticatedadmin,OtherRts.getDashboardStats)
module.exports=router;