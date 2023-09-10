//ai file ta: request ar body te tomi ja "json" data send korba ta "handleReqRes.js" ar "req.on('end')" part a "realData" k json to js object a convert korbo 

//import
import * as crypto from "node:crypto";
import * as env_file from "../helpers/environment.js";


//scaffolding
export const utilities = {};

utilities.parseJSON = (jsonString)=>{
   var output;
   try{
      //console.log("asdnf asdf : ==>> " + jsonString);
      output = JSON.parse(jsonString);
      //console.log("asdnf asasdasdfadsfdf : ==>> " + output.firstName);
   }catch{
      output = {};
   }
   return output;
}

utilities.hash = (dataStr)=>{
   //incripting password
   if(typeof(dataStr)==="string" && dataStr.length>0){
      const hash = crypto.createHmac("sha256", env_file.environments.envToExport.secretKey).update(dataStr).digest("hex");
      return hash;
   }else{
      return false;
   }
}

utilities.generate_token = (tok_len)=>{
   var token_length = tok_len;
   let letter = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

   var toks="";
   if(token_length>=letter.length){
      token_length = letter.length-1;
   }
   for(let i=0 ; i<token_length ; i++){
      var rand = Math.floor(Math.random() * letter.length);
      toks+=letter[rand];
   };
   return toks;
}