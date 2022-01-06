const express= require('express');
const router=express.Router();
const orderModel=require('../dataModels/order_Model');
const customerMiddleware=require('../middlewares/customerAuthentication')
const adminMiddleware=require('../middlewares/adminAuthentication')
const cartModel=require('../dataModels/cart_Model')



//order products by authorized customer
router.post('/api/customer/addItems_to_cart',customerMiddleware,async(req,res)=>{
    const { Cart_Items}= req.body
    const cartID=cartModel.findOne({UserId:req.user._id})
  await  cartID.exec((err,id)=>{
        if(err) throw err;
        if(id){
          
            //id.Cart_Items.Product
            const item = req.body.Cart_Items.item
           // console.log(Product)

            const productID=id.Cart_Items.find((c) => { return c.ItemId == item})
         //   
            if(productID){
                parseInt
                const evaluate=  parseInt(req.body.Cart_Items.quantity)+  parseInt(productID.Quantity)
                productID.Quantity=evaluate;
                


id.save(({ suppressWarning: true }),(err,data)=>{
    if(err) throw err;
            res.status(201).json({
                     Cart:data
                     })

})
            }else{
                //console.log(cart)
            id.Cart_Items.push({
               
                    ItemId:Cart_Items.item,
                    Quantity:Cart_Items.quantity
                
            });
           id.save((err,insertData)=>{
               console.log(insertData)
                if(err) throw err
                res.status(201).json({
                    Cart:insertData
                })
            })
        }
    }
        else{
           
            const cartData=new cartModel({
                UserId:  req.user._id,
                Cart_Items:{
                    ItemId:Cart_Items.item,
                    Quantity:Cart_Items.quantity
                }
            })
           cartData.save((err,data)=>{
                if(err) throw err;
                else{
                    res.status(201).json({
                        Cart_Items:data
                    })
                }
            })
        }
    })
})

router.post('/api/addItems_to_cart',adminMiddleware,async(req,res)=>{
    const { Cart_Items}= req.body
    const cartID=cartModel.findOne({UserId:req.user._id})
  await  cartID.exec((err,id)=>{
        if(err) throw err;
        if(id){
          
            //id.Cart_Items.Product
            const item = req.body.Cart_Items.item
           // console.log(Product)

            const productID=id.Cart_Items.find((c) => { return c.ItemId == item})
         //   
            if(productID){
                parseInt
                const evaluate=  parseInt(req.body.Cart_Items.quantity)+  parseInt(productID.Quantity)
                productID.Quantity=evaluate;
                


id.save(({ suppressWarning: true }),(err,data)=>{
    if(err) throw err;
            res.status(201).json({
                     Cart:data
                     })

})
            }else{
                //console.log(cart)
            id.Cart_Items.push({
               
                    ItemId:Cart_Items.item,
                    Quantity:Cart_Items.quantity
                
            });
           id.save((err,insertData)=>{
               console.log(insertData)
                if(err) throw err
                res.status(201).json({
                    Cart:insertData
                })
            })
        }
    }
        else{
           
            const cartData=new cartModel({
                UserId:  req.user._id,
                Cart_Items:{
                    ItemId:Cart_Items.item,
                    Quantity:Cart_Items.quantity
                }
            })
           cartData.save((err,data)=>{
                if(err) throw err;
                else{
                    res.status(201).json({
                        Cart_Items:data
                    })
                }
            })
        }
    })
})
//customer can view their orders through this routes
router.get('/api/customer/viewCart/:id',customerMiddleware,async(req,res)=>{
    const id=req.params.id;
 await   cartModel.findOne({UserId:id})
 .populate("Cart_Items.ItemId"," Name  ReferancePicture  Food_Type  Price").exec((err,Cart)=>{
    if(err) throw err;
    if(Cart){
        console.log(Cart)
    
    res.status(200).json({ Cart });
        

       
    }
    else{
        res.json({
            Message:'no Cart'
        })
    }

})

})





module.exports=router;