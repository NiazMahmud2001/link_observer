import { StringDecoder } from "node:string_decoder";
import * as url from "url";
import * as notFound from "../handlers/notFound.js";
import * as util from "../helpers/utilities.js";
import * as rt from "../routes.js";

export var handler = {};

handler.handleRecRes = (req , res)=>{
   const parsedUrl = url.parse(req.url , true);
   let path = parsedUrl.pathname;
   //console.log(parsedUrl);

   if(path[0] == "/"){
      path = path.slice(1);
   };
   if(path[path.length-1] == "/"){
      path = path.slice(0 , path.length-1);
   } ;
   //console.log(path);

   var method = req.method.toLowerCase();//get/post/put/delete etc.
   var queryStringObject = parsedUrl.query;
   var headerObject = req.headers;
   //console.log(method);
   //console.log(queryStringObject);
   //console.log(headerObject);

   var decoder = new StringDecoder("utf-8");
   let realData = "";

   var requestProperties = {
      parsedUrl,
      path, 
      method,
      queryStringObject,
      headerObject
   };

   var chosenHandler = rt.router[path]? rt.router[path] : notFound.notFound.notFoundHandler;


   req.on("data", (chunk) => {
      realData += decoder.write(chunk);
      //it decodes "chunk" and adds to "realData"
      //that chunks are coming from "postman body" part 
   });
   
   req.on("end", ()=>{
      realData += decoder.end();

      requestProperties.body = util.utilities.parseJSON(realData);
      
      chosenHandler(requestProperties , (statusCode , payload)=>{
         //under checking the parameter  
         statusCode = typeof(statusCode) === "number" ? statusCode : 500;
         payload = typeof(payload) ==="object"? payload : {};
   
         const payload_stringify = JSON.stringify(payload);
         res.setHeader("Content-Type", "application/json");//convert and sends data in "json" format
         res.writeHead(statusCode);
         res.write(payload_stringify);
         
         res.end();
      });
      
      //console.log(realData); //"postman" ar body te data write korle 
   })
};