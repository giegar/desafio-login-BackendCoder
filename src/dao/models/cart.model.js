import mongoose from "mongoose";

const collection = "carts"

const schemaCart = new mongoose.Schema({
    products: {

    type:[{
        product: {
        type: mongoose.Schema.Types.ObjectId, ref: "productos"},
                    quantity: Number}],
            
    default: []}
})

schemaCart.pre('findOne', function() { this.populate('products.product') })

const CartModel = mongoose.model(collection, schemaCart);

export default CartModel;
