const express= require('express');
const router=express.Router();
const signinModel=require('../dataModels/signupModel');
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
        if(loginData){
            const {Password,Full_Name,Role,Email}=loginData
            if(bcrypt.compareSync(password,Password)){ 
            res.status(200).json({
                Full_Name,
                Role,
                Email
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




module.exports=router;