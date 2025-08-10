const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const Submission =require("../models/submission");
const User =require("../models/user");

const createProblem = async (req,res)=>{

    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;

    //problem ko store karne se pehle check karenge ki uska reference solution shi bhi hai ya nhi 

    try{
       
      for(const {language,completeCode} of referenceSolution){
         

        // source_code:
        // language_id:
        // stdin: 
        // expectedOutput:
         

        //judge0 me har language ko ek id mili hai and hame language id hi request ke 
    //time par bhejni hoti hai
        const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const submissions = visibleTestCases.map((testcase)=>{
        
            return {
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
            }
        });

       /*first we submit this batch to judge0 it send us tokens because it jusdge0 take some to run the code in all languages
       and it don't want that we wait for result at judge0 server because it takes memory if we are waiting on judge0 server and it might be possible that judge0 is busy on other requests, so it says take the tokens and come back after some time,so we are making two api request*/
        const submitResult = await submitBatch(submissions);
        // console.log(submitResult);
        
        const resultToken = submitResult.map((value)=> value.token);

        // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
        
       const testResult = await submitToken(resultToken);

   

       for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }

      }


      // We can store it in our DB

    const userProblem =  await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });

      res.status(201).send("Problem Saved Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


const updateProblem=async(req,res)=>{
    const id=req.params.id;
     const {title,description,difficulty,tags,
    visibleTestCases,hiddenTestCases,startCode,
    referenceSolution, problemCreator
   } = req.body;

   try{
      if(!id){
      return res.status(400).send("Missing ID Field");
     }
     const DsaProblem=await Problem.findById(id);
     if(!DsaProblem)
    {
      return res.status(404).send("ID is not persent in server");
    }

     for(const {language,completeCode} of referenceSolution){
             
    
          // source_code:
          // language_id:
          // stdin: 
          // expectedOutput:
    
          const languageId = getLanguageById(language);
            
          // I am creating Batch submission
          const submissions = visibleTestCases.map((testcase)=>({
              source_code:completeCode,
              language_id: languageId,
              stdin: testcase.input,
              expected_output: testcase.output
          }));
    
    
          const submitResult = await submitBatch(submissions);
          // console.log(submitResult);
    
          const resultToken = submitResult.map((value)=> value.token);
    
          // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
          
         const testResult = await submitToken(resultToken);
    
        //  console.log(testResult);
    
         for(const test of testResult){
          if(test.status_id!=3){
           return res.status(400).send("Error Occured");
          }
         }
    
        }

        //findByupdateandId me teen input hote hai ek to id, second update object,third optional things
        /*Spreads all properties from req.body into the update object

         Equivalent to:


         {
  title: req.body.title,
  difficulty: req.body.difficulty,
  // ...all other properties in req.body
}

*/

//runValidators:true matlab jo bhi validator lgaye the schema me unique:true,required:true,minlength etc vo sab vapis test karo
//new:true matlab updated document return karo jo ki newProblem me save ho jayega



       const newProblem=await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
        res.status(200).send(newProblem);
   }
    catch(err){
      res.status(500).send("Error: "+err);
  }
}


const deleteProblem = async(req,res)=>{

  const id = req.params.id;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");

   const deletedProblem = await Problem.findByIdAndDelete(id);

   if(!deletedProblem)
    return res.status(404).send("Problem is Missing");


   res.status(200).send("Successfully Deleted");
  }
  catch(err){
     
    res.status(500).send("Error: "+err);
  }
}

const getProblemById = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");
    //ab hame user ko hiddentestcases to show nhi karne hai and reference  solution ko hum paid rakh sakte hai ya user ko dikha bhi sakte hai
    //ab jisko dikhana hai use select me daal do
    const getProblem = await Problem.findById(id).select('_id title description difficulty tags  visibleTestCases startCode referenceSolution ');
    //what if we have to select those fields which we don't want to show user
    /*const getProblem = await Problem.findById(id).select(
  '-referenceSolution hiddenTestCases'
);*/

//if we dont want to show all problems at once we can use limit so that at once we can show only 10 problems then user select next 10 problems
  // await Problem.find().skip(10).limit(10);
  /*skip 10 problems means start with 11 and show 20 problems
  const page=2;
  const limit=10;
  const skip=(page-1)*limit;*/
   if(!getProblem)
    return res.status(404).send("Problem is Missing");


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

const getAllProblem = async(req,res)=>{
  console.log("hello");
  try{
     //saari problems select karli but show keval id ,difficuly,tags and title ko hi karenge
    const getProblem = await Problem.find({}).select('_id title difficulty tags visibleTestCases');

   if(getProblem.length==0)
    return res.status(404).send("Problem is Missing");


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}


const solvedAllProblembyUser =  async(req,res)=>{
   
    try{
      
      const userId = req.result._id;
  
      //ab yha hame samaj aayega ki hamne userId ke type ko Schema.types.ObjectId kyu rakha tha instead of String rakh kar user_id store kara sakte the iska fayda yeh hai ki
      //ab hum populate use karke
      const user =  await User.findById(userId).populate({
        path:"problemSolved",
        select:"_id title difficulty tags"
      });
     
      res.status(200).send(user.problemSolved);

    }
    catch(err){
      res.status(500).send("Server Error");
    }
}

const submittedProblem = async(req,res)=>{

  try{
     
    const userId = req.result._id;
    const problemId = req.params.pid;
  
 const result = await Submission.find({ userId, problemId });
const ans = result.filter((val)=>{
  if(val.status !== 'pending'){
    return val;
  }
});
  

  if(ans.length==0)
    res.status(200).send("No Submission is persent");
  
  res.status(200).send(ans);

  }
  catch(err){
     res.status(500).send("Internal Server Error");
  }
}



module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem};



// const submissions = [
//     {
//       "language_id": 46,
//       "source_code": "echo hello from Bash",
//       stdin:23,
//       expected_output:43,
//     },
//     {
//       "language_id": 123456789,
//       "source_code": "print(\"hello from Python\")"
//     },
//     {
//       "language_id": 72,
//       "source_code": ""
//     }
//   ]


/*how populate is working

.populate({ ... })

Replaces references in a field with actual documents from another collection

This is Mongoose's way of performing a "join-like" operation


{
  path: "problemSolved",      // Field in User document to populate
  select: "_id title difficulty tags"  // Fields to include from referenced documents
}

Prerequisite Schema Setup
The User schema must define problemSolved as a reference field:
const userSchema = new Schema({
  // ...other fields,
  problemSolved: [{
    type: Schema.Types.ObjectId,
    ref: 'Problem'  // References the Problem model
  }]

Database Operation Flow:

Finds the user document by ID

Detects that problemSolved contains ObjectIDs

Queries the Problem collection for documents matching those IDs

Replaces the ObjectIDs with actual problem documents

Returns a modified user document with populated data

{
  _id: "user123",
  name: "John",
  email: "john@example.com",
  // ...other user fields,
  problemSolved: [
    {
      _id: "prob001",
      title: "Two Sum",
      difficulty: "Easy",
      tags: ["Array", "Hash Table"]
    },
    {
      _id: "prob002",
      title: "Reverse String",
      difficulty: "Easy",
      tags: ["String"]
    }
  ]
}
})*/