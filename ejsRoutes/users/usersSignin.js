const express=require('express');
const router=express.Router();
const siginModel=require('../../dataModels/signupModel');
const bcrypt=require('bcrypt');
const { body, validationResult } = require('express-validator');


//console.log(Error)
const validationMessages=[
    body('fullName').notEmpty()
    .withMessage('Your Name is required'),
    body('email').isEmail()
    .withMessage('Valid Email is required'),
    body('password').notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('password must be a string')
    .isLength({min:5})
    .withMessage('password must contain atleast contain 5 alphabets'),
     body('mobileNo').notEmpty()
    .withMessage('mobile no. is required')
    .isLength({min:10,max:10})
    .withMessage('valid mobile number is required')
];


const adminValidation=(req,res,next)=>{
  // console.log( req.body.fullName)
   const err= validationResult(req);
   console.log(err)
   if(!err.isEmpty()){
    return res.render('usersEjs/signin',{ title:'FOOD DELIVERY APP',Messages:'',Error: err.array()[0].msg })
}
next();

}

const uniqueMail=async(req,res,next)=>{
    const email=req.body.email;
    const emailFindQuery=siginModel.findOne({Email:email})
    await emailFindQuery.exec((err,alreadyEmail)=>{
        if(err) throw err;
        if(alreadyEmail){
            res.render('usersEjs/signin',{title:'FOOD DELIVERY APP',Messages:'',Error:'This account already registered try another account '})
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
            res.render('usersEjs/signin',{title:'FOOD DELIVERY APP',Messages:'',
            Error:'Try another mobile number,  this mobile number is already in use '})

    }
else{
next()
}
    })
}

router.get('/routes/users/siginin',(req,res)=>{
    res.render('usersEjs/signin',{title:'FOOD DELIVERY APP',Messages:'',
    Error:''})

})

router.post('/routes/users/siginin',uniqueMail,uniqueMobileNo,validationMessages,adminValidation,async(req,res)=>{
  

    const {fullName,email,mobileNo,password}=req.body;
    console.log(req.body);

    const Hash_Password=bcrypt.hashSync(password,10);
    const SuccessfullSigin=new siginModel({
        Full_Name:fullName,
        Mobile_Number:mobileNo,
        Password:Hash_Password,
        Email:email     
    })
await SuccessfullSigin.save((err,signinData)=>{
    if(err) throw err;
    
    if(signinData){
       res.render('usersEjs/signin',{title:' FOOD DELIVERY APP',Messages:'Data saved Successfully',Error:''})
       
    }
    else{
        res.render('usersEjs/signin',{title:' FOOD DELIVERY APP',Messages:'',Error:'Something went wrong'})
       
}

})
})


module.exports=router