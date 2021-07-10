const express=require('express');
const router=express.Router();
const slugify=require('slugify')
const multer=require('multer');
const jwt=require('jsonwebtoken');
const shortID=require('shortid');
const { body, validationResult } = require('express-validator');
const restaurantModel = require('../dataModels/restaurantModel');
const foodChoices=require('../dataModels/foodChoicesModel');
const foodChoicesModel = require('../dataModels/foodChoicesModel');
// var timeout = require('connect-timeout')
// router.use(timeout)



const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'uploads/restaurantUploads')

    },
    //naming file name in uploads directory with file's original name and extension
    //a unique shortID is genarated ahead of original filename and after 
    //filename date is added when it is uploaded by admin 
    //originalname=file's originalname
    //filename=file name stored in uploads directory(destination)
    filename:(req,file,cb)=>{
        cb(null,shortID.generate()+'-'+ file.originalname )

    }
});
const imageUpload=multer({storage});




const authorisedAdminCheck=(req,res,next)=>{
   
    const loginEmail=localStorage.getItem('loginEmail');
    console.log(loginEmail)
    if(loginEmail){
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
                Error:'You have to login First'
            })
        }
    
};



router.get('/api/admin/restaurant',authorisedAdminCheck,async(req,res)=>{
 await  restaurantModel.find({}).exec((err,restaurantData)=>{
       if(err) throw err;
       if(restaurantData){
           res.status(200).json({
               Restaurants:restaurantData
           })
       }
       else{
        res.status(400).json({
            Message:'No Restaurant'
        })

       }

   })

})
router.post('/api/admin/restaurant',authorisedAdminCheck,imageUpload.array('referancePicture'), 
body('name')
.notEmpty()
.withMessage("Restaurant name is required"),
body('foodChoices')    
.notEmpty()
.withMessage("Food Choices is required"),
 body('description')    
.notEmpty()
.withMessage("Food Description is required"),
body('address')    
.notEmpty()
.withMessage("Restaurant's Address is required"),
body('contacts')    
.notEmpty()
.withMessage("Restaurant's Address is required")
.isLength({min:10,max:10}).withMessage('valid mobile number is required'),async(req,res)=>{
    const {name,foodChoices,description,contacts,address}=req.body;
    const err= validationResult(req);
    console.log(req.body)

    if(!err.isEmpty()){
//console.log(err.mapped())

          console.log(err.array()[0].msg )
       return res.status(400).json({ error: err.array()[0].msg })
   }
   else{
    let Restaurant_Pictures = [];
    if(req.files.length > 0){
        Restaurant_Pictures= req.files.map(file => {
            return { img: file.filename }
        });
        
        await  restaurantModel.findOne({ Address:address}).exec((err,restaurant)=>{
            if(err) throw err;
            if(restaurant){
                res.status(400).json({
                    Message:'Try Another Location'
    
                })
            }
            else{
               
        const Restaurant=new restaurantModel({
            Name:name,
            Slug:slugify(name),
            Created_By:req.user._id,
            Description:description,
            Food_Choices:foodChoices,
            Contacts:contacts,
            Restaurant_Pictures:Restaurant_Pictures,
            Address:address
        })
       Restaurant.save((err,restaurant)=>{
          if(err) throw err;
          if(restaurant){
            res.status(201).json({
                Restaurant:restaurant
            })
          }
        })
    }
    })
    }
    else{
        res.status(400).json({
            Message:"Restaurant's images is required"
        })

    }
   }
})


module.exports=router;