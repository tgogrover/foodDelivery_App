const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require("mongoose");
//const { urlencoded } = require('body-parser');
const dotEnv=require('dotenv').config();
const homepageRoutes=require('./ejsRoutes/home')

mongoose.connect('mongodb://localhost:27017/foodDelivery_App',{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connection.on('error',(err)=>{
console.log(' error connecting with mongodb with'+ err)
});

mongoose.connection.on('connected',()=>{
console.log('mongodb is connected with server successfully')});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

app.use(express.static('public'));
app.set('view engine','ejs')


app.use(homepageRoutes)



app.listen(3000,()=>{
    console.log(`server is successfully running on server ${process.env.Port}`)
})