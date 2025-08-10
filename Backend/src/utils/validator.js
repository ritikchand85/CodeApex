const validator =require("validator");

// req.body 

const validate = (data)=>{
  
    const mandatoryField = ['firstName',"emailId",'password'];
    //isAllowed is boolean and it returns false if any k is not present in array of keys of data
    const IsAllowed = mandatoryField.every((k)=> Object.keys(data).includes(k));
    
    if(!IsAllowed)
        throw new Error("Some Field Missing");

    if(!validator.isEmail(data.emailId))
        throw new Error("Invalid Email");

    if(!validator.isStrongPassword(data.password))
        throw new Error("Week Password");
}

module.exports = validate;