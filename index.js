/*
* Description: A restful API to monitor up and down time for user define links
*/

//import 
import * as apps from "./lib/server.js";
//import * as workers from "./lib/worker.js";
//import * as libs from "./lib/data.js";


//scaffolding object
const app = {};


app.init = ()=>{
   //apps.app.handleFile();
   apps.app.createServer();
}
app.init();






