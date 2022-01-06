const mongoose=require('mongoose');

const RestaurantSchema= new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Slug:{
        required:true,
        type:String,
        trim:true
    },
    Address:{
        type:String,
        required:true,
        unique:true
    },
    Description:{
        type:String,
        required:true,
        trim:true
    },
    Contacts:{
        type:Number,
        required:true,
        minlength:10,
        maxlength:10,
        trim:true,
        unique:true
    },
    Review:[
        {
        userID:mongoose.Schema.Types.ObjectId,ref:'User',
        type:String
        }
    ],
    Created_By:{
        type:mongoose.Schema.Types.ObjectId,ref:'User',
        required:true
    },
    Restaurant_Pictures:
         { type: String ,required:true} 
       

    ,
    Food_Choices:{
        type:mongoose.Schema.Types.ObjectId,ref:'food',required:true
    }, Updated_At:Date
  
    
},{timestamps:true})


module.exports=mongoose.model('Restaurant',RestaurantSchema)