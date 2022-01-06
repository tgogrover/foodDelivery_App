const express=require('express');
const router=express.Router();
const orderModel=require('../../dataModels/order_Model');
const cartModel=require('../../dataModels/cart_Model');
const jwt=require('jsonwebtoken')

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

router.post('/customer/addorder',checkLoginUser,async(req,res)=>{
    const {userAddress}=req.body;
    var loginID=localStorage.getItem('loginID')
  await    cartModel.findOne({UserId:loginID}).exec((err,success)=>{
    if(err) throw err;
    if(success){
      //  Task Created, Reached Store, Items Picked, Enroute, Delivered and Canceled
     const {Cart_Items}=success
     console.log(Cart_Items)
      req.body.orderStatus = [
          {
            type: "Order Accepted",
            date: new Date(),
            isCompleted: true,
          },
          {
            type: "Food Cooking",
            isCompleted: false,
          },
          {
            type: "Items Picked",
            isCompleted: false,
          },
          
          {
            type: "Enroute",
            isCompleted: false,
          },
          {
            type: "Delivered",
            isCompleted: false,
          },
          {
            type: "Canceled",
            isCompleted: false,
          },
        ]
        const Order=new orderModel({
            Customer:loginID,
            Items:Cart_Items,
            Order_Status:req.body.orderStatus,
            User_Address:userAddress
        })
      Order.save(async(err,order)=>{
            if(err) throw err;
            if(order){
              cartModel.deleteOne({UserId:loginID}).exec((err,orderConfirmed)=>{
                if(err){
                  res.status(400).json({
                    Error:err
                })
                }
                if(orderConfirmed){
                res.render('usersEjs/order',{title:' FOOD DELIVERY APP'})
            }

              })
              
            }
  
        })
        
    }
})

})

router.get('/customer/view/orderStatus',checkLoginUser,async(req,res)=>{
  var loginID=localStorage.getItem('loginID')
  await orderModel.findOne({Customer:loginID}).exec((err,orderStatus)=>{
    if(err) throw err;
    if(orderStatus){
      const {Order_Status}=orderStatus;
      res.render('usersEjs/order',{title:' FOOD DELIVERY APP',pizzas:Order_Status})
    }

  })

    
})

module.exports=router;

