//setting up twilio api
import * as nodemailer from "nodemailer";
import * as wbm from "wbm";
//import fetch from 'node-fetch';

//imports


//scaffolding 
export const sendApp = {} ; 

//sendApp.sendMessages = (phone , msg , callback)=>{//sendMessage ar jonno kono free api nai .. tai code likhlam nah};
sendApp.sendEmail = (to_mail , sub , msg , callback)=>{
   //console.log(nodemailer);
   var transport = nodemailer.createTransport({
      service: "gmail",
      auth:{
         user: "kingniloy01955@gmail.com" , 
         pass: "vjcuprmuxbrxpjzm"
      }
   });
   var mailOptions = {
      from: "kingniloy01955@gmail.com",
      to : to_mail , 
      subject : sub , 
      text : msg,
   }
   transport.sendMail(mailOptions, (err,info)=>{
      if (err) {
         console.log("mail error happens!!!");
         callback(err);
      }else{
        callback("mail sent:" + info.response);
      };
   })
}
sendApp.sendWhatsapp = (array_obj)=>{
   wbm.start().then(async () => {
      for (var contact of array_obj) {
          let message = "hello";
          if(contact.group === 'customer') {
              message = 'Good morning ' + contact.name + " " +contact.msg;
          }
          else if(contact.group === 'friend') {
              message = 'Hey ' + contact.name + '. Wassup?';
          }
          await wbm.sendTo(contact.phone, message);
      }
      await wbm.end();
  }).catch(err => console.log(err));
}




