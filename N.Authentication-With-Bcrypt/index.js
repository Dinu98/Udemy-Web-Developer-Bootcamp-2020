const bcrypt = require('bcrypt');


const hashPass = async (pass) =>{
    const hash = await bcrypt.hash(pass, 12);
    console.log(hash);
};

const verifyPass = async (pass) => {
    const result = await bcrypt.compare(pass,"$2b$12$biT1RFf9Avd5CRyyWUdLYubR.6tfeAzwg8lNxLafwh0z8R1QCKmCa");
    if(result){
        console.log("Successfully logged in");
    } else {
        console.log("Incorrect password");
    }
};

hashPass("123456");
verifyPass("1234566");