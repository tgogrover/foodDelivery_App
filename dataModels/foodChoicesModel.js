const mongoose=require('mongoose');

const foodChoicesSchema= new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        unique:true
    },
    // Kind:{
    //     enum:['Veg,Non-Veg'],
    //  default:'Food'
    // },
    Created_By:{
        type:mongoose.Schema.Types.ObjectId,ref:'User',required:true
    },
    Updated_At:Date

}, { timestamps: true })


module.exports=mongoose.model('Food Choices',foodChoicesSchema)