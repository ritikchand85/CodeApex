const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const submissionSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        //table ka naam likhna hai jis naam se db me store kiya hai ,code me jo naam use kar rhe vo nhi
        ref:'user',
        required:true,
    },
    problemId:{
        type:Schema.Types.ObjectId,
        ref:'problem',
        required:true
    },
    code:{   //submission code
        type:String,
        required:true,
    },
    language:{
        type:String,
        required:true,
        enum:['javascript','c++','java']
    },
    status:{
        type:String,
        enum:['pending','accepted','wrong','error'],
        default:'pending'
    },
    runtime:{
        type:Number,//milliseconds
        default:0
    },
    memory:{
        type:Number,//KB
        default:0
    },
    errorMessage:{  //error kon sa aaya like semicolon miss ho gya etc,error ke type ki baat nhi kar rhe
        type:String,
        default:''
    },
    testCasesPassed:{  //kitne testcases passed hue
        type:Number,
        default:0
    },
    testCasesTotal:{ //kitne total testcases the
        type:Number,
        default:0
    }
},{
    timestamps:true
})


//most important thing ek table or model ke multiple index ho sakte hai and unko bhi storage chahiye hoti hai jis bhi 
//input field ke aage hum unique:true likhte hai index create ho jata hai us field ke corresponding and jo document_id hoti hai jo mongodb deta hai uske corresponding bhi index rehta hai
//isliye hum aise use karte User.findbyId(req._id); ye hame binary search(logn) me document find karne me help karta hai

//ab suppose hamko userId and problemId pta hai and us userId and problemId ke corresponding saare submissions nikalne hai to hum ek compound index create karenge
submissionSchema.index({userId:1,problemId:1});
//userId:1 means userId ascending order me rahengi agar descending me karna hai to -1 kar do

const Submission=mongoose.model('submission',submissionSchema);
module.exports=Submission;