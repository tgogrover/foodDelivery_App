const mongoose=require('mongoose');

 const SigninSchema=new mongoose.Schema({

    Full_Name:{
        type:String,
        required:true
    },
    Mobile_Number:{
        required:true,
        type:Number,
        unique:true,
        maxlength:10,
        minlength:10
    },

    Email: {
        required:true,
        unique:true,
        type:String
    },
       
    Role:{
        type:String,
        enum:['Users','Admin','Delivery Person'],
        default:'Users'
    },
    Password:{
        type:String,
        required:true,
        minlength:5
        
    }  
 }, { timestamps: true })


 const siginModel=mongoose.model('User',SigninSchema)

 module.exports=siginModel