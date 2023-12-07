import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

class CartManager {

    addCarts = async () => {

        try{

            let cart = {
                products: []
            }

            const newCart = await CartModel.create(cart)
            return newCart;

        }catch(error){
            return error;
        };
    };

    getCarts = async () => {

        try{
            const carts = await CartModel.find()
            return carts;

        }catch(error){
            return error;
        };
    };

    getCartsById = async (id) => {

        try{
            const cart = await CartModel.findById(id)
            if(!cart) return "Cart not found";
            return cart;

        }catch(error){
            return error;
        };
    };

    addProductsCart = async (cartId, productId) => {

        const cartById = await CartModel.findById(cartId)
        if (!cartById) return "Cart not found"

        const productById = await ProductModel.findById(productId)
        if (!productById) return "Producto not found"
        
        // busco el producto dentro del carrito a actualizar    
        let product = cartById.products.find(p => p.product._id == productId)
            
            if (product) {
            // si el producto esta en el carrito, le sumo 1    
                product.quantity++
                console.log("Se sumo 1 tu producto")

            } else {
            // si el producto no existe en el carrito, lo agrego  al array de productos
                cartById.products.push({product: productById, quantity: 1})
                console.log("Se agrego el producto al carrito")
            }  
    };

    showProducts = async (cartId) => {

        let cartById = await CartModel.findById(cartId)
        if (!cartById) return "Cart not found"

        let productInCart = cartById.products

        return productInCart
    }

}

export default CartManager;