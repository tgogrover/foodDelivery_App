const express=require('express');
const router=express.Router();
const siginModel=require('../dataModels/signupModel');
const bcrypt=require('bcrypt');



router.post('/api/admin/siginin',async(req,res)=>{
    const {fullName,email,mobileNo,password}=req.body;
    console.log(req.body)
    const Hash_Password=bcrypt.hashSync(password,10);
    const SuccessfullSigin=new siginModel({
        Full_Name:fullName,
        Mobile_Number:mobileNo,
        Password:Hash_Password,
        Email:email,
        Role:'Admin'
    })
await SuccessfullSigin.save((err,signinData)=>{
    if(err) throw err;
    
    if(signinData){
        const {Full_Name,Email}=signinData
        res.status(201).json({
            Name:Full_Name,
            Email:Email,
            message:"data saved succesfully"

        })
    }
    else{
        res.status(400).json({
        message:'Something went wrong'
    })
}

})
})


module.exports=router