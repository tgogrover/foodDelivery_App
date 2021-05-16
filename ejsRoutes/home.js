const express=require('express');
const router=express.Router();
const menuModel=require('../dataModels/menu')


router.get('/homepage',async(req,res)=>{
   const pizzaFind= menuModel.find({})
  await pizzaFind.exec((err,data)=>{
        if(err) throw err;
        else{
            res.render('home',{pizzas:data})

        }
    })
  
})




module.exports=router;