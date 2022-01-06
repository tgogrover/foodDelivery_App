const express=require('express');
const router=express.Router();
const foodChoicesModel=require('../../dataModels/foodChoicesModel');
const jwt=require('jsonwebtoken');
const customerMiddleware=require('../../middlewares/customerAuthentication')
const restaurantModel=require('../../dataModels/restaurantModel');

router.get('/routes/users/foodChoices/indian',async(req,res)=>{
  await  restaurantModel.find({Food_Choices:"61c5468e4f71fe29202ee50f"}).exec((err,indianFood)=>{
      if(err) throw err;
      if(indianFood){

        const {Name,Address,Contacts}=indianFood;
          res.render('usersEjs/indianRestaurent',{title:' FOOD DELIVERY APP',pizzas:indianFood})
      }

  })


})

module.exports=router;