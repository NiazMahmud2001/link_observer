//token create ar jonno request asba "body" theke
//imports 
import * as util from "../helpers/utilities.js";
import * as fsControl from "../lib/data.js";
//objects
export const handler = {};
 
//another scaffolding for holding "get,post,put,delete"
handler._token = {};

handler.tokenHandler = (obj , callback)=>{
   //console.log(obj);
   const acceptedMethod = ['get' , 'post' , 'put' , 'delete']
   if(acceptedMethod.indexOf(obj.method)> -1){
      handler._token[obj.method](obj , callback);
   }else{
      callback(404 , {
         message:"you are not allowed"
       })
   }
}

handler._token.get = (obj , callback)=>{
   //token id ta query string dea input nibo and oi token id related total json file ta return kore dibo

   /*
   *url a ==>>
   http://localhost:4000/token?token=an4YfyoPSq5QHTvrKL
   */
   var token = typeof(obj.queryStringObject.token)==="string" && obj.queryStringObject.token.length===20 ?obj.queryStringObject.token : false ; 

   if(token){
      fsControl.lib.read(`token` , `${token}.json` , (err , data)=>{
         if(err){
            callback(504 , {
               message:"User not found"
            });
         }else{
            var temp_data = JSON.parse(data); 
            //console.log(temp_data);  
            callback(200 ,temp_data);
         }
      })
   }else{
      callback(404 , {
         error:"invalid token!!!"
      })
   }
}
handler._token.post = (obj , callback)=>{
   //ar jonno body te input nibo ... and input hisaba body te "phone, password" 

   /*
   *url a ==>> http://localhost:4000/post
   *body te==>>
   {
      "phone" : "+971521809005" ,
      "password" : "12345"
   }
   */

   const phone = typeof(obj.body.phone)==="string" && obj.body.phone.trim().length== 13 ? obj.body.phone : false; 
   var password  = typeof(obj.body.password) === "string" && obj.body.password.trim().length>0 ? obj.body.password : false;

   password = util.utilities.hash(password);

   if(phone && password){
      fsControl.lib.read(`users/${phone}` , `${phone}.json` , (err ,data)=>{
         if(err){
            callback(404, {
               error:"user not registered",
            });
         }else{
            var data_cont = JSON.parse(data);
            console.log(data_cont)
            if(phone==data_cont.phone && password == data_cont.password){
               //console.log(util.utilities.generate_token(20));
               const temp_tok = {
                  phone , 
                  password , 
                  token: util.utilities.generate_token(20),
                  expire:Date.now()+(60*60*1000),
               };

               fsControl.lib.createFile(`token` , `${temp_tok.token}.json` , temp_tok , (err)=>{
                  if(err){
                     callback(404 , {
                        error:"file cant be created",
                     })
                  }else{
                     callback(200 , temp_tok);
                  };
               })
            }else if(phone!=data_cont.phone && password == data_cont.password){
               callback(504 , {
                  message : "wrong phone number!!!",
               })
            }else if(phone!=data_cont.phone && password != data_cont.password){
               callback(504 , {
                  message : "wrong phone number and password!!!",
               })
            }else{
               callback(504 , {
                  message : "wrong password!!!",
               })
            }
         }
      })
   }else{
      callback(504 , {
         message : "phone number must be 13 digit",
      })
   }
}
handler._token.put = (obj , callback)=>{
   //aita te ==>> input nebo "body" te input nebo
   //input a : token(string) id and expand(boolean) nebo
   //if expand(boolean)==true then oi token ar expiry time 1 hour extend hobe
   /*
   ex: url: http://localhost:4000/token 
   body: {
            "token": "an4YfyoPSq5QHTvrKL" , 
            "extend": true
         }
   */

   var token = typeof(obj.body.token) === "string" && obj.body.token.length===20 ? obj.body.token : false;
   var extend = typeof(obj.body.extend) === "boolean" ? obj.body.extend : false;

   if(token && extend){ 
      fsControl.lib.read(`token` , `${token}.json` , (err , data)=>{
         if(err){
            callback(505 , {
               error:"User not found!!!"
            })
         }else{
            var temp_data = util.utilities.parseJSON(data);

            if(temp_data.expire>Date.now()){
               temp_data.expire = temp_data.expire + (60*60*1000);
               fsControl.lib.update("token" , `${token}.json` , temp_data , (err)=>{
                  if(err){
                     callback(404 , {
                        error :"user is not registered!!!"
                     })
                  }else{
                     callback(200 , temp_data);
                  }
               })
            }else{
               callback(404 , {
                  error:"Token has expired!!!"
               })
            }
         }
      })
   }else{
      callback(505 , {
         error:"invalid token or extend request"
      })
   }


}
handler._token.delete = (obj , callback)=>{
   //aita url a "token" nibe and oi particular token k delete kore dibe

   var token = typeof(obj.queryStringObject.token)==="string" && obj.queryStringObject.token.length===20 ? obj.queryStringObject.token : false;

   if(token){
      fsControl.lib.removeFile(`token` , `${token}.json` , (err)=>{
         if(err){
            callback(404 , {
               error:"user token is not available!!!"
            })
         }else{
            callback(200 , {
               message :"user token deleted successfully"
            });
         };
      });
   }else{
      callback(404 , {
         error: "Invalid token!!!"
      })
   }
}
handler._token.token_varify = (toks , phone , callback)=>{
   var token = typeof(toks)==="string" && toks.trim().length===20 ? toks:false;

   if(token){
      fsControl.lib.read(`token` , `${token}.json` , (err , data)=>{
         if(err){
            callback(false , {
               message:"user does not exists!!!"
            });
         }else{
            var parsed_token_data = util.utilities.parseJSON(data);
            //console.log(parsed_token_data);
            //console.log(phone);
            if(parsed_token_data.phone === phone && parsed_token_data.expire>Date.now()){
               callback(true);
            }else if(parsed_token_data.phone != phone){
               callback(false , {
                  message :"Wrong phone number!!!"
               });
            }else if(parsed_token_data.expire<=Date.now()){
               callback(false , {
                  message :"Token expired!!!"
               });
            }else{
               callback(false , {
                  message :"Wrong phone number and token expired!!!"
               });
            }
         }
      })
   }else{
      callback(false , {
         message:"Invalid token!!!"
      });
   }
};