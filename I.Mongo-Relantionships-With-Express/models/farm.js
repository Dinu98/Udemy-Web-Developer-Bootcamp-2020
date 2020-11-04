const mongoose = require('mongoose');
const { Schema } = mongoose;
const Product = require("./product");

const farmSchema = new Schema({
    name: String,
    location: String,
    products: [
        {type: Schema.Types.ObjectId, ref: "Product"}
    ]
});

farmSchema.post("findOneAndDelete", async (farm) =>{
    if(farm.products.length){
        await Product.deleteMany({ _id: { $in: farm.products}});
    }
})

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;