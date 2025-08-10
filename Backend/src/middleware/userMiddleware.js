const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis")

const userMiddleware=async (req,res,next)=>{
    
    try{
         const {token} = req.cookies;
    if(!token)
        throw new Error("Token is not persent");
    //jwt.verify will automatically throw error if token is invalid so no need of handling error
      const payload = jwt.verify(token,process.env.JWT_KEY);

        
   
  
     //Redis ke blocklist mein present toh nhi hai
      //`token:${token}` ye puri ek key hai string form me
     const IsBlocked=await redisClient.exists(`token:${token}`);
     if(IsBlocked){
        throw new Error("Invalid token");
     }

       const {_id} = payload;
   
        
     const result = await User.findById(_id);
        
     if(!result){
     throw new Error("User Doesn't Exist");
     }
     //user ki information ko req object  me store kara liya controller ke liye
     req.result=result;

    
    next();


    }  
    catch(err){
        res.status(401).send("Error: "+err.message);
    }     
}

module.exports=userMiddleware;


/*We use 401 when the request lacks valid authentication credentials. In this middleware, we return 401 in all failure cases because:
        - Token is missing (or invalid) -> client must provide a valid one.
        - Token is blocked (client must re-authenticate to get a new token).
        - User not found (the token is valid but the user it represents is gone, so the client must re-authenticate).*/