const express= require('express');
const mongoose=require('mongoose');


const menuSchema= new mongoose.Schema({
 Items_Name:{
     required:true,
     type:String,
     minlength:4,
     maxlength:10
 },
Image:{
    type:String,
    required:true
},
Created_By:{    
 type:mongoose.Schema.Types.ObjectId,ref:'User',required:true
}
})



module.exports= mongoose.model('Menu',menuSchema)