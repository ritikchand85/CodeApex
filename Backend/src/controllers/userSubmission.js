const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");

const submitCode=async(req,res)=>{
    //
    try{
        const userId=req.result._id;
        //params me hum multiple cheezein bhej sakte hai
        //.../user/:id/state/:city
        const problemId=req.params.id;

        let {code,language}=req.body;
        if(!userId||!code||!problemId||!language){
            return res.status(400).send("Some field missing");
        }
        //hamne language id c++ ke basis par di hai cpp ke nhi
         if(language==='cpp')
        language='c++'
        //fetch the problem from database
        const problem=await Problem.findById(problemId);

        //ab mein pehle submission store kar dunga judge0 me test karne se pehle as a pending because 
        //if judge0 busy hua to vo bhut late reply karega to agar user ne apne submissions maang liye is bich to mein use vo wala submission bhi dikha saku as a pending state


        //submission.create document ka reference pass karta hai

        const submittedResult=await Submission.create({
            //key value pair same hai to aise likh sakte hai
            userId,
            problemId,
            code,
            language,
            status:'pending',
            testCasesTotal:problem.hiddenTestCases.length
        })

        const languageId=getLanguageById(language);

        const submissions=problem.hiddenTestCases.map((testcase)=>{
           return { source_code:code,
            language_id:languageId,
            stdin:testcase.input,
            expected_output:testcase.output

           }

        });

        const submitResult=await submitBatch(submissions);
        //submitresult me bhut saari cheezein hongi token ke alawa
        const resultToken=submitResult.map((value)=>{
            return value.token;
        })

        const testResult=await submitToken(resultToken);

        //ab submittedResult ko update karenge

        let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;

    //hum cputime ko add karenge because hum chahte hai hmare code ko saare testcases passed karne ke liye time kitna laga
    //memory time ke liye hum maximum lenge kyunki jab ek testcase run ho jayega to vo chala jayega memory free
    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            //status_id==4 compilation error ke liye hota hai
            status = 'error'
            errorMessage = test.stderr
          }
          else{
            status = 'wrong'
            errorMessage = test.stderr
          }
        }
    }
    // Store the result in Database in Submission
    submittedResult.status   = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    //ab reference me to change kar liya but vo changes to object me reflect karega mongodb me nhi to .save() karna hoga
    await submittedResult.save();
      

     // ProblemId ko insert karenge userSchema ke problemSolved mein if it is not persent there.
    
    // req.result == user Information
    //agar user ke problemSolved me already ye problemId hai to fir store nhi karenge
    if(!req.result.problemSolved.includes(problemId)){
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }

    const accepted = (status == 'accepted')
    //json me isliye bhej rahe takki data ache se display ho frontend pe
    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory
    });


    }
     catch(err){
      res.status(500).send("Internal Server Error "+ err);
    }
}


//run code me sirf ye change hoga ki hiddentestcases ki jagah visible lenge and is baar problem solved me push nhi karenge
//and problem ko save nhi karenge
const runCode = async(req,res)=>{
 
     try{
      const userId = req.result._id;
      const problemId = req.params.id;

       let {code,language} = req.body;
     
      if(language==='cpp'){
        language='c++';
      }
      

     if(!userId||!code||!problemId||!language)
       return res.status(400).send("Some field missing");

   //    Fetch the problem from database
      const problem =  await Problem.findById(problemId);
   //    testcases(Hidden)


   //    Judge0 code ko submit karna hai
   
   const languageId = getLanguageById(language);
   

   const submissions = problem.visibleTestCases.map((testcase)=>({
       source_code:code,
       language_id: languageId,
       stdin: testcase.input,
       expected_output: testcase.output
   }));


   const submitResult = await submitBatch(submissions);
 
   const resultToken = submitResult.map((value)=> value.token);
   console.log(resultToken);
 
   const testResult = await submitToken(resultToken);
  
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

   
  for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = false
            errorMessage ="Compilation error"
          }
          else{
            status = false
            errorMessage = "Runtime error"
          }
        }
    }

   
  
   res.status(201).json({
    errorMessage,
    success:status,
    testCases: submissions,
    runtime,
    memory
   });
   }
   catch(err){
     res.status(500).send("Internal Server Error "+ err);
   }
}


module.exports = {submitCode,runCode};


//testresult will look like this


//     language_id: 54,
//     stdin: '2 3',
//     expected_output: '5',
//     stdout: '5',
//     status_id: 3,
//     created_at: '2025-05-12T16:47:37.239Z',
//     finished_at: '2025-05-12T16:47:37.695Z',
//     time: '0.002',
//     memory: 904,
//     stderr: null,
//     token: '611405fa-4f31-44a6-99c8-6f407bc14e73',


// User.findByIdUpdate({
// })

//findbyidandupdate ko hum two step me break kar sakte hai aise

//const user =  User.findById(id)
// user.firstName = "Mohit";
// await user.save();