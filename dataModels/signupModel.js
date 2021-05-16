const mongoose=require('mongoose');
require('mongoose-type-email')
 const SigninSchema=new mongoose.Schema({

    Full_Name:{
        type:String,
        required:true
    },
    Mobile_Number:{
        required:true,
        type:Number,
        unique:true
    },
    Email:{        
       type: mongoose.SchemaTypes.Email, required: true, unique:true
       
    },
    Role:{
        type:String,
        enum:['Users','Admin'],
        default:'users'
    },
    Password:{
        type:String,
        required:true,
        minlength:5
        
    }

 })


 const siginModel=mongoose.model('User',SigninSchema)

 module.exports=siginModel