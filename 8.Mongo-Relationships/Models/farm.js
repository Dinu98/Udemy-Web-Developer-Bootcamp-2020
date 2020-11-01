const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/asd', {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    console.log("Successfully connected");
})
.catch( err => {
    console.log("Error while trying to connect");
    console.log(err);
});

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:String,
    price:Number
});

const farmSchema = new Schema({
    name:String,
    products: [{type: Schema.Types.ObjectId, ref: "Product"}]
});

const Product = mongoose.model("Product",productSchema);
const Farm = mongoose.model("Farm",farmSchema);

const addFarm = async () => {
    await Farm.deleteMany({});
    await Product.deleteMany({});
    const farm = new Farm({ name: "Farm"});
    const product = new Product({ name: "Product", price: 3});
    await product.save();
    farm.products.push(product);
    await farm.save();
};

addFarm();

Farm.findOne({ name: "Farm"})
.populate("products")
.then( farm => console.log(farm));

