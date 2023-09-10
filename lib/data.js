import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __file_total_path = fileURLToPath(import.meta.url); //return total path ex:D://JS/node/project1/lib/index.js
const __filename = path.basename(__file_total_path); //return index.js
const __pathname = path.dirname(__file_total_path );//return path name ex: D://JS/node/project1/lib


export const lib = {};


lib.basedir = path.join(__pathname + "/../.data/");

lib.create = (dir , file , data , callback)=>{
   //dir = create a folder under ".data" folder 
   //file = under "dir" folder create a file with ".json" with the name of "file"
   //data = write data to the created file.json
   //callback = that returns error if there are any

   //1st: create a directory(folder) under ".data" folder 

   //ir create a folder as well as file
   fs.mkdir(`${lib.basedir}/${dir}` , (errFile)=>{
      if(errFile){
         console.log(errFile);
         callback(errFile);
      }else{
         //now open the created folder 
         fs.open(`${lib.basedir}/${dir}/${file}` , "wx+" , (errOpen , path_open)=>{
            //errOpen = is the error
            //path_open = the "path" that is passed in "fs.open()"
            if(errOpen){
               console.log(errOpen);  
               callback(errOpen);
            }else if(!errOpen){
               //now write on the file after opening the file
               var parsed_data = JSON.stringify(data);
      
               fs.writeFile(path_open , parsed_data , (errWrite)=>{
                  if( errWrite ){
                     //console.log(errWrite);
                     callback(errWrite );
                  }else if(!errWrite){
                     fs.close(path_open , errClose=>{
                        //console.log(errClose);
                        callback(errClose);
                     });
                  }
               })
            }
         })
      }
   });
};
lib.createFile = (dir , file , data , callback)=>{
   //that create just file not the folder link "lib.crate()"

    //now open the created folder 
    fs.open(`${lib.basedir}/${dir}/${file}` , "wx+" , (errOpen , path_open)=>{
       //errOpen = is the error
       //path_open = the "path" that is passed in "fs.open()"
       if(errOpen){
          console.log(errOpen);  
          callback(errOpen);
       }else if(!errOpen){
          //now write on the file after opening the file
          var parsed_data = JSON.stringify(data);
   
          fs.writeFile(path_open , parsed_data , (errWrite)=>{
             if( errWrite ){
                //console.log(errWrite);
                callback(errWrite );
             }else if(!errWrite){
                fs.close(path_open , errClose=>{
                   //console.log(errClose);
                   callback(errClose);
                });
             }
          })
       }
    })
      
};

lib.read = (dir , file ,  callback)=>{
   fs.readFile(`${lib.basedir}/${dir}/${file}`, "utf8" , (err , data)=>{
      if(err){
         callback(err , data);
      }else {
         callback(err , data);
      };
   });
};

lib.update = (dir , file , data , callback)=>{
   fs.open(`${lib.basedir}/${dir}/${file}` , "r+" , (errOpen , successOpen)=>{
      if(errOpen){
         callback(errOpen); 
         //console.log(errOpen);
      }else if(!errOpen){
         //now format the file with "ftruncate()"
         fs.ftruncate(successOpen , (errTrunc)=>{
            if(errTrunc){
               callback(errTrunc);
               //console.log(errTrunc);
            }else{
               var temp_data = JSON.stringify(data);
               fs.writeFile(successOpen , temp_data , (errWrite)=>{
                  if(errWrite){
                     callback(errWrite);
                     //console.log(errWrite);
                  }else{
                     fs.close(successOpen , (errClose ,suc)=>{
                        if(errClose){
                           callback(errClose);
                        }else{
                           callback(suc);
                        }
                     })
                  }
               })
            }
         })
      }
   })
};

lib.remove = (file , callback)=>{
   //ir remove a folder 
   fs.rmdir(`${lib.basedir}/${file}`,{ recursive: true, force: true } , (errRm)=>{
      if(errRm){
         callback(errRm);
      }else{ 
         callback(errRm);
      };
   })
}

lib.removeFile = (dir , file , callback)=>{
   //it remove a file
   fs.rm(`${lib.basedir}/${dir}/${file}` , (err)=>{
      if(err){
         callback(err);
      }else{
         callback();
      }
   })
};

lib.list = (dir , callback)=>{
   //it reads all the "file name" inside the "dir" folder
   fs.readdir(`${lib.basedir}/${dir}/` , (err , fileName)=>{
      if(!err && fileName && fileName.length > 0){
         var fileArr = [];
         fileName.forEach(files =>{
            fileArr.push(files);
         });
         callback(true , fileArr )
      }else{
         callback("false" , "file not found")
      };
   })
}

lib.list_file = (dir , phone , callback)=>{

   lib.read(`${dir}/${phone}` , phone , (err , data)=>{
      if(err){
         callback(404 , "file can't read!!!")
      }else{
         var temp = json.parse(data);
         callback(200 , temp.checks);
      }
   })

}




