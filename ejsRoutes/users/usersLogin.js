const express=require('express');
const router=express.Router();
const signInModel=require('../../dataModels/signupModel');
const bcrypt=require('bcrypt');
const { body, validationResult } = require('express-validator');

const validationMessages=[ 
    body('email')
   .isEmail()
   .withMessage('Valid Email is required'),
    body('password')
   .notEmpty()
   .withMessage('Your Password is required')
  ];
  
  
const adminValidation=(req,res,next)=>{
   const err= validationResult(req);
   console.log(err)
   if(!err.isEmpty()){
    res.render('usersEjs/login',{title:'FOOD DELIVERY APP',Messages:'',
    Error:err.array()[0].msg})
}
next();

}

router.get('/routes/users/login',(req,res)=>{
    res.render('usersEjs/login',{title:'FOOD DELIVERY APP',Messages:'',
    Error:''})

})

router.post('/routes/users/login',validationMessages,adminValidation,async(req,res)=>{
  
    const {email,password}=req.body;
    console.log(req.body);
    const loginProcess=signInModel.findOne({Email:email});
    await loginProcess.exec((err,registeredEmail)=>{
        if(err) throw err;
        if(registeredEmail){
            const Password=registeredEmail.Password;
            const Hash_Password=bcrypt.compareSync(password,Password);
            if(Hash_Password){
                res.redirect('/homepage')
        }
        else{
            res.render('usersEjs/login',{title:'FOOD DELIVERY APP',Messages:'',
    Error:'Invalid Password'})
        }
    }

        else{
            res.render('usersEjs/login',{title:'FOOD DELIVERY APP',Messages:'',
            Error:'Email not registered,Try SignIn First'})
        }
    }) 
})


module.exports=router