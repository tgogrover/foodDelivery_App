const mongoose=require('mongoose');
const cartSchema=new mongoose.Schema({

   UserId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    Cart_Items:[
        {
            ItemId:{
                type: mongoose.Schema.Types.ObjectId,ref:'Dish'
            },
        Quantity:{
            type:Number,default:1
        },
        
    }
    ],
    
},{ timestamps: true })

module.exports=mongoose.model('cart',cartSchema)
  