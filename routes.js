/*
*Routes: jump over one page to another
*/
import * as checkFile from "./handlers/checkHandler.js";
import * as sampHand from "./handlers/sampleHandler.js";
import * as tokens from "./handlers/tokenHandler.js";
import * as uHandler from "./handlers/userHandler.js";
import * as workers from "./lib/worker.js";


export const router = {
   //akhane "sample" are paths
   "sample" : sampHand.handler.sampleHandler,
   "user" : uHandler.handler.userHandler,
   "token" : tokens.handler.tokenHandler,
   "checks" : checkFile.handler.userHandler,
   "watch_link" : workers.worker.init , 
};




