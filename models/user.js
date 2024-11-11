const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passposrlocalmongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
})

userSchema.plugin(passposrlocalmongoose);

module.exports=mongoose.model("User",userSchema);