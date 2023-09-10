//imports 

//scaffolding 
export const environments = {};

environments.staging = {
   port: 4000,
   envName:"Staging",
   secretKey:"abcdefgh",
   twilio_sid : "AC747504406de44a0aa1753c5730897a16" , 
   twilio_auth_token : "bc5e1fc28d3687b354965331a850ff06",
};

environments.production = {
   port: 5000,
   envName: "Production",
   secretKey: "ijklmnopq",
   twilio_sid : "AC747504406de44a0aa1753c5730897a16" , 
   twilio_auth_token : "bc5e1fc28d3687b354965331a850ff06"
};

environments.currentEnvironment = typeof(process.env.NODE_ENV) === "string" ? process.env.NODE_ENV : "staging"; //returns staring

environments.envToExport = typeof(environments[environments.currentEnvironment])==="object"? environments[environments.currentEnvironment] : environments["staging"]; //return object 





