 const Valid_Token = "meng789";
export default function auth (req,res,next){
 const{token}=req.query;
 //check if not exist
 if(!token){
  return res.status(401).json({error:"Unauthorized: token is missing"});
 }
 //checkif it corresponded to Valid Token
 if(token !== Valid_Token){
  return res.status(401).json({error:"Unauthorized:invalid token"});
 }
 next(); // do the next thing 
}