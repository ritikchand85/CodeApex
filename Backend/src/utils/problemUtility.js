//axios is similar to fetch but it has some more advantages when we make fetch request we get response in json format and we have to convert it 
//in Jvascript object using response.json() but if we are making request using axios then we don't have to convert axios converts it for us

/*2. Error Handling
Axios: Treats HTTP errors (4xx/5xx) as rejected promises
try {
  await axios.get('/api/invalid');
} catch (error) {
  // Automatically catches 404/500 errors
}


Fetch: Only rejects on network failures (not HTTP errors)

const response = await fetch('/api/invalid');
 // Manual check needed
if (!response.ok) throw new Error('HTTP error');
*/


const axios=require('axios');

const getLanguageById=(lang)=>{
    //judge0 me har language ko ek id mili hai and hame language id hi request ke 
    //time par bhejni hoti hai
    const language={
        "c++":54,
        "java":62,
        "javascript":63
    }

    return language[lang.toLowerCase()];
}

const submitBatch=async(submissions)=>{

 
    const options = {
  method: 'POST',
  
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    //base64_encoded hamne false isliye rakha hai kyunki hum source code ko directly bhej rahe bina encoding ke
    base64_encoded: 'false'
  },
  headers: {
    //judge0 ki api key dalni hogi
    // 'x-rapidapi-key': 'ab99c6ec42mshfd636ec7c6687efp1b9043jsna684835b0591',
      // 60cdeba85amsh654ce8747a545c9p1b8e3ajsn4ce87adfd3af
       'x-rapidapi-key':process.env.JUDGE0_API_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    //submissions array jo hame input me mila hai
    submissions
  }
};

async function fetchData() {
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

 return await fetchData();

}


const waiting = async(timer)=>{
  setTimeout(()=>{
    return 1;
  },timer);
}


// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]



const submitToken = async(resultToken)=>{

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    //resultToken.join(",") array ko string me convert kar dega comma separated
    tokens: resultToken.join(","),
    base64_encoded: 'true',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_API_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }

  
  
};

async function fetchData() {
  
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
       console.log(error);
      
    }
}


 while(true){

 const result =  await fetchData();
 

  //status_id<3 ka matlab hota hai judge0 ne abhitak hmari request ko complete nhi kiya hai,request processing me hai ya to queuing me 
  //status_id==3 accepted hota hai 
  //status_id>3 me bhut saari errors like runtime,compile time hum judge0 ki documentation me dekh sakte hai ye
  const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

  if(IsResultObtained)
    return result.submissions;

  //agar resultobtained false hai means request processing ya queuing me hai to dubara thoda time lekar request maaro
  //thode time ko manage ke liye hamne settimeout use kiya hai
  //dubara request maarne ke liye while loop

  
  await waiting(1000);
}



}


module.exports = {getLanguageById,submitBatch,submitToken};



