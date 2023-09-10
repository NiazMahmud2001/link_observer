//imports 
import * as http from "http";
import * as https from "https";
import * as url from "url";
import * as util from "../helpers/utilities.js";
import * as fsControl from "../lib/data.js";

//scaffolding
export const worker = {};

//code
worker.gatherAllChecks = (obj , callback) => {

   var phone = typeof(obj.body.phone)==="string" && obj.body.phone.trim().length == 13 ? obj.body.phone : false ; 

   var token = typeof(obj.body.token) === "string" && obj.body.token.trim().length == 20 ? obj.body.token : false ;

      if(phone && token ){
         fsControl.lib.read("token" , `${token}.json` ,(err , data)=>{
            if(err){
               callback(404 , {
                  error: "invalid token !!!"
               })
            }else{
               var temp_data = util.utilities.parseJSON(data);
               //@TODO : change "<" to ">"
               if(temp_data.expire < Date.now()){
                  var temp_phone = temp_data.phone ;
                  //console.log(temp_phone);
                  fsControl.lib.read(`users/${temp_phone}` , `${temp_phone}.json` , (err2 , data2)=>{
                     if(err2){
                        callback(405 , {
                           error : "User not found!!!"
                        })
                     }else{
                        var temp_data3 = util.utilities.parseJSON(data2).checks;
                        setInterval(() => {
                           temp_data3.forEach((element)=>{
                              //console.log(temp_data3);
                              fsControl.lib.read("checks" , `${element}.json` , (err3 , data3)=>{
                                 if(err3){
                                    console.log("can't read the checks file!!!")
                                 }else{
                                    /////////////////////////////===>>>>>>>>>>>>
                                    var temp_option = util.utilities.parseJSON(data3);
                                    //console.log(temp_option.url);
                                    var temp_url = temp_option.url ;
                                    var parse_url = url.parse(temp_url , true).path;
                                    var slash_index = parse_url.indexOf("/") ;

                                    if(slash_index > -1){
                                       var link_host = parse_url.slice(0 , slash_index) ;
                                       var link_path = parse_url.slice(slash_index+1  , slash_index.length);
                                       //console.log("link_path: " + link_path);
                                       //console.log(link_host + "   " + link_path); 

                                       var options = {
                                          host: link_host,
                                          port: 443,
                                          path: "/"+link_path,
                                          method: 'GET' , 
                                          timeout: 5000 
                                        };

                                        var protocolToUse = temp_option.protocol ==="http" ? http : https ;
                                        
                                        var req = protocolToUse.request(options, function(res) {
                                          //console.log(res);
                                          console.log("statusCode==1: ", res.statusCode);
                                          //console.log(temp_option);
                                          if(res.statusCode<400){
                                             if(temp_option.status == "down"){
                                                temp_option.status = "up";
                                                fsControl.lib.update("checks" , `${temp_option. check_token}.json` , temp_option , (err)=>{
                                                   if(err){
                                                      console.log(temp_option.check_token + "file can't be updated!!!");
                                                   }
                                                })
                                                console.log(temp_option.url + "status: " + "Changes in status : " + temp_option.status)
                                             }else{
                                                console.log(temp_option.url +"no change status:" + temp_option.status)
                                             }
                                          }else{
                                             console.log(temp_option.url +"no change status:" + temp_option.status)
                                          }

                                          //console.log("headers: ", res.headers);
                                          /*res.on('data', function(d) {
                                            process.stdout.write(d);
                                          });*/
                                        });
                                        req.end();
                                        
                                        req.on('error', function(e) {
                                          //console.log("error link!!!");
                                          
                                          if(temp_option.status == "up"){
                                             temp_option.status = "down";
                                             fsControl.lib.update("checks" , `${temp_option. check_token}.json` , temp_option , (err)=>{
                                                if(err){
                                                   console.log(temp_option.check_token + "file can't be updated!!!");
                                                }
                                             })
                                             console.log(temp_option.url +"Changes in status : " + temp_option.status);
                                          }else{
                                             console.log(temp_option.url +"no change status:" + temp_option.status);
                                          }
                                        });

                                        req.on("timeout" , (err)=>{
                                          if(err){
                                             //console.log("timeout error");

                                             if(temp_option.status == "up"){
                                                temp_option.status = "down";
                                                fsControl.lib.update("checks" , `${temp_option. check_token}.json` , temp_option , (err)=>{
                                                   if(err){
                                                      console.log(temp_option.check_token + "file can't be updated!!!");
                                                   }
                                                })
                                                console.log(temp_option.url +"Changes in status : " + temp_option.status);
                                             }else{
                                                console.log(temp_option.url +"no change status:" + temp_option.status);
                                             }
                                          }
                                       })
                                       req.setTimeout(5000);

                                    }else if(slash_index == -1){
                                       var options = {
                                          host: parse_url,
                                          port: 443,
                                          path: '/',
                                          method: 'GET' , 
                                          timeout: 5000 
                                        };

                                        var protocolToUse = temp_option.protocol === "http" ? http : https ;
                                        
                                        var req = protocolToUse.request(options, function(res) {
                                          //console.log(res);
                                          console.log("statusCode==2: ", res.statusCode);
                                          //console.log(temp_option);
                                          
                                          if(res.statusCode<400){
                                             if(temp_option.status == "down"){
                                                temp_option.status = "up";
                                                fsControl.lib.update("checks" , `${temp_option. check_token}.json` , temp_option , (err)=>{
                                                   if(err){
                                                      console.log(temp_option.check_token + "file can't be updated!!!");
                                                   }
                                                })
                                                console.log(temp_option.url +"Changes in status : " + temp_option.status)
                                             }else{
                                                console.log(temp_option.url +"no change status:" + temp_option.status)
                                             }
                                          }else{
                                             console.log(temp_option.url +"no change status:" + temp_option.status + res.statusCode)
                                          }
                                          
                                          /*console.log("headers: ", res.headers);
                                          /*res.on('data', function(d) {
                                            process.stdout.write(d);
                                          });*/
                                        });
                                        req.end();
                                        
                                        req.on('error', function(e) {
                                          console.log("error link!!!");

                                          if(temp_option.status == "up"){
                                             temp_option.status = "down";
                                             fsControl.lib.update("checks" , `${temp_option. check_token}.json` , temp_option , (err)=>{
                                                if(err){
                                                   console.log(temp_option.check_token + "file can't be updated!!!");
                                                }
                                             })
                                             console.log(temp_option.url +"Changes in status : " + temp_option.status);
                                          }else{
                                             console.log(temp_option.url +"no change status:" + temp_option.status);
                                          }
                                        });
                                        req.on('timeout' , (err)=>{
                                          if(err){
                                             console.log("timeout error");

                                             if(temp_option.status == "up"){
                                                temp_option.status = "down";
                                                fsControl.lib.update("checks" , `${temp_option. check_token}.json` , temp_option , (err)=>{
                                                   if(err){
                                                      console.log(temp_option.check_token + "file can't be updated!!!");
                                                   }
                                                })
                                                console.log(temp_option.url +"Changes in status : " + temp_option.status);
                                             }else{
                                                console.log(temp_option.url +"no change status:" + temp_option.status);
                                             }
                                          }
                                       })
                                       req.setTimeout(10000);
                                    }
                                 }
                              })
                           })
                        }, 7000);
                        callback(200 , {
                           message : "Watching link"
                        })
                     }
                  })
               }else{
                  callback(400 , {
                     error : "token expired!!!"
                  })
               }
            }
         })
      }else{
         callback(400 , {
            error: "invalid phone or token !!!"
         })
      }

}

worker.init = (obj , callback)=>{
   worker.gatherAllChecks(obj , callback);
}