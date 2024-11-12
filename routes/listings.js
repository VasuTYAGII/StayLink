const express = require("express");
const router=express.Router();
const AsyncWrap=require('../utilities/AsyncWrap.js');
const {isLoggedin , isOwner , validateListing}=require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })

  // index route for all listings
  router.route("/")
  .get(AsyncWrap(listingController.index))
  //create route
  .post(isLoggedin , upload.single("listing[image]") , validateListing  , AsyncWrap(listingController.createNewRoute));

  //new route
  router.get("/new", isLoggedin , AsyncWrap(listingController.newRoutePage));  
  
  router.route("/:id")
  //show route for specific id
  .get(AsyncWrap (listingController.showRoute))
  //update route
  .put(isLoggedin, isOwner , upload.single("listing[image]") , validateListing ,AsyncWrap(listingController.updateRoute))
  //delete route
  .delete(isLoggedin, isOwner ,AsyncWrap(listingController.deleteRoute));

  //edit and update route
  router.get("/:id/edit", isLoggedin , isOwner ,AsyncWrap(listingController.editRoute));  

  


  module.exports=router;