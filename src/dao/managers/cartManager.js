import fs from "fs"
import ProductManager from "./productManager.js";

class CartManager {
    constructor(path){
        this.carts = [];
        this.path = path;
    };

    checkFile = async () => {

        try{
            const existFile = fs.existsSync(this.path)

            if (!existFile) {
                fs.writeFileSync(this.path, JSON.stringify(this.carts))

            } else {
                const data = fs.readFileSync(this.path, "utf-8")
                this.carts = JSON.parse(data)
            }

        } catch(error) {
            return error
        }
    };

    addID = async () => {

        try{
            const arrayCarts = this.carts;
            return arrayCarts.length+1

        }catch(error){
            return error;
        }; 
    };

    addCarts = async () => {

        try{
            this.checkFile()

            let newCart = {
                id: await this.addID(),
                products: []
            }

            this.carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts))

            return newCart;

        }catch(error){
            return error;
        };
    };

    getCarts() {

        try{
            this.checkFile();
            return this.carts;

        }catch(error){
            return error;
        };
    };

    getCartsById = async (id) => {

        try{
            this.checkFile();

            const cart = this.carts.find(cart => cart.id === id);
            if(!cart) return "Cart not found";
            return cart;

        }catch(error){
            return error;
        };
    };

    addProductsCart = async (cartId, productId) => {

        // busco el carrito por id
            let cartById = await this.getCartsById(cartId);
            if (!cartById) return "Cart not found"

        // busco el producto por id
            let productById = await products.getProductById(productId);
            if (!productById) return "Producto not found"

        // creo un array de carritos sin el carrito a actualizar
            let cartsAll = await this.getCarts()
            let cartFilter = cartsAll.filter(c => c.id != cartId)

        // busco el producto dentro del carrito a actualizar    
            let prodExists = cartById.products.some((prod) => prod.id === productId)
            
            if (prodExists) {

            // si el producto esta en el carrito, le sumo 1    
                let productInCart = cartById.products.find(prod => prod.id === productId)
                productInCart.quantity++
            // agrego el carrito actualizado al array con el resto de carritos    
                cartFilter.push(cartById)
                this.carts = cartFilter
            // actualizo la base de datos    
                await fs.promises.writeFile(this.path, JSON.stringify(this.carts))
                return cartById;

            } else {

            // si el producto no existe en el carrito, lo agrego  al array de productos
                let product = {"id": productById.id, "price": productById.price, "quantity": 1};
                let productsArray = cartById.products
                productsArray.push(product)

                let cartWithProd = {
                    id: cartById.id,
                    products: [...productsArray]
                }
                    
                // agrego el carrito actualizado al array con el resto de carritos
                cartFilter.push(cartWithProd)
                this.carts = cartFilter
                // actualizo la base de datos
                await fs.promises.writeFile(this.path, JSON.stringify(this.carts))
                return cartWithProd;
            }  
    };

    showProducts = async (cartId) => {

        let cartById = await this.getCartsById(cartId);
        if (!cartById) return "Cart not found"

        let productInCart = cartById.products

        return productInCart
    }
}

const cManager = new CartManager("./src/database/carts.json");
const products = new ProductManager ("./src/database/products.json")

export default CartManager;

// --------- TESTING: Todo OK

const prueba = async () => {

    // AGREGAR CARRITO
    //const addCart = await cManager.addCarts();

    // MOSTRAR TODOS LOS CARRITOS
    //const getCart = await cManager.getCarts();

    // BUSCAR CARRITO POR ID
    //const getCartId = await cManager.getCartsById(3);

    //AGREGAR PRODUCTO AL CARRITO
    //const addProdToCart = await cManager.addProductsCart(2, 2)

    // MOSTRAR LOS PRODUCTOS DE UN CARRITO
    //const productsCart = await cManager.showProducts(3) 

    //console.log("ADD CART", addCart)
    //console.log("GET CART", getCart)
    //console.log("GET CART ID", getCartId)
    //console.log("ADD PRODUCT TO CART", addProdToCart)
    //console.log("PRODUCTS IN CART", productsCart)

}
//prueba();
