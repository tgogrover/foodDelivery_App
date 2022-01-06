const express= require('express');
const router=express.Router();
const cartModel=require('../../dataModels/cart_Model')
const jwt=require('jsonwebtoken')
const dishModel=require('../../dataModels/dishModel')

function checkLoginUser(req,res,next){
    var loginToken=localStorage.getItem('loginToken');
   // console.log(loginToken)
    try {
      var decoded = jwt.verify(loginToken, process.env.SecretKey);
     
    } catch(err) {
        
        req.user=decoded
       console.log(decoded)
    return  res.redirect('/homepage');
    }
    next();
  }

router.get('/api/user/cart',checkLoginUser,async(req,res)=>{
    var loginID=localStorage.getItem('loginID')
    await cartModel.findOne({ UserId:loginID})
    .populate("Cart_Items.ItemId"," Name  ReferancePicture  Food_Type  Price").exec((err,Cart)=>{
      if(err) throw err;
      if(Cart){
         
      const {Cart_Items}=Cart
       console.log(Cart_Items)
     res.render('usersEjs/cart',{title:' FOOD DELIVERY APP',pizzas:Cart_Items})
          
  
         
      }
      else{
          res.json({
              Message:'no Cart'
          })
      }
  
  })

})



// router.post('/api/user/cart',async(req,res)=>{
//     const { Cart_Items} = req.body
//     const cartID=cartModel.findOne({UserId:req.user._id})
//   await  cartID.exec((err,id)=>{
//         if(err) throw err;
//         if(id){
          
//             //id.Cart_Items.Product
//             const item = req.body.Cart_Items.item
//            // console.log(Product)

//             const productID=id.Cart_Items.find((c) => { return c.ItemId == item})
//          //   
//             if(productID){
//                 parseInt
//                 const evaluate=  parseInt(req.body.Cart_Items.quantity)+ 1;
//                 productID.Quantity=evaluate;
                


// id.save(({ suppressWarning: true }),(err,data)=>{
//     if(err) throw err;
//             res.status(201).json({
//                      Cart:data
//                      })

// });
//             }else{
//                 //console.log(cart)
//             id.Cart_Items.push({
               
//                     ItemId:Cart_Items.item,
//                     Quantity:Cart_Items.quantity
                
//             });
//            id.save((err,insertData)=>{
//                console.log(insertData)
//                 if(err) throw err
//                 res.status(201).json({
//                     Cart:insertData
//                 })
//             })
//         }
//     }
//         else{
           
//             const cartData=new cartModel({
//                 UserId:  req.user._id,
//                 Cart_Items:{
//                     ItemId:Cart_Items.item,
//                     Quantity:Cart_Items.quantity
//                 }
//             })
//            cartData.save((err,data)=>{
//                 if(err) throw err;
//                 else{
//                     res.status(201).json({
//                         Cart_Items:data
//                     })
//                 }
//             })
//         }
//     })

// })


module.exports=router;
