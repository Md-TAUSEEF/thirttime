const express = require("express");
const router=express.Router();
const usercont = require("../Controller/User_controller");
const singleUpload = require("../Middleware/Multer")
const {isAuthenticated,Authenticatedadmin}=require("../Middleware/Aut_middlewer");
router.post("/register",singleUpload,usercont.Register);
router.post("/login",usercont.loginUser)
router.get("/logout",usercont.Logout);
router.get("/me",isAuthenticated,usercont.Getmyprofile);
router.put("/changeps",isAuthenticated,usercont.ChangePassword);
router.put("/update",isAuthenticated,usercont.UpdateProfile);
router.post("/forwordpass",usercont.ForgetPassword);
router.put("/resetpassword/:token",usercont.ResetPassword);
router.post("/addtoplaylist",isAuthenticated,usercont.AddtoPlayList);
router.delete("/deletplaylist",isAuthenticated,usercont.DeleteFromPlaylist);
router.put("/updateprofilepecture",isAuthenticated,singleUpload,usercont.UpdateProfilepicture);


//<===============Admin route=================>//
router.get("/admin/user",isAuthenticated,Authenticatedadmin,usercont.getallUser);
router.put("/admin/updateuserrole/:id",isAuthenticated,Authenticatedadmin,usercont.Updateuserrole);
router.delete("/admin/deletuser/:id",isAuthenticated,Authenticatedadmin,usercont.deleteUser);
router.delete("/admin/deletmyprofile",isAuthenticated,Authenticatedadmin,usercont.deleteMyProfile);


module.exports=router;