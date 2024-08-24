const express = require("express");
const router = express.Router();
const singleUpload = require("../Middleware/Multer")
const CourseController = require("../Controller/Course_controller");
const {isAuthenticated, Authenticatedadmin,AuthentiSubscription } = require("../Middleware/Aut_middlewer");


router.get("/all", CourseController.GetallCourse);
router.post("/createcrc",isAuthenticated,Authenticatedadmin,singleUpload,CourseController.CreateCourse);
//this route is get course lecture
router.get("/course/:id",isAuthenticated,Authenticatedadmin,AuthentiSubscription,singleUpload,CourseController.GetCourseLecture);
router.post("/course/:id",isAuthenticated,Authenticatedadmin,singleUpload,CourseController.AddCourseLecture);
router.delete("/course/:id",isAuthenticated,Authenticatedadmin,singleUpload,CourseController.deleteCourse);
router.delete("/deletlectur",isAuthenticated,Authenticatedadmin,singleUpload,CourseController.deleteLecture);


module.exports = router;
