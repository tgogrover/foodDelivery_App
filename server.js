const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require("mongoose");

//const { urlencoded } = require('body-parser');
const dotEnv=require('dotenv').config();
const homepageRoutes=require('./ejsRoutes/home')
const path=require('path')
var expressLayouts = require('express-ejs-layouts');
const api_SignInAdminRoute=require('./api/apiSignin');
const api_LoginAdminRoute=require('./api/apilogin');
const api_FoodChoicesRoute=require('./api/apiFoodChoices');
const api_DishRoute=require('./api/apiDish');
const api_RestaurantRoute=require('./api/apiRestaurant');
const routes_SiginUsersRoute=require('./ejsRoutes/users/usersSignin');
const routes_LoginUsersRoute=require('./ejsRoutes/users/usersLogin');

// const multer = require('multer');

// const multerMiddleware=multer();



mongoose.connect('mongodb://localhost:27017/foodDelivery_App',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true});
mongoose.connection.on('error',(err)=>{
console.log(' error connecting with mongodb with'+ err)
});

mongoose.connection.on('connected',()=>{
console.log('mongodb is connected with server successfully')});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
 


// app.use(multerMiddleware.array())



// app.set('views',path.join(__dirname,'ejsFiles'))
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(expressLayouts);


//app.use(routes_LayoutRoute);
app.use(homepageRoutes);
app.use(api_LoginAdminRoute);
app.use(api_SignInAdminRoute);
app.use(api_FoodChoicesRoute);
app.use(api_RestaurantRoute);
app.use(api_DishRoute);


app.use(routes_SiginUsersRoute);
app.use(routes_LoginUsersRoute);



app.listen(process.env.Port,()=>{
    console.log(`server is successfully running on server ${process.env.Port}`)
})