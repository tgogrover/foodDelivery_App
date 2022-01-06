const express=require('express');
const router=express.Router();
const slugify=require('slugify')
const multer=require('multer');
const jwt=require('jsonwebtoken');
//const shortID=require('shortid');
const { body, validationResult } = require('express-validator');
const restaurantModel = require('../dataModels/restaurantModel');
const foodChoices=require('../dataModels/foodChoicesModel');
const foodChoicesModel = require('../dataModels/foodChoicesModel');
const dishModel = require('../dataModels/dishModel');
const authorisedAdminCheck=require('../middlewares/adminAuthentication')
// var timeout = require('connect-timeout')
// router.use(timeout)



const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'public/uploads/restaurantUploads')

    },
    //naming file name in uploads directory with file's original name and extension
    //a unique shortID is genarated ahead of original filename and after 
    //filename date is added when it is uploaded by admin 
    //originalname=file's originalname
    //filename=file name stored in uploads directory(destination)
    filename:(req,file,cb)=>{
        cb(null,file.originalname )

    }
});
const imageUpload=multer({storage});






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

router.get('/api/admin/restaurant/:id',authorisedAdminCheck,async(req,res)=>{
    var id=req.params.id
    await restaurantModel.findById({_id:id}).exec((err,restaurantData)=>{
        if(err) throw err;
       // console.log(dishData)
        if(restaurantData){
          const {Description,Food_Choices}=restaurantData;
          //console.log(CreatedBy)
          const restaurantName=restaurantData.Name;


        //   dishModel.findOne({_id:Dish}).exec((err,Dish)=>{
        //       if(err) throw err;
        //       if(Dish){
        //       const DishName=Dish.Name
          foodChoicesModel.findOne({_id:Food_Choices}).exec((err,foodChoice)=>{
              if(err) throw err; 
             // console.log(foodChoice)
              if(foodChoice){
                const {Name}=foodChoice;
                  res.status(200).json({
                      Restaurant:restaurantName,
                   
                      Specialties:Name,
                      Description:Description  
                  })
        //       }
        //   })
        }
        })
        }
        else{
            res.status(400).json({
                Error:'No Restaurant Found'
            })
        }
 
    })
});



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
   // console.log(req.body)

    if(!err.isEmpty()){
//console.log(err.mapped())

          console.log(err.array()[0].msg )
       return res.status(400).json({ error: err.array()[0].msg })
   }
   else{
    
    if(req.files.length > 0){
        Restaurant_Pictures= req.files.map(file => {
            return { img: file.filename }
        });
        console.log(req.files[0])
       
        await  restaurantModel.findOne({ Address:address,Contacts:contacts},(err,restaurant)=>{
        // .exec((err,restaurant)=>{
            if(err) throw err;
            if(restaurant){
                console.log(restaurant)
                res.status(400).json({
                    Message:'Try Another Location with different Phone No.'
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
            Restaurant_Pictures:req.files[0].filename,
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
    // })
    }
    else{
        res.status(400).json({
            Message:"Restaurant's images is required"
        })

    }
   }
})


module.exports=router;