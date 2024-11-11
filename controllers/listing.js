const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listing/allroutes.ejs" ,{allListings});
  };

  module.exports.newRoutePage=async(req,res)=>{
    res.render("./listing/newPlace.ejs");
  };

  module.exports.createNewRoute=async(req,res)=>{  
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.image={url , filename};
    newListing.owner=req.user._id;
     await newListing.save();
     req.flash("success","New Listing Created");
     res.redirect("/listings");
 };

 module.exports.showRoute=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing)
    {
      req.flash("error","Listing doesn't exixt");
      return res.redirect("/listings");

    }
    res.render("./listing/show.ejs" , {listing});
  };

  module.exports.editRoute=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing)
      {
        req.flash("error","Listing doesn't exixt");
        return res.redirect("/listings");
        
      }
      let originalImageUrl= listing.image.url;
      newImageUrl=originalImageUrl.replace("/upload" , "/upload/w_250");
    res.render("listing/edit.ejs" ,{listing , newImageUrl})
  };

  module.exports.updateRoute=async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id , {...req.body.listing});
    if(typeof req.file !=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url , filename}; 
       await listing.save();
    }
    req.flash("success","Listing Edited ");
    res.redirect(`/listings/${id}`);
 };

 module.exports.deleteRoute=async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
     res.redirect("/listings");
  }