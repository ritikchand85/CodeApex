// const obj={
//     name:"Ritik",
//     age:22
// };

// const x={...obj,height:"6 inch"};
// console.log(x);

// const arr=["ritik","ritik"];

// const isAllowed=arr.every((k)=>{
//     return k==="ritik";
// })
// console.log(isAllowed);


//

// const json ={
//     "title": "Add Two Numbers",
//     "description": "Write a program that takes two integers as input and returns their sum.",
//     "difficulty": "easy",
//     "tags": "array",
//     "visibleTestCases": [
//         {
//             "input": "2 3",
//             "output": "5",
//             "explanation": "2 + 3 equals 5"
//         },
//         {
//             "input": "-1 5",
//             "output": "4",
//             "explanation": "-1 + 5 equals 4"
//         }
//     ],
//     "hiddenTestCases": [
//         {
//             "input": "10 20",
//             "output": "30"
//         },
//         {
//             "input": "100 250",
//             "output": "350"
//         }
//     ],
//     "startCode": [
//         {
//             "language": "C++",
//             "initialCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    // Read input here\n    cout << a + b;\n    return 0;\n}"
//         },
//         {
//             "language": "Java",
//             "initialCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Read input here\n    }\n}"
//         },
//         {
//             "language": "JavaScript",
//             "initialCode": "const readline = require('readline');\n\n// Complete input handling here"
//         }
//     ],
//     "referenceSolution": [
//         {
//             "language": "C++",
//             "completeCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b;\n    return 0;\n}"
//         },
//         {
//             "language": "Java",
//             "completeCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}"
//         },
//         {
//             "language": "JavaScript",
//             "completeCode": "const input = require('fs').readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\nconsole.log(a + b);"
//         }
//     ]
// }


// #include<iostream>
// using namespace std;

// int main(){
//     int a,b;
//     cin>>a>>b;
//     cout<<a+b;
//     return 0;
// }
// const readlinesync=require('readline-sync');
// const input=readlinesync.question("add two numbers");

// input.trim();
// const arr = input.split(' ').map((num)=>parseInt(num));

// console.log(arr[0] + arr[1]);


// const user = await User.findById(req.user._id)
//       .populate({
//         path: 'problemSolved',
//         select: 'title difficulty tags createdAt', // Select needed fields
//       });





// 

// userSchema.post('findOneAndDelete', async function (doc) {
//     if (doc) {
//       await mongoose.model('submission').deleteMany({ userId: doc._id });
//     }
// });




// submissionSchema.index({userId:1,problemId:1});








// const redisClient = require('./redisClient');

// const submitCodeRateLimiter = async (req, res, next) => {
//   const userId = req.result._id; 
//   const redisKey = `submit_cooldown:${userId}`;

//   try {
//     // Check if user has a recent submission
//     const exists = await redisClient.exists(redisKey);
    
//     if (exists) {
//       return res.status(429).json({
//         error: 'Please wait 10 seconds before submitting again'
//       });
//     }

//     // Set cooldown period
//     await redisClient.set(redisKey, 'cooldown_active', {
//       EX: 10, // Expire after 10 seconds
//       NX: true // Only set if not exists
//     });

//     next();
//   } catch (error) {
//     console.error('Rate limiter error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = submitCodeRateLimiter;


const obj={
    count:2,
}

obj.count+=1;

console.log(obj);

// #include <iostream>
// using namespace std;
// int main() {
//    return 0;
// }

// #include <iostream>
// using namespace std;
// int main() {
// int a, b;
// cin >> a >> b;
// cout << a + b;
//  return 0;
// }

// import java.util.Scanner;
// public class Main {
//  public static void main(String[] args) {

// }
// }

// import java.util.Scanner;
// public class Main {
//    public static void main(String[] args) {
//  Scanner sc = new Scanner(System.in);
//       int a = sc.nextInt();
//      int b = sc.nextInt();
//       System.out.println(a + b);
//  }
// }

// const readline = require('readline');
// // Complete input handling here

// const readline = require("readline");

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question("Enter two numbers separated by space: ", (input) => {
//   const [a, b] = input.split(" ").map(Number); // Convert strings to numbers
//   const sum = a + b;
//   console.log("Sum:", sum);
//   rl.close();
// }); 