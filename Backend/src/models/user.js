// const mongoose=require('mongoose');
// const {Schema}=mongoose

// const userSchema=new Schema({
//    firstName:{
//     type:String,
//      required:true,
//      minLength:3,
//      maxLength:20
//    },
//    lastName:{
//     type:String,
//     minLength:3,
//     maxLength:20,
//    },
//    emailId:{
//     type:String,
//     required:true,
//     unique:true,
//     //trime:true means Automatically removes any leading or trailing whitespace from a string before saving it
//     trim:true,

//     //Converts the string to lowercase before saving.
//     lowercase:true,

//     //immutable:true   Meaning: Once a value is set, it cannot be modified later.
//     immutable:true,
//    },
//    age:{
//     type:Number,
//     min:6,
//     max:80,
//    },
//    role:{
//     type:String,

//     /*enum: ['user', 'admin']`**  
//    - The `enum` stands for enumeration. It restricts the possible values that the `role` field can have to only those listed in the array. Here, the allowed values are `'user'` and `'admin'`.
//    - If you try to set the `role` to any value not in this list (e.g., `'manager'`), it will result in a validation error*/
//    enum:['user','admin'],
//    default:'user'

//    },
//    problemSolved:{
//     type:Schema.Types.ObjectId,
//     ref:'problem'
//    },
//    password:{
//     type:String,
//     required:true
//    }
// },{
// strict:false

//     /*The timestamps: true option automatically adds two critical fields to your documents:

// createdAt: Date when the document was first created

// updatedAt: Date when the document was last modified*/
//     timestamps:true
// });


// // All operations on User will target the users collection in MongoDB
// //it means collection name in db is user but we can apply operation like User.create on the "User" 
// const User=mongoose.model("user",userSchema);
// //mongoose ki command hoti hai findByIdAndDelete jo internally mongodb ki command me convert hoti hai 'findOneAndDelete'
// //post middleware
// //aise hi pre middleware bhi hota hai jo pehle chalta hai
// userSchema.post('findOneAndDelete', async function (userInfo) {
//     if (userInfo) {
//       //mongoose.model('submission') fetch the submission model from mongodb models list
//       await mongoose.model('submission').deleteMany({ userId: userInfo._id });
//     }
// });
// module.exports=User;


// /*Problem.find({
// votes:{$gte:100},//gte means greater than or equal to
// tags:{$in:["array","hashmap"]}
// })
// The $in operator in MongoDB is used to match documents where a specified field's value equals any value in a given array
// There are so many operators like this in mongoose you can explore them
// */



//by default hamne apne schema ko fixed rakha hai means hum runtime me koi extra field add nhi kar sakte agar karenge to mongoose us field ko  ignore kar dega and vo field document me store nhi hogi .agar kisi field ko hamne schema me define kiya hai and runtime me us field ko set na kare  aur vo required:true nhi hai to hum aisa kar sakte hai if required:true hai to validation error dega.
//agar hum chahte hai ki runtime me bhi extra field add kar sake to strict:false use karo

const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        lowercase:true,
        immutable: true,
    },
    age:{
        type:Number,
        min:6,
        max:80,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default: 'user'
    },
    problemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem'
        }],
        unique:true
    },
    password:{
        type:String,
        required: true
    }
},{
    timestamps:true
});

userSchema.post('findOneAndDelete', async function (userInfo) {
    if (userInfo) {
      await mongoose.model('submission').deleteMany({ userId: userInfo._id });
    }
});


const User = mongoose.model("user",userSchema);

module.exports = User;
