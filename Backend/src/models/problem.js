const mongoose=require('mongoose');
const {Schema}=mongoose;

const problemSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:["easy","medium","hard"],
        required:true,
    },
    tags:{
        type:String,
        enum:['array','linkedList','graph','dp'],
        required:true
    },
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
              type:String,
              required:true
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],

    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            }
        }
    ],
    startCode:[
        {
            language:{
                type:String,
                required:true,
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ],

    referenceSolution:[
        {
            language:{
                type:String,
                required:true,
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ],

    problemCreator:{

      /*  1. **`type: Schema.Types.ObjectId`**  
   - Tells Mongoose that this field will store MongoDB `ObjectId` values which are unique.  
  // users collection
{
  _id: ObjectId("507f191e810c19729de860ea"), // <-- This ObjectId
  name: "Alice",
  email: "alice@example.com"
}
2. **`ref: 'user'`**  
   - Indicates that this `ObjectId` references documents from the `'user'` model (which we defined earlier as `mongoose.model('user', userSchema)`).  */
  


        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    }

})

const Problem=mongoose.model('problem',problemSchema);
module.exports=Problem;


// const referenceSolution = [
//     {
//         language:"c++",
//         completeCode:"C++ Code"
//     },
//     {
//         language:"java",
//         completeCode:"java Code"
//     },
//     {
//         language:"js",
//         completeCode:"JS Code"
//     },
// ]