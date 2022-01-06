const express=require('express');
const router=express.Router();
//const menuModel=require('../dataModels/menu')
const foodChoicees=require('../dataModels/foodChoicesModel')

router.get('/homepage',async(req,res)=>{
   const foodFind= foodChoicees.find({})
  await foodFind.exec((err,data)=>{
        if(err) throw err;
        if(data){
             res.render('home',{title:'FOOD DELIVERY APP'})
        }
        else{
            res.render('home',{title:'FOOD DELIVERY APP'})

        }
    })
  
})




module.exports=router;