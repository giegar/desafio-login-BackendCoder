import fs from "fs"

class ProductManager {
    constructor(path){
        this.products = [];
        this.path = path;
    };

    addID = async () => {

        try{
            const arrayProd = this.products;
            return arrayProd.length+1

        } catch(error) {
            return error
        }
    };

    checkFile = async () => {

        try{
            const existFile = fs.existsSync(this.path)

            if (!existFile) {
                fs.writeFileSync(this.path, JSON.stringify(this.products))

            } else {
                const data = fs.readFileSync(this.path, "utf-8")
                this.products = JSON.parse(data)
            }

        } catch(error) {
            return error
        }
    };

    addProduct = async (product) => {

        try{
            this.checkFile();

            const { title, description, price, thumbnail, code, stock } = product;

            if(this.products.some(product => product.code === code)){
                return "Code already exists";
            }

            if(!title || !description || !price || !thumbnail || !code || !stock){
                return "Please, complete all fields";
            }

            let newProd = {
                id: await this.addID(),
                title,
                description,
                price,
                thumbnail,
                code,
                stock}

            this.products.push(newProd);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products))
            return newProd;

        } catch(error) {
            return error;
        }
        
    };

    getProducts = async () => {

        try{
            this.checkFile();
            return this.products;

        } catch (error) {
            return error;
        }
    };

    getProductById(id) {

        try {
            this.checkFile();

            const product = this.products.find(product => product.id === id);
            if(!product) return "Product not found";
            return product;

        } catch(error) {
            return error
        }
        
    };

    updateProduct = async (product) => {

        try{
            this.checkFile();

            const { id } = product;
            if(!id) return "Invalid ID"

            let productUpdate = this.products.find(product => product.id === id)
            if(!productUpdate) return "Product not found";

            let arrayNew = this.products.filter(prod => prod.id != id)

            let codeExists = this.products.find(prod => prod.code === product.code)
            if (codeExists) return "Code already exists"

            let updatedProduct = {...productUpdate, ...product}
            arrayNew.push(updatedProduct)
            this.products = arrayNew

            await fs.promises.writeFile(this.path, JSON.stringify(this.products))
            return updatedProduct;

        }catch(error){
            return error;
        }
    };

    deleteProduct = async (id) => {

        try {
            this.checkFile();

            let productDelete = this.products.find(prod => prod.id === id)
            if(!productDelete) return "Product not found"

            let arrayNew = this.products.filter((prod) => prod.id != id)

            this.products = arrayNew;

            await fs.promises.writeFile(this.path, JSON.stringify(this.products))
            return productDelete;

        } catch(error){
            return error;
        }
    };
}

const manager = new ProductManager("./src/database/products.json");

//export default ProductManager;

// --------- TESTING: Todo ok

const test = async () => {

    // AGREGAR PRODUCTOS
    /*const newProduct = await manager.addProduct({
        title: "Cepillo de dientes bambú",
        description: "Ecologico y avalado por dentistas",
        price: 1400,
        thumbnail: "none",
        code: 1118,
        stock: 5
     });*/

     // VER TODOS LOS PRODUCTOS
     //const product = manager.getProducts();

     // BUSCAR POR ID
     //const productId = manager.getProductById(2);

     // MODIFICAR PRODUCTO EXISTENTE
     /*const update = await manager.updateProduct({
        id: 3,
        title: "shampoo",
        description: "aclarador manzanilla"})*/ 
    
    // ELIMINAR PRODUCTO
     //const deleteProd = await manager.deleteProduct(1);
    
     // EJECUTAR
     //console.log("Agregar producto", newProduct)
     //console.log("Todos los productos", product)
     //console.log("Producto por ID", productId)
     //console.log("Modificar producto", update)
     //console.log("Producto eliminado", deleteProd)
}
//test()