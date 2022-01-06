const express=require('express');
const router=express.Router();
const signInModel=require('../../dataModels/signupModel');
const bcrypt=require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt=require('jsonwebtoken')

function checkLoginUser(req,res,next){
    var loginToken=localStorage.getItem('loginToken');
   // console.log(loginToken)
   if(loginToken){
       res.redirect('/homepage')
   }
    next();
  }

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
  return  res.render('usersEjs/login',{title:'FOOD DELIVERY APP',Messages:'',
    Error:err.array()[0].msg})
}
next();

}

router.get('/routes/users/login',checkLoginUser,(req,res)=>{
    res.render('usersEjs/login',{title:'FOOD DELIVERY APP',Messages:'',
    Error:''})

})

router.post('/routes/users/login',checkLoginUser,validationMessages,adminValidation,async(req,res)=>{
  
    const {email,password}=req.body;
    
    const loginProcess=signInModel.findOne({Email:email});
    await loginProcess.exec((err,loginData)=>{
        if(err) throw err;
        if(loginData){
       
            const {Password,Full_Name,Role,Email,_id}=loginData;
            //const Hash_Password=bcrypt.compareSync(password,Password);
            if(bcrypt.compareSync(password,Password)){
                console.log(req.body);
                localStorage.setItem('loginEmail',Email);
                const token= jwt.sign({Role:Role,_id:_id},process.env.SecretKey)
                localStorage.setItem('loginToken',token)
                localStorage.setItem('loginID',_id)
                res.redirect('/homepage')
        }
        else{
     return       res.render('usersEjs/login',{title:'FOOD DELIVERY APP',Messages:'',
    Error:'Invalid Password'})
        }
    }

        else{
            res.render('usersEjs/login',{title:'FOOD DELIVERY APP',Messages:'',
            Error:'Email not registered,Try SignIn First'})
        }
    }) 
})


router.get('/routes/logout',(req,res)=>{
   // localStorage.removeItem('loginEmail')
        localStorage.removeItem('loginToken')
        localStorage.removeItem('loginEmail')
        localStorage.removeItem('loginID')
        res.redirect('/routes/users/login')
})

module.exports=router