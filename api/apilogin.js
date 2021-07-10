const express= require('express');
const router=express.Router();
const signinModel=require('../dataModels/signupModel');
const bcrypt=require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt=require('jsonwebtoken');




if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
  

const validationMessages=[ 
  body('email')
 .isEmail()
 .withMessage('Valid Email is required'),
  body('password')
 .notEmpty()
 .withMessage('Your Password is required')
];

const loginValidation=(req,res,next)=>{
    //  console.log( req.body.fullName)
      const err= validationResult(req);
  //    console.log(err)
      if(!err.isEmpty()){
//console.log(err.mapped())
          console.log(err.array()[0].msg )
       return res.status(400).json({ error: err.array()[0].msg })
   }
   next();
   
   }



router.post('/api/admin/login',validationMessages,loginValidation,async(req,res)=>{
    const {email,password}=req.body;
    const loginProcess=signinModel.findOne({Email:email});
    await loginProcess.exec((err,loginData)=>{

        if(err) throw err;
        console.log(loginData)
        if(loginData){
            const {Password,Full_Name,Role,Email,_id}=loginData;
            
            if(bcrypt.compareSync(password,Password)){ 
                localStorage.setItem('loginEmail',Email);
                const token= jwt.sign({Role:Role,_id:_id},process.env.SecretKey)
                localStorage.setItem('loginToken',token)
                res.status(200).json({
                    Full_Name,
                    Role,
                    Email,
                    _id
            })
        }
        else{
            res.status(400).json({
                message:'Invalid Password'
            })
        }

        }
        else{
            res.status(400).json({
                message:'Email does not exist '
            })
        }

    })

})


router.post('/api/users/login',validationMessages,loginValidation,async(req,res)=>{
    const {email,password}=req.body;
    const loginProcess=signinModel.findOne({Email:email});
    await loginProcess.exec((err,loginData)=>{

        if(err) throw err;
        if(loginData){
            
            const {Password,Full_Name,Role,Email,_id}=loginData;
          
            if(bcrypt.compareSync(password,Password)){ 
                localStorage.setItem('loginEmail',Email);
                const token= jwt.sign({Role:Role,_id:_id},process.env.SecretKey)
                localStorage.setItem('loginToken',token)
                res.status(200).json({
                    Full_Name,
                    Role,
                    Email,
                    _id
            })
        }
        else{
            res.status(400).json({
                message:'Invalid Password'
            })
        }

        }
        else{
            
            res.status(400).json({
                message:'Email does not exist '

            })
        }

    })

})

router.get('/logout',(req,res)=>{
    localStorage.removeItem('loginEmail')
    localStorage.removeItem('loginToken')
    res.status(200).json({
        Message:'logout successfull'
    })
})




module.exports=router;