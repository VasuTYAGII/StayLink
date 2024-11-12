const express = require("express");
const router=express.Router({mergeParams : true});
const User=require("../models/user.js");
const AsyncWrap=require('../utilities/AsyncWrap.js');
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js")


//signup
router.route("/signup")
.get(userController.signUpPage)
.post(AsyncWrap(userController.signUp));

//login
router.route("/login")
.get(userController.loginPage)
.post(saveRedirectUrl,
    passport.authenticate('local' , {failureRedirect:"/login" , failureFlash:true}),
    AsyncWrap(userController.login));

//logout
router.get("/logout" , AsyncWrap( userController.logout));

module.exports=router;
