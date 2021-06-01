const express=require('express');
const router=express.Router();
const siginModel=require('../../dataModels/signupModel');
const bcrypt=require('bcrypt');
const { body, validationResult } = require('express-validator');

const validationMessages=[
    body('fullName').notEmpty()
    .withMessage('Your Name is required'),
    body('email').isEmail()
    .withMessage('Valid Email is required'),
    body('mobileNo').notEmpty()
    .withMessage('mobile no. is required'),
    body('password')
    .isString()
    .isLength({min:5})
    .withMessage('password must contain atleast contain 5 alphabets'),

];
  
const adminValidation=(req,res,next)=>{
   console.log( req.body.fullName)
   const err= validationResult(req);
   console.log(err)
   if(!err.isEmpty()){
    return res.status(400).json({ error: err.array()[0].msg })
}
next();

}

const uniqueMail=async(req,res,next)=>{
    const email=req.body.email;
    const emailFindQuery=siginModel.findOne({Email:email})
    await emailFindQuery.exec((err,alreadyEmail)=>{
        if(err) throw err;
        if(alreadyEmail){
res.status(400).json({
    Message:'Email already exists.So try another Email please'
})
    }
else{
next()
}
    })
}

const uniqueMobileNo=async(req,res,next)=>{
    const mobileNo =req.body.mobileNo;
    const emailFindQuery=siginModel.findOne({Mobile_Number:mobileNo})
    await emailFindQuery.exec((err,validMobileNo)=>{
        if(err) throw err;
        if(validMobileNo){
res.status(400).json({
    Message:'Mobile No. already exists.So try another Mobile No. please'
})
    }
else{
next()
}
    })
}

router.get('/routes/users/login',(req,res)=>{
    res.locals = {
        title: 'FOOD DELIVERY APP',
      };
    res.render('usersEjs/login')

})

router.post('/routes/users/login',uniqueMail,uniqueMobileNo,validationMessages,adminValidation,async(req,res)=>{
  
    const {fullName,email,mobileNo,password}=req.body;
    console.log(req.body);
    const Work=req.body.email.Work

    const Hash_Password=bcrypt.hashSync(password,10);
    const SuccessfullSigin=new siginModel({
        Full_Name:fullName,
        Mobile_Number:mobileNo,
        Password:Hash_Password,
        Email:{
            Work:Work
        },
        
    })
await SuccessfullSigin.save((err,signinData)=>{
    if(err) throw err;
    
    if(signinData){
        const {Full_Name,Email}=signinData
        res.status(201).json({
            Name:Full_Name,
            Email:Email,
            message:"data saved succesfully"

        })
    }
    else{
        res.status(400).json({
        message:'Something went wrong'
    })
}

})
})


module.exports=router