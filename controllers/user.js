const User=require("../models/user.js");

module.exports.signUpPage=(req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signUp=async(req,res,next)=>{
    try{
        let {username , email , password}=req.body.user;
    let newUser=new User({
        username,email
    })
    let registeredUser=await User.register(newUser , password);
    req.login(registeredUser,(err)=>{
       if(err){
        return next(err);
       }
       req.flash("success" , "Successfully Created Your Account And LoggedIn");
       res.redirect("/listings");
    })
}
catch(e){
    req.flash("error" , e.message);
    res.redirect("/signup");
}    
};

module.exports.loginPage=(req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success" , "Successfully LoggedIn your account in AIRBNB"); 
    if(res.locals.redirectUrl) 
    {res.redirect(res.locals.redirectUrl);}
    else{
     res.redirect("/listings");
    }
};


module.exports.logout=async(req,res,next)=>{
    req.logOut((err)=>{
       if(err)
        next();
    req.flash("success" ,"succssfully Logged Out");
    res.redirect("/listings");
    })
};
