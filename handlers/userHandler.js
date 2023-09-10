//Routes component
//imports 
import * as util from "../helpers/utilities.js";
import * as fsControl from "../lib/data.js";
import * as tokenVarify from "./tokenHandler.js";
//objects
export const handler = {};
 
//another scaffolding for holding "get,post,put,delete"
handler._users = {};

handler.userHandler = (obj , callback)=>{
   //console.log(obj);
   const acceptedMethod = ['get' , 'post' , 'put' , 'delete']
   if(acceptedMethod.indexOf(obj.method)> -1){
      handler._users[obj.method](obj , callback);
      //console.log("asdfasdfasdfasdfasd  assdfasdf asdfv");
      //console.log(obj);
   }else{
      callback(404 , {
         message:"you are not allowed"
       })
   }
}

handler._users.get = (obj , callback)=>{
   //1st a : "handler._users.get()" use korar jonno user registration(handler._users.post()) kore then token create koro using(handler._token.post()) then nxt process a jao
   //aitar kaj holo : search bar a  "query string" pass kore data get kora  ex: 
   //http://localhost:4000/user?phone=+971521809001 
   //"?" theke and ar por part tuku holo query string
   //ai query string paba => "req.query" theke
   //then ==>> header a token dite hobe
   //ex: postman header a ====>>> "key=token"  and "id=token" number pass korte hobe(within valid time)
   /*
   url a ==>>
   http://localhost:4000/user?phone=+971521809001

   header a ==>> 
   key                  token
   token            vFXGbUzgT8OydXBu0kqi
   */

   //console.log(obj.queryStringObject) 

   var phone = typeof(obj.queryStringObject.phone) == "string" && obj.queryStringObject.phone.trim().length==12 ? obj.queryStringObject.phone.trim() : false;//query string a "+" read hoy  nah .. tai phone length 12 use kora hoisa
   
   if(phone){
      phone = phone.trim();
   }
   //console.log(obj.queryStringObject.phone);
   if(phone){
      var token = obj.headerObject.token;
      tokenVarify.handler._token.token_varify(token , `+${phone}` , (validate , tokenData)=>{
         if(validate==true){
            fsControl.lib.read(`../.data/users/+${phone}` , `+${phone}.json` , (err , data)=>{
               if(err){
                  callback(500 , {
                     error: "user not yet registered",
                     message:tokenData.message,
                  })
               }else{
                  var read_obj = { ...JSON.parse(data)};
                  delete read_obj.password; // I dont want to show the password .. so I delete it
                  callback(200 , read_obj )
               }
            })
         }else{
            callback(404 , {
               error: tokenData.message,
            })
         }
      })
   }else{
      callback(404 , {
         error: "input type error",
      })
   }
};
handler._users.post = (obj , callback)=>{
   /*
   body te==>>
   {
      "firstName" : "niaz" , 
      "lastName" : "mahmud" ,
      "phone" : "+971521809001" ,
      "password" : "12345" ,
      "tosAgreement" : true 
   }
   */
   const firstName = typeof(obj.body.firstName) == "string" && obj.body.firstName.trim().length>0 ? obj.body.firstName : false;

   const lastName = typeof(obj.body.lastName) == "string" && obj.body.lastName.trim().length>0 ? obj.body.lastName : false;

   const phone = typeof(obj.body.phone)==="string" && obj.body.phone.trim().length== 13 ? obj.body.phone : false; 

   const password  = typeof(obj.body.password) === "string" && obj.body.password.trim().length>0 ? obj.body.password : false;

   const tosAgreement = typeof(obj.body.tosAgreement) === "boolean" ? obj.body.tosAgreement : false;

   /*callback(505 , {
      "firstName" : firstName , 
      "lastName" : lastName ,
      "phone" : phone ,
      "pass" : password ,
      "tos" : tosAgreement ,
   })*/
   //console.log( firstName+ " " +  lastName + " " + phone + " " + password +" " + tosAgreement) ;
   if(firstName && lastName && phone && password && tosAgreement){
      //console.log('now checking that the user is already available in ".data" folder') 
      fsControl.lib.read(`../.data/users/${phone}` , `${phone}.json` , (err , data)=>{
         if(err){
            var user_temp_obj = {
               firstName: firstName,  
               lastName: lastName,
               phone: phone,
               password: util.utilities.hash(password),
               tosAgreement: tosAgreement,
            }
            
            fsControl.lib.create(`users/${phone}` , `${phone}.json`,user_temp_obj , (erp)=>{
               if(erp){
                  callback(504 , {
                     error:"user file can't be created",
                  })
               }else{
                  callback(200 , {
                     message:"user was created successfully",
                  })
               }
            } )
         }else{
            callback(500 , {
               error:"user is already registered",
            })
         };
      })

   }else{
      callback(400 , {
         error:"you have an error in your request"
      })
   }
 
};
handler._users.put = (obj , callback)=>{
   /*
   *put process::==>> aita "get" ar moto "queryString" dea kaj kore nah ... ai ta "body" ar change korar uopr depend kore
   *"body" te unique field thakba "phone" 
   *akhon particular part a phone change korle oi change ta validate kore oi "${phone}/${phone}.json" ta update korba "lib/data.js" ar maddhome
   *so ... tomar process data "obj.body" te thakbe
   */  
   /*
   *body te==>>
   {
      "firstName" : "niaz" , 
      "lastName" : "mahmud" ,
      "phone" : "+971521809003" ,
      "password" : "12345" ,
      "tosAgreement" : true 
   }
   */
  
   //under==>> update korar jonno new sent data k validate korlam
   var  phone = typeof(obj.body.phone) === "string" && obj.body.phone.trim().length===13 ? obj.body.phone : false;
   var  firstName = typeof(obj.body.firstName) === "string" && obj.body.firstName.trim().length>0 ? obj.body.firstName : false;
   var lastName = typeof(obj.body.lastName) === "string" && obj.body.lastName.trim().length>0 ? obj.body.lastName : false;
   var password = typeof(obj.body.password) === "string" && obj.body.password.trim().length>0 ? obj.body.password : false;
   var tosAgreement = typeof(obj.body.tosAgreement)==="boolean" ? obj.body.agreement : false;

   if(phone){
      var user_temp_obj = {
         firstName: firstName, 
         lastName: lastName,
         password: util.utilities.hash(password),
      }
      if(tosAgreement == false){
         callback("404" , {
            error:"you are not agreed with our terms of service agreement",
         });
      }else{
         fsControl.lib.read(`../.data/users/${phone}` , `${phone}.json` , (err , data)=>{
            if(err){
               callback(500 , {
                  error:"User is not registered",
               });
            }else{
               //fsControl.lib.update(`../.data/users/${phone}` , `${phone}.json`)

               var parsed_data = util.utilities.parseJSON(data);

               if(parsed_data.firstName == user_temp_obj.firstName && parsed_data.lastName == user_temp_obj.lastName && parsed_data.password == user_temp_obj.password){
                  callback(200 , {
                     massage: "same user data requested to push",
                  })
               }else{
                  if(parsed_data.firstName != user_temp_obj.firstName){
                     parsed_data.firstName = user_temp_obj.firstName;
                  }
                  if(parsed_data.lastName != user_temp_obj.lastName){
                     parsed_data.lastName = user_temp_obj.lastName;
                  }
                  if(parsed_data.password != user_temp_obj.password){
                     parsed_data.password = user_temp_obj.password;
                  };

                  fsControl.lib.update(`users/${phone}` , `${phone}.json` , parsed_data , (errUpdate)=>{
                     //console.log("asdfasdfasdfasdf")
                     if(errUpdate){
                        callback(400 , {
                           error:"User cant be updated!!!",
                        });
                     }else{
                        callback(200 , {
                           error:"User data updated",
                        });
                     }
                  })
               }
            }
         })
      }

   }else{
      callback(404 , {
         error: "User not found"
      });
   }

};
handler._users.delete = (obj , callback)=>{
   /*
   * url a===>>>
   * http://localhost:4000/user?phone=+971521809001
   */
   var phone = typeof(obj.queryStringObject.phone) ==="string" && obj.queryStringObject.phone.trim().length===12 ? obj.queryStringObject.phone.trim() : false ; 

   fsControl.lib.remove(`users/+${phone}` , (err)=>{
      if(err){
         callback(404 , {
            error:"user file does not exists"
         })
      }else{
         callback(200 , {
            massage: "User file deleted successfully",
         })
      }
   })

};









