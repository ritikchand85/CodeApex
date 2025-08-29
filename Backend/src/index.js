const express = require('express')
const app = express();

const dotenv=require('dotenv');
dotenv.config();
const main =  require('./config/db')
const cookieParser =  require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const cors = require('cors')


 

app.use(express.json());
app.use(cookieParser());
//token ko hum browser ki localstorage me bhi store kar sakte the but localstorage secure nhi hai use hum script se access kar sakte hai
//frontend me hum token ko store kar nhi sakte because frontend code visible hota hai sabko
/*to  token  cookies ke andar browser me store hota hai jab hum axios ko configure karte samay withCredentials:true likhte hai uska matlab hota hai browser automatically
hmari request ke saath token add kar dega*/
//why do we use cors basically hota ye hai ki man lo same browser se but different fronend(hum galti se malicious website me aa gye and malicious website server ko call kar rhi to browser automatically token add kar dega ) se hum server ko request maar rhe hai to hmara token bhi jayega request ke saath aur us request me malicious script ho sakti hai jisse hacker access le sakta hai isliye browser request ko blocked karta hai jiska solution hota hai cors
//isliye hum cors lgatte hai taaki isi frontend url se request aaye to request accept ho ,credentials:true for accepting cookies otherwise it won't accept.

app.use(cors({
    //origin:'*' kar diya to saari request accept hongi
    //why postman requests are not blocked
    /*Postman Requests

Postman is not a browser. It doesn’t execute in the web page security context.

It’s just a standalone HTTP client (like curl).

Since it doesn’t need to enforce browser security policies, it doesn’t care about CORS.

It simply sends the HTTP request and shows you the raw response.

👉 Postman assumes you know what you’re doing. There’s no “user protection” layer like in browsers.*/
    origin: 'http://localhost:5173',
    credentials: true 
}))

app.use('/user',authRouter);

app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);

const InitalizeConnection = async ()=>{
    try{

        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");
        //dono db connect karne ke baaad hi server run karayenge
        
        app.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })

    }
    catch(err){
     
        console.log("Error: "+err);
    }
}


InitalizeConnection();

