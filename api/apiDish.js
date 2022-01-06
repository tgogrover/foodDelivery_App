const express=require('express');
const router=express.Router();
const dishModel=require('../dataModels/dishModel');
const jwt=require('jsonwebtoken');
const multer=require('multer');
const shortID=require('shortid');
const { body, validationResult } = require('express-validator');
const { default: slugify } = require('slugify');
const foodChoicesModel=require('../dataModels/foodChoicesModel')




const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'public/uploads/dishesUploads')

    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname )
    }
});
const imageUpload=multer({storage});


const authorisedAdminCheck=(req,res,next)=>{
   
    const loginEmail=localStorage.getItem('loginEmail');
    console.log(loginEmail)
    if(loginEmail){
      //  console.log(req.headers.authorization)
        if(req.headers.authorization){
        const token=req.headers.authorization.split(' ')[1]
            try {
                const user= jwt.verify(token,process.env.SecretKey)
                  req.user=user
                if(user.Role=="Admin"){
                    next();
                }
                else{
                    res.json({
                        Message:'User Access Denied, only Admin make food Choices'
                    })
                }   
            } catch (error) {
                res.status(400).json({
                Error:  error.message
                })
            }
        }
        else{
            res.status(400).json({
                Error:  'Authorization required'
                })

        }
    }
        else{
            res.status(400).json({
                Error:'You have to login First'
            })
        }
    
};



router.get('/api/admin/dishes',authorisedAdminCheck,async(req,res)=>{
    
    await dishModel.find({}).exec((err,dishData)=>{
        if(err) throw err;
        console.log(dishData)
        if(dishData){
            res.status(200).json({
               Dishes:dishData
            })
        }
        else{
            res.status(400).json({
                Error:'No dishes Found'
            })
        }
 
    })
});



router.get('/api/admin/dishes/:id',authorisedAdminCheck,async(req,res)=>{
    var id=req.params.id
    await dishModel.findById({_id:id}).exec((err,dishData)=>{
        if(err) throw err;
       // console.log(dishData)
        if(dishData){
          const {Food_Type,Food_Choices}=dishData;
          //console.log(CreatedBy)
          const dishName=dishData.Name
          foodChoicesModel.findOne({_id:Food_Choices}).exec((err,foodChoice)=>{
              if(err) throw err;
             // console.log(foodChoice)

              if(foodChoice){
                  const {Name}=foodChoice
                  res.status(200).json({
                      Dish:dishName,
                      Dish_Type:Name,
                      Food_Type:Food_Type,
                     
                  })

              }

          })

        }
        else{
            res.status(400).json({
                Error:'No dishes Found'
            })
        }
 
    })
});


router.post('/api/admin/dishes',authorisedAdminCheck,imageUpload.array('referancePicture'), 
body('name')
.notEmpty()
.withMessage("dish name is required"),
body('Restaurant')
.notEmpty()
.withMessage("restaurent name is required"),
async(req,res)=>{
    const {name, Restaurant,Price}=req.body;
    console.log(body)
    const err= validationResult(req);
    console.log(req.body)

    if(!err.isEmpty()){
//console.log(err.mapped())

          console.log(err.array()[0].msg )
       return res.status(400).json({ error: err.array()[0].msg })
   }
   else{
       
    
    if(req.files.length > 0){
        
            
        const Dish=new dishModel({
            Name:name,
            Slug:slugify(name),
            Created_By:req.user._id,
            
            ReferancePicture:req.files[0].filename,
            Price:Price,
            Restaurant:Restaurant
            
        })
     await  Dish.save((err,dish)=>{
          if(err) throw err;
          if(dish){
            res.status(201).json({
                dish:dish
            })
          }
        })
    
    
    }
    else{
        res.status(400).json({
            Message:"Dish's image is required"
        })

    }
   }
})

module.exports=router;
