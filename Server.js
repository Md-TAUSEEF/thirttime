const express = require('express');
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./Config/.env" });
const nodecrn =  require("node-cron"); //yah ishke liye hai jo har month ka status dikhayega
const userRouter = require("./Routes/User_router");
const courseRouter = require("./Routes/Course_router"); 
const otherRoute=require("./Routes/Other_routes");
const connectdb = require("./Config/Database/ConnectMD");
const errorHandler = require("./Middleware/Error");
const cookieparser = require("cookie-parser");
const paymentRouter = require("./Routes/Payments");
const cloudinary = require("cloudinary");
const PORT = 4000;
const Razorpay = require("razorpay");

app.use(express.json()); 
app.use(express.urlencoded({
  extended:true,
}))

app.use(cookieparser());

app.use("/api/auth", userRouter);
app.use("/api/courses", courseRouter); 
app.use("/api/payment", paymentRouter );
app.use("/api/other",otherRoute);

app.use(errorHandler);


//<========papment gatway intrigation ==============>//

 const instance = new Razorpay({
  key_id:process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECREAT_KEY,
 
});



//for upload file then use to cloudnary
cloudinary.v2.config({
  cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
  api_key:process.env.CLOUDINARY_CLIENT_API,
  api_secret:process.env.CLOUDINARY_CLIENT_SECRET
});


//<===============first 0 second dikhayega aur second 0 minutes dikhayega aur 0 star hours dikhayega aur 4th 0 month dikhayega=================>//


nodecrn.schedule("0 0 0 5 * *", async () => {
  try {
    const stats = await Stats.create({});
    console.log("New Stats document created:", stats);
  } catch (error) {
    console.error("Error creating Stats document:", error.message);
  }
});

connectdb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  })

  

 

  .catch((error) => {
    console.error("Error starting the server:", error);
    process.exit(1);
  });

  module.exports=instance;

