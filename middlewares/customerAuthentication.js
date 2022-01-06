const jwt=require('jsonwebtoken')
const authorisedCustomer=(req,res,next)=>{

    const loginEmail=localStorage.getItem('loginEmail');
if(loginEmail){
    const {authorisation} = req.headers;
    console.log(authorisation)
 if(authorisation){
     
    var header = authorisation.split(' ')[1]
try{
 var token=jwt.verify(header, process.env.SecretKey);
 req.user=token
 if(req.user.Role=='Users'){
    next();
 }
 else{
    res.status(400).json({
        Message:'admin access denied'

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


module.exports=authorisedCustomer