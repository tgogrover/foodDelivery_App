const express=require('express');
const router=express.Router();
const foodChoicesModel=require('../dataModels/foodChoicesModel');
const jwt=require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const authorisedAdminCheck=require('../middlewares/adminAuthentication')




// const authorisedAdminCheck=(req,res,next)=>{
   
//     const loginEmail=localStorage.getItem('loginEmail');
//     console.log(loginEmail)
//     if(loginEmail){
//       //  console.log(req.headers.authorization)
//         if(req.headers.authorization){
//         const token=req.headers.authorization.split(' ')[1]
//             try {
//                 const user= jwt.verify(token,process.env.SecretKey)
//                   req.user=user
//                 if(user.Role=="Admin"){
//                     next();
//                 }
//                 else{
//                     res.json({
//                         Message:'User Access Denied, only Admin make food Choices'
//                     })
//                 }   
//             } catch (error) {
//                 res.status(400).json({
//                 Error:  error.message
//                 })
//             }
//         }
//         else{
//             res.status(400).json({
//                 Error:  'Authorization required'
//                 })

//         }
//     }
//         else{
//             res.status(400).json({
//                 Error:'You have to login First'
//             })
//         }
    
// };



const differentFoodChoices=async(req,res,next)=>{

    const {name}=req.body;
    console.log(req.body)
    const findfoodChoices=foodChoicesModel.findOne({Name:name})
    await findfoodChoices.exec((err,choicesData)=>{
        if(err) throw err;
        if(choicesData){
            console.log(choicesData)
            res.status(400).json({
                Message:"This food choice already exist. Try another food choices"
            })
        }
        else{
            next();
        }

    })

}  


const validationMessages=[ 
    body('name')
   .notEmpty()
   .withMessage('Name of Food Choices is required'),
//     body('createdBy')
//    .notEmpty()
//    .withMessage("admin's ID is required")
  ];



  const foodChoicesValidation=(req,res,next)=>{
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
  


router.get('/api/admin/foodChoices',authorisedAdminCheck,async(req,res)=>{
  const foodChoicesCollection =foodChoicesModel.find({});
 await foodChoicesCollection.exec((err,foodData)=>{
      if(err) throw err;
      if(foodData){
          res.status(200).json({
              Food_Choices:foodData

          })
      }
  })

})


router.post('/api/admin/foodChoices',authorisedAdminCheck,validationMessages,foodChoicesValidation,differentFoodChoices,async(req,res)=>{
  //const adminID=localStorage.getItem('loginID');
  const {name,adminID}=req.body;
  const FoodChoices=new foodChoicesModel({

    Name:name,
    Created_By:req.user._id

  });
  await FoodChoices.save((err,choicesData)=>{

    if(err) throw err;
    if(choicesData){

        res.status(201).json({
           Data:choicesData
        })
    }
    else{
        res.status(400).json({
        Message:"something went wrong"
         })

    }
  })

})

module.exports=router