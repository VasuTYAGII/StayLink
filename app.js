if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}


const express = require('express')
const app = express();
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require('./utilities/ExpressError.js');
const mongoose = require('mongoose');
const listingrouter=require("./routes/listings");
const reviewrouter=require("./routes/reviews");
const userrouter=require("./routes/user");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user");
const { error } = require("console");

const dburl=process.env.AltasDB_Url;

main()
.then(()=>{
    console.log("connection successful")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl); 
}

app.set("view engine","ejs")
app.set("views" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});
  store.on("error",()=>{
    console.log("error exists" , error);
  })

const sessioninfo={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  },
};

app.use(session(sessioninfo));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  next();
})

app.listen(8080 , ()=>{
    console.log("Listening to port 8080");
});

app.get("/",(req,res)=>{
    res.render("./listing/home.ejs");
});


// app.get("/newuser",async(req,res)=>{
//   let fakeuser=new User({
//     email:"fakeuser@gmail.com",
//     username:"Fake User",
//   })
//   let regitration=await User.register(fakeuser,"mypassword");
//   res.send(regitration);
// })

app.use("/listings" , listingrouter);
app.use("/listings/:id/reviews" , reviewrouter);
app.use("/" , userrouter);

//other routed
app.all("*" , (req,res,next)=>{
  next(new ExpressError(404 , "Page Not Founded"));
})

app.use((err,req,res,next)=>{
  let {statusCode=500 , message="Some Internal Error Occur"}=err;
  res.status(statusCode).render("error.ejs" , {err});
})


 
