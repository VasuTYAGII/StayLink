const mongoose = require('mongoose');
const initData=require("./data.js");
const Listing=require("../models/listing.js");
main()
.then(()=>{
    console.log("connection successful")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'6728690eb1de79c1b81a9a00'}))
    await Listing.insertMany(initData.data);
    console.log("DB Updated");
}

initDB();