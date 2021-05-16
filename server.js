const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require("mongoose");
//const { urlencoded } = require('body-parser');
const dotEnv=require('dotenv').config();
const homepageRoutes=require('./ejsRoutes/home')
const path=require('path')
var expressLayouts = require('express-ejs-layouts');
const api_SigninAdminRoute=require('./api/apiSignin');

mongoose.connect('mongodb://localhost:27017/foodDelivery_App',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true});
mongoose.connection.on('error',(err)=>{
console.log(' error connecting with mongodb with'+ err)
});

mongoose.connection.on('connected',()=>{
console.log('mongodb is connected with server successfully')});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
 




//app.set('views',path.join(__dirname,'views'))
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(expressLayouts);


app.use(homepageRoutes);
app.use(api_SigninAdminRoute);



app.listen(process.env.Port,()=>{
    console.log(`server is successfully running on server ${process.env.Port}`)
})