const express=require('express');
const router=express.Router();
const dishModel=require('../../dataModels/dishModel');
const jwt=require('jsonwebtoken');
const restaurantModel=require('../../dataModels/restaurantModel');




router.get('/api/restaurant/dishes/:id',async(req,res)=>{
    var id=req.params.id
    console.log(id)
    await restaurantModel.findById({_id:id}).exec((err,restaurantData)=>{
        if(err) throw err;
       // console.log(dishData)
        if(restaurantData){
            dishModel.find({Restaurant:id}).exec((err,dishData)=>{
                if(err) throw err;
                if(dishData){
                    res.render('usersEjs/dishes',{title:' FOOD DELIVERY APP',pizzas:dishData})
                }

            })
          
          //console.log(CreatedBy)
          

        }
        else{
            res.status(400).json({
                Error:'No dishes Found'
            })
        }
 
    })
});







module.exports=router;