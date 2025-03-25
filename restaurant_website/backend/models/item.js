import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String
})
const Item = mongoose.model("item",itemSchema)
export default Item;