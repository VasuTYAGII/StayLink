const express = require("express");
const router=express.Router({mergeParams : true});
const AsyncWrap=require('../utilities/AsyncWrap.js');
const {isLoggedin,validatereview,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");

//review a airbnb
router.post("/", isLoggedin , validatereview , AsyncWrap(reviewController.createReview));
  
// delete a review 
router.delete("/:rid", isLoggedin , isReviewAuthor , AsyncWrap(reviewController.deleteReview));
  
module.exports=router;
