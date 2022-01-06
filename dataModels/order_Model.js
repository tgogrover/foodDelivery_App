const mongoose = require("mongoose");
// A
const orderSchema = new mongoose.Schema(
  {
    Customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   User_Address:{
      type:String,
     
    },
    Items: [
      {
        ItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        Quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    Order_Status: [
      {
        type: {
          type: String,
          enum: ["Order Accepted","Food Cooking","Items Picked","Enroute", "Delivered" , "Canceled"],
          default: "Order Accepted",
        },
        date: {
          type: Date,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    Driver:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
