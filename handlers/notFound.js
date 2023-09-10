//Routes component
//imports 

//objects
export const notFound = {};
notFound.notFoundHandler = (obj , callback)=>{
   //console.log(obj);
   callback(200 , {
      massage:"page not found",
      nore:"page not found",
   });
}
