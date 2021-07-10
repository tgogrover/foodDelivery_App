const mongoose=require('mongoose');


const DishSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        unique:true
    },
    Slug:{
        type:String,
        required:true,
        unique:true
    },
    ReferancePicture:[
        {
        img:{
            type:String,
            required:true
        }
    }
], 
    Food_Type:{
        type:String,
        enum:['Veg','Non-Veg'],
        default:'Veg'
    },
    Created_By:{
        type:mongoose.Schema.Types.ObjectId,ref:'User',required:true
    },
    Food_Choices:{
        type:mongoose.Schema.Types.ObjectId,ref:'Food Choices',required:true
    },
})

module.exports=mongoose.model('Dish',DishSchema)