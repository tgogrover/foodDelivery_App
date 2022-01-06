const mongoose=require('mongoose');


const DishSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
       
    },
    Slug:{
        type:String,
        required:true,
       
    },
    ReferancePicture:
        {
     
            type:String,
            required:true
 
    }
, 
    Food_Type:{
        type:String,
        enum:['Veg','Non-Veg'],
        default:'Veg'
    },
    Price:{
        type:Number,
       required:true
    },
    Restaurant:{
        type:mongoose.Schema.Types.ObjectId,ref:'Restaurant',required:true
    },
    Created_By:{
        type:mongoose.Schema.Types.ObjectId,ref:'User',required:true
    },
   
})

module.exports=mongoose.model('Dish',DishSchema)