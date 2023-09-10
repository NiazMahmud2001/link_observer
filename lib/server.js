/*
* Description: A restful API to monitor up and down time for user define links
*/

//import 
import * as http from "node:http";
import * as env from "../helpers/environment.js";
import * as folder1 from "../helpers/handleReqRes.js";
//import * as notify from "./helpers/notification.js";
//import * as libs from "./lib/data.js";
//console.log(url);

//scaffolding object
export const app = {};

app.config = {
   port: "4000",
};

app.handleFile = () => {
   //****==> create a file
   /*libs.lib.create("test" , "test.json" , {"name": "niaz" , "roll": "01", "func":"()=>{console.log('hello json')}" } , function(a){
      console.log(a);
   })*/

   //****==>remove(delete) file after setTimeout
   /*setTimeout(function(){
      libs.lib.remove("test");
   } ,10000)*/

   //****==>read file
   /*var aa = libs.lib.read("test" , "test.json" , (a)=>{
      console.log(a);
   });
   console.log(aa);*/

   //****==>update file
   /*libs.lib.update("test" , "test.json" , {"name": "niaz" , "id":"00222"}, (a)=>{
      console.log(a);
   });
   var bb = libs.lib.read("test" , "test.json" , (a)=>{
      console.log(a);
   });
   console.log(bb);*/

   //libs.lib.remove("test");
}  

app.createServer = ()=>{
   /*notify.sendApp.sendWhatsapp([
      { phone: '+971521809001', name: 'Niaz', group: 'friend'  , msg:"hi.whats going all"}, 
      { phone: '+971554656178', name: 'Abdul', group: 'customer', msg:"hr. New Offer available"},
      { phone: '+971521809001', name: 'Karama', group: 'customer', msg:"hr. New Offer available"},
      { phone: '+971521809001', name: 'Madam', group: 'customer', msg:"hr. New Offer available"},
   ]);*/
   /*notify.sendApp.sendEmail("u21102204@sharjah.ac.ae", "this is subject" , "1 message" , (err)=>{
      if(err){
         console.log(err);
      }else{
         console.log("no error happens!!!");
      }
   })*/

   const server = http.createServer(app.handleRequest);
   server.listen(env.environments.envToExport.port , ()=>{
      
      console.log(env.environments.envToExport.envName);
      //call: npm run nodemon/start/production
      console.log("listening to http://localhost:"+env.environments.envToExport.port);
   });
};

app.handleRequest = folder1.handler.handleRecRes;