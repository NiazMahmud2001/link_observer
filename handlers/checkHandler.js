//import 
import * as util from "../helpers/utilities.js";
import * as fsControl from "../lib/data.js";

//scaffolding
export const handler = {};
 
//another scaffolding for holding "get,post,put,delete"
handler._check = {};

handler.userHandler = (obj , callback)=>{
   //console.log(obj);
   const acceptedMethod = ['get' , 'post' , 'put' , 'delete']
   if(acceptedMethod.indexOf(obj.method)> -1){
      handler._check[obj.method](obj , callback);
   }else{
      callback(404 , {
         message:"you are not allowed"
       })
   }
}

handler._check.post = (obj  , callback)=>{
   /*
   *url a ==>> http://localhost:4000/checks
   *body te ===>>
   {
      "protocol" : "https",
      "url" : "www.geeksforgeeks.org",
      "method": "post", 
      "successCode": [200 , 201 , 202 , 230], 
      "timeoutSecond" : 5
   }
   *and header a 
   key                                value
   token                           pVBfcZyJSJosKsQk9uKY
   */
   var protocol = typeof(obj.body.protocol)==="string" && ["http" , "https"].indexOf(obj.body.protocol)>-1 ? obj.body.protocol : false ; 

   var url = typeof(obj.body.url)==="string" && obj.body.url.trim().length>0 ? obj.body.url : false ;

   var method = typeof(obj.body.method)==="string" && ['get' , "post" , "put" , "delete"].indexOf(obj.body.method.trim().toLowerCase())>-1 ?obj.body.method.trim().toLowerCase():false ;

   var successCode = typeof(obj.body.successCode)==="object" && obj.body.successCode instanceof Array ? obj.body.successCode : false ;

   var timeoutSecond = typeof(obj.body.timeoutSecond)==="number" && obj.body.timeoutSecond % 1 === 0 && obj.body.timeoutSecond>=1 && obj.body.timeoutSecond<=5 ? obj.body.timeoutSecond : false ;

   console.log(protocol + " " + url + " " + method + " " + successCode + " " + timeoutSecond) ; 
   
   if(protocol && url && method && successCode && timeoutSecond) {
      //header dea token input dite hobe
      var token = typeof(obj.headerObject.token)==="string" && obj.headerObject.token.trim().length == 20 ? obj.headerObject.token : false ;

      if(token){
         fsControl.lib.read(`token` , `${token}.json` , (err , data)=>{
            if(err){
               callback(505 , {
                  error : "invalid token!!!" ,
               })
            }else{
               var parsed_data = util.utilities.parseJSON(data) ;
               var parse_phone = parsed_data.phone ;
               var exp_time = parsed_data.expire;
               //console.log(exp_time + " " + parse_phone);

               if(exp_time>Date.now()){
                  fsControl.lib.read(`users/${parse_phone}` , `${parse_phone}.json` , (err1 , data1)=>{
                     if(err1){
                        callback(505 , {
                           error: "user doesn't exists!!!"
                        })
                     }else{
                        var read_parse = util.utilities.parseJSON(data1) ;
                        var check_id  = util.utilities.generate_token(20);
                        console.log(read_parse);

                        var temp_obj = {
                           check_token : check_id ,
                           phone: read_parse.phone,
                           protocol , 
                           url , 
                           method , 
                           successCode , 
                           timeoutSecond,
                           status: "down"
                        };

                        var push_arr = typeof(read_parse.checks)==="object" && read_parse.checks instanceof Array ? read_parse.checks : [];

                        if(push_arr.length<=5){
                           push_arr.push(check_id);
                           read_parse.checks = push_arr;

                           fsControl.lib.update(`users/${parse_phone}` , `${parse_phone}.json` , read_parse ,(err2)=>{
                              if(err2){
                                 callback(400 , {
                                    error:"error while update users file!!!"
                                 })
                              }else{
                                 console.log(temp_obj);
                                 fsControl.lib.createFile(`checks` , `${check_id}.json` , temp_obj , (err3)=>{
                                    if(err3) {
                                       callback(404 , {
                                          error :"checks file can't be created!!!"
                                       })
                                    }else{
                                       callback(404 , {
                                          error :"Congratulations, check added"
                                       })
                                    }
                                 })
                              }
                           })
                        }else{
                           callback(404 , {
                              message : "You fot the maximum number of checks" ,
                           })
                        }

                     }
                  });
               }else{
                  callback(403 , {
                     message : "Your token expired!!!" ,
                  })
               }
            }
         })
      }else{
         callback(404 , {
            error:"invalid token 1!!!"
         })
      }

   }else{
      callback(505 , {
         error:"Error data in body!!!",
      })
   }
};
handler._check.get = (obj , callback)=>{
   /*
   *url/query te: ====>>
   http://localhost:4000/checks?check_token=53qwaoyYWhZ0NrBTvCtF

   *header object a: ===>>>
    key                           value
   token                    2DtuPmkzQ5BeM3piCEQy
   */
   var check_id = typeof(obj.queryStringObject.check_token)=="string" && obj.queryStringObject.check_token.trim().length>0 ? obj.queryStringObject.check_token : false ; 

   var token = typeof(obj.headerObject.token)==="string" && obj.headerObject.token.trim().length>0 ? obj.headerObject.token : false ;
   //console.log(token + " " + check_id);
   
   if(check_id && token){
      fsControl.lib.read(`token` , `${token}.json` , (err , data)=>{
         if(err){
            callback(404 , {
               error : "invalid token!!!"
            })
         }else{
            var temp_data =  util.utilities.parseJSON(data);
            if(temp_data.expire>Date.now()){
               fsControl.lib.read(`checks` , `${check_id}.json` , (err1 , data1)=>{
                  if(err1){
                     callback(404 , {
                        error : "No checks available!!!"
                     })
                  }else{
                     var temp_check = util.utilities.parseJSON(data1);
                     if(temp_data.phone === temp_check.phone){
                        callback(200 ,temp_check);
                     }else{
                        callback(200 , {
                           error : "invalid token and check id!!!"
                        })
                     }
                  }
               })
            }else{
               callback(505 , {
                  error : "token expired!!!"
               })
            }
         }
      })
   }else if(check_id==true && token==false){
      callback(505 , {
         error : "token is invalid!!!"
      })
   }else if(check_id==false && token==false){
      callback(505 , {
         error : "check id is invalid!!!"
      })
   }else{
      callback(505 , {
         error : "token and check id are invalid!!!"
      })
   }
};
handler._check.put = (obj , callback)=>{
   /*
    * no need to use : headerObj and query use kora lagbe nah
    *body te::====>
   {
      "check_token": "f9tPkC1Y0id6Kk9SGFqd",
      "protocol" : "https",
      "url" : "animejsssasd.com",
      "method": "post", 
      "successCode": [200 , 201 , 202 , 209], 
      "timeoutSecond" : 5
   }
    */
   var check_token = typeof(obj.body.check_token)==="string" && obj.body.check_token.trim().length==20 ? obj.body.check_token : false;

   if(check_token){
      fsControl.lib.read(`checks` , `${check_token}.json` , (err , data)=>{
         if(err){
            callback(404 , {
               error : "checks not yet created !!!"
            })
         }else{
            var parsed_check = util.utilities.parseJSON(data);

            var protocol = typeof(obj.body.protocol)==="string" && ["https" , "http"].indexOf(obj.body.protocol)>-1 ? obj.body.protocol : false;

            var url = typeof(obj.body.url)==="string" && obj.body.url.trim().length>0 ? obj.body.url : false;

            var method = typeof(obj.body.method)==="string" && ["post" , "get" , "put" ,"delete"].indexOf(obj.body.method.trim().toLowerCase())>-1 ? obj.body.method:false ;

            var successCode = typeof(obj.body.successCode)==="object" && obj.body.successCode instanceof Array ? obj.body.successCode : false;

            var timeoutSecond  = typeof(obj.body.timeoutSecond)==="number" && obj.body.timeoutSecond>0 &&obj.body.timeoutSecond<=5 && obj.body.timeoutSecond%1==0 ? obj.body.timeoutSecond : false ;

            console.log(parsed_check);

            if(protocol || url || method || successCode || timeoutSecond){
               var temp_check_obj = {
                  token: parsed_check.check_token , 
                  phone : parsed_check.phone ,
                  protocol,
                  url,
                  method,
                  successCode,
                  timeoutSecond
               };
               fsControl.lib.update(`checks` , `${check_token}.json` , temp_check_obj , (err)=>{
                  if(err){
                     callback(404 , {
                        error : "Check is not created in this Check token !!!"
                     })
                  }else{
                     callback(200 , {
                        error : "Check  successfully updated!!!"
                     })
                  }
               })
            }else{
               callback(303 , {
                  message : "Please input data for update the check "
               })
            }
         }
      })
   }else{
      callback(404 , {
         error : "Invalid check ID !!!"
      })
   }
};
handler._check.delete = (obj , callback)=>{
   /*
   *just url a "queryStringObject" ar jake delete korte chao tar "check_token" pass koro
   *http://localhost:4000/checks?check_token=eF6fiWw9mRy2hYA7d9AO
   */
   var check_token = typeof(obj.queryStringObject.check_token)==="string" && obj.queryStringObject.check_token.trim().length==20 ? obj.queryStringObject.check_token : false ; 

   if(check_token){
      fsControl.lib.read(`checks` , `${check_token}.json` , (err , data)=>{
         if(err){
            callback(401 , {
               error: "check is not available on this check token!!!"
            })
         }else{
            var parsed_check_data = util.utilities.parseJSON(data);
            fsControl.lib.removeFile(`checks` , `${check_token}.json` , (err1)=>{
               if(err1){
                  callback(402 , {
                     error: "File doesn't exists!!!"
                  })
               }else{
                  var parsed_phone = parsed_check_data.phone;
                  console.log(parsed_phone);
                  fsControl.lib.read(`users/${parsed_phone}` , `${parsed_phone}.json` , (err2 , data2)=>{
                     if(err2){
                        callback(404 , {
                           error: "File doesn't exists!!!"
                        })
                     }else{
                        var parsed_user = util.utilities.parseJSON(data2);
                        var remove_index = parsed_user.checks.indexOf(check_token);
                        parsed_user.checks.splice(remove_index, remove_index+1);
                        
                        fsControl.lib.update(`users/${parsed_phone}` , `${parsed_phone}.json` , parsed_user , (err)=>{
                           if(err){
                              callback(405 , {
                                 error: "users file failed to update !!!"
                              }) 
                           }else{
                              callback(200 , {
                                 message: "users file updated and check file deleted successfully",
                              })
                           }
                        })
                     }
                  })
               }
            });
         }
      })
   }else{
      callback(400 , {
         error: "invalid token!!!`"
      })
   }

};
