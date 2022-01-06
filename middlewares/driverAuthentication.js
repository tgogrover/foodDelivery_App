//Middlewares only passed by  authorized admin(owner)
const jwt=require('jsonwebtoken')
const authorisedAdmin=(req,res,next)=>{

    const loginEmail=localStorage.getItem('loginEmail');
if(loginEmail){
    const {authorisation} = req.headers;
    
 if(authorisation){
     
    var header = authorisation.split(' ')[1]
try{
 var token=jwt.verify(header, process.env.SecretKey);
 req.user=token
 if(req.user.Role=='Delivery Person'){
    next();
 }
 else{
    res.status(400).json({
        Message:'Customer   access denied'

    })

 }

}
 catch (err){
   return res.status(400).json
   ({
       message:err.message
})
 }
}
else{
    res.status(400).json({
        Message:' Authorisation Required'

    })

}
}
else{
    res.status(400).json({
        Message:'You have to login first'

    })

}

}
module.exports=authorisedAdmin