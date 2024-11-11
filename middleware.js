const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const {listingSchema}= require('./joiSchema.js');
const ExpressError=require('./utilities/ExpressError.js');
const {reviewSchema}= require('./joiSchema.js');

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error" , "You must be logged in to make any change");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
     let listing=await Listing.findById(id);
     if(!res.locals.currentUser || !listing.owner._id.equals(res.locals.currentUser._id)){
      req.flash("error" , "You have no permission to make any change");
      return res.redirect(`/listings/${id}`);
     }
     next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
      throw new ExpressError(400 , error);
    }
    else{
      next();
    }
  }

  module.exports.validatereview = (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error)
    {
      throw new ExpressError(400 , error);
    }
    else{
      next();
    }
  }

  module.exports.isReviewAuthor=async(req,res,next)=>{
    let{rid , id}=req.params;
     let review=await Review.findById(rid);
     if(!res.locals.currentUser || !review.author.equals(res.locals.currentUser._id)){
        req.flash("error" , "You are not the author of this  review");
        return res.redirect(`/listings/${id}`);
       }
     next();
}