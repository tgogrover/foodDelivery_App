const express=require('express');
const router=express.Router();
const orderModel=require('../dataModels/order_Model');
const customerMiddleware=require('../middlewares/customerAuthentication')
const adminMiddleware=require('../middlewares/adminAuthentication')
const cartModel=require('../dataModels/cart_Model')
const driverMiddleware=require('../middlewares/driverAuthentication');


router.post('/api/customer/addorder',customerMiddleware,async(req,res)=>{
    const {userAddress}=req.body;
    await    cartModel.findOne({UserId:req.user._id}).exec((err,success)=>{
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
              Customer:req.user._id,
              Items:Cart_Items,
              Order_Status:req.body.orderStatus,
              User_Address:userAddress
          })
        Order.save(async(err,order)=>{
              if(err) throw err;
              if(order){
                cartModel.deleteOne({UserId:req.user._id}).exec((err,orderConfirmed)=>{
                  if(err){
                    res.status(400).json({
                      Error:err
                  })
                  }
                  if(orderConfirmed){
                  res.status(201).json({
                    orderConfirmed
                })
              }

                })
                
              }
    
          })
          
      }
  })
   
  
})


router.post('/api/admin/addorder',adminMiddleware,async(req,res)=>{
  const {userAddress}=req.body;
  await    cartModel.findOne({UserId:req.user._id}).exec((err,success)=>{
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
            Customer:req.user._id,
            Items:Cart_Items,
            Order_Status:req.body.orderStatus,
            User_Address:userAddress
        })
      Order.save(async(err,order)=>{
            if(err) throw err;
            if(order){
              cartModel.deleteOne({UserId:req.user._id}).exec((err,orderConfirmed)=>{
                if(err){
                  res.status(400).json({
                    Error:err
                })
                }
                if(orderConfirmed){
                res.status(201).json({
                  orderConfirmed
              })
            }

              })
              
            }
  
        })
        
    }
})
 

})

router.post('/api/admin/driverAssigned/:id',adminMiddleware,async(req,res)=>{
  const {id}=req.params
  const driverID=req.body._id;
  const address=req.body.address
  await orderModel.findOneAndUpdate({_id:id},{Driver:driverID,Pick_Address:address}).exec((err,driverAssigned)=>{
    if(err) throw err;
             if(driverAssigned){
                 res.status(201).json({
                     driverAssigned
                 })
             }

  })


})

router.post('/api/driver/updateOrderStatus',driverMiddleware,async(req,res)=>{

  await orderModel.updateOne(
    { _id: req.body.orderId, "Order_Status.type": req.body.type },
    {
      $set: {
        "Order_Status.$": [
          { type: req.body.type, date: new Date(), isCompleted: true },
        ],
      },
    }
  ).exec((error, order) => {
    if (error) return res.status(400).json({ error });
    if (order) {
      res.status(201).json({ order });
    }
  });

})

router.post('/api/admin/getAllorders',adminMiddleware,async(req,res)=>{
  const orders = await orderModel.find({})
  .populate("Items.ItemId", "Item")
  .exec();
res.status(200).json({ orders });
})

module.exports=router