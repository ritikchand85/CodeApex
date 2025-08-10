// const redisClient = require("../config/redis");
// const User =  require("../models/user")
// const validate = require('../utils/validator');
// const bcrypt = require("bcrypt");
// const jwt=require('jsonwebtoken');


// const register=async (req,res)=>{
    
//     try{
//         //validate the data

//         validate(req.body);
       
//         const {firstName,emailId,password}=req.body;

       

//         req.body.password=await bcrypt.hash(password,10);
//          console.log(req.body);
         
//         req.body.role='user';
              
//         const user= new User(req.body);
//         console.log(user);
//             await user.validate();
//     console.log("Validation passed");
//         await user.save();
//         console.log("data saved");
       
//         const token=jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn:60*60});
//         //expiresIn:60*60 means 1 hour

//         // res.cookie('token',token,{maxAge:60*60*1000});
//         //maxAge:60*60*1000 is equal to 1 hour ,it basically in milliseconds
//         // res.status(201).send(user);
//         //The HTTP 201 Created status code indicates that a request has successfully created a new resource on the server

//          const reply = {
//         firstName: user.firstName,
//         emailId: user.emailId,
//         _id: user._id,
//         role:user.role,
//     }
    
//      res.cookie('token',token,{maxAge: 60*60*1000});
//      res.status(201).json({
//         user:reply,
//         message:"Loggin Successfully"
//     })
//     }

    
//     catch(err){
//         //400 status code  is used for bad request
//         res.status(400).send("Error: "+err);
//     }
// }


// const login=async(req,res)=>{
//     try{
//         const {emailId,password}=req.body;
//        if(!emailId)
//             throw new Error("Invalid Credentials");
//         if(!password)
//             throw new Error("Invalid Credentials");

//         const {token}=req.cookies;
//         const payload=jwt.verify(token,process.env.JWT_KEY);
//         if(payload){
//            res.status(200).send("Logged In Successfully");
//         }
//         const user=await User.findone({emailId:emailId});
//         const match=bcrypt.compare(password,user.password);
//         if(!match){
//             throw new Error("Invalid Credentials");

//         }
//           token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
//                 res.cookie('token',token,{maxAge: 60*60*1000});
//                 res.status(200).send("Logged In Succeessfully");
//     }
//     catch(err){
//         res.status(401).send("Error: "+err);
//     }
// }

// const logout=async(req,res)=>{
//     try{
//         const {token}=req.cookies;
//         //difference between jwt.verify and jwt.decode is both return payload but jwt.verify return payload after authencating the token
//         const payload=jwt.decode(token);

//         //`token:${token}` ye redis ki key hai jiske corresponding hamne 'Blocked' value set ki hai
//         await redisClient.set(`token:${token}`,'Blocked');
//         //payload me expiry data hota hai
//         redisClient.expireAt(`token:${token}`,payload.exp) ;
//         //token ko null set set kar diya and cookies ko immediately clear kardi isliye Date.now() likha hai
//          res.cookie("token",null,{expires: new Date(Date.now())});
//     res.send("Logged Out Succesfully");
//     }
//      catch(err){
//         //The HTTP 503 Service Unavailable status code indicates that the server is temporarily unable to handle requests.
//        res.status(503).send("Error: "+err);
//     }
// }


// const adminRegister = async(req,res)=>{
//     try{

//         //admin normal user ki tarah register nhi kar sakta ek admin hi dusre admin ko register karwa sakta hai
//         //Initial admin ki entry hum database me manually dalenge kyunki atleast ek to admin hona chahiye na uski entry hum mongodb compass se dalenge
//      //jab admin kisi aur ko as a admin ya fir as a user register karvayega then uska name,emailid,password ye sab dega
//       validate(req.body); 
//       const {firstName, emailId, password}  = req.body;

//       req.body.password = await bcrypt.hash(password, 10);
    
    
//      const user =  await User.create(req.body);
//      const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
//      res.cookie('token',token,{maxAge: 60*60*1000});
//      res.status(201).send("User Registered Successfully");
//     }
//     catch(err){
//         res.status(400).send("Error: "+err);
//     }
// }
// const deleteProfile = async(req,res)=>{
  
//     try{
//        const userId = req.result._id;
      
//     // userSchema delete
//     await User.findByIdAndDelete(userId);

//     // Submission se bhi delete karo...
    
//     // await Submission.deleteMany({userId});

//     //userschema me maine post middleware laga diya hai jaise hi userschema ka user delete hoga findByIdAndDelete se vo run hoga 
    
//     res.status(200).send("Deleted Successfully");

//     }
//     catch(err){
      
//         res.status(500).send("Internal Server Error");
//     }
// }


// module.exports = {register, login,logout,adminRegister,deleteProfile};


const redisClient = require("../config/redis");
const User =  require("../models/user.js")
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Submission = require("../models/submission")


const register = async (req,res)=>{
    
    try{
        // validate the data;

      validate(req.body); 
      const {firstName, emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
      req.body.role = 'user'
    //
    const user1=await User.findOne({emailId:req.body.emailId});
    if(user1){
        console.log(user1);
        res.json({
            user:null,
            message:"EmailId exists"
        })
        return;
    }
     const user =  await User.create(req.body);
     console.log(user);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:'user'},process.env.JWT_KEY,{expiresIn: 60*60});
     const reply = {
        firstName: user.firstName,
        emailId: user.emailId,
        _id: user._id,
        role:user.role,
    }
    
    //  res.cookie('token',token,{maxAge: 60*60*1000});
     res.status(201).json({
        user:reply,
        message:"Loggin Successfully"
    })
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


const login = async (req,res)=>{

    try{
        const {emailId, password} = req.body;

        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({emailId});

        const match = await bcrypt.compare(password,user.password);

        if(!match)
            throw new Error("Invalid Credentials");

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role:user.role,
        }

        const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(201).json({
            user:reply,
            message:"Loggin Successfully"
        })
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}


// logOut feature

const logout = async(req,res)=>{

    try{
        const {token} = req.cookies;
        const payload = jwt.decode(token);


        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);
    //    Token add kar dung Redis ke blockList
    //    Cookies ko clear kar dena.....

    res.cookie("token",null,{expires: new Date(Date.now())});
    res.send("Logged Out Succesfully");

    }
    catch(err){
       res.status(503).send("Error: "+err);
    }
}


const adminRegister = async(req,res)=>{
    try{
        // validate the data;
    //   if(req.result.role!='admin')
    //     throw new Error("Invalid Credentials");  
      validate(req.body); 
      const {firstName, emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
    //
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
     res.cookie('token',token,{maxAge: 60*60*1000});
     res.status(201).send("User Registered Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const deleteProfile = async(req,res)=>{
  
    try{
       const userId = req.result._id;
      
    // userSchema delete
    await User.findByIdAndDelete(userId);

    // Submission se bhi delete karo...
    
    // await Submission.deleteMany({userId});
    
    res.status(200).send("Deleted Successfully");

    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}


module.exports = {register, login,logout,adminRegister,deleteProfile};