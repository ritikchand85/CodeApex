const express=require('express');
const submitRouter=express.Router();
const userMiddleware=require("../middleware/userMiddleware");
const {submitCode,runCode}=require('../controllers/userSubmission.js');

//user code ko submit bhi kar sakta hai and run bhi but usse pehle authenticate to karna hoga user ko
submitRouter.post("/submit/:id",userMiddleware,submitCode);
submitRouter.post("/run/:id",userMiddleware,runCode);

module.exports=submitRouter;