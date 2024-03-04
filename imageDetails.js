const mongoose = require("mongoose");
const ImageDetailsScehma = new mongoose.Schema(
  {
   image:[String],
   name:String,
   select:String,
   password:String,
   fileid:String,
   date:String,
   code:String,
   location:String,
   QrGet:String,
   Qrcode:String,
   userId:{type:mongoose.Schema.Types.ObjectId,ref:"UserInfo"}
  },
  {
    collection: "ImageDetails",
  }
);

mongoose.model("ImageDetails", ImageDetailsScehma);