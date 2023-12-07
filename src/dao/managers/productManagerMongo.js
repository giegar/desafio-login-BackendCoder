import productModel from "../models/product.model.js";

class ProductManager {

    validateCode = async (code) => {
        try{ 
            const data = await productModel.find()
            console.log(data)
            // console.log(data.some((product) => product.code == code))
            return data.some((product) => product.code == code)
        } catch (error) {
            return error
        }
    };

    getProducts = async () => {

        try{
            const data = await productModel.find().lean().exec()
            return data;

        } catch (error) {
            return error;
        }
    };

    addProduct = async (product) => {

        try{
            
            const { title, description, price, thumbnail, code, stock } = product;

            const validate = await this.validateCode(product.code)
            if (validate) return "Code already exists";

            if(!title || !description || !price || !thumbnail || !code || !stock){
                return "Please, complete all fields";
            }

            const create = await productModel.create(product)
            return create;

        } catch(error) {
            return error;
        }
        
    };

    getProductById = async (id) => {

        try {
            const product = await productModel.findById(id)
            if(!product) return "Product not found";
            return product;

        } catch(error) {
            return error
        }
    };

    updateProduct = async (id, product) => {

        try{
            const validateID = await productModel.findById(id)
            if (!validateID) return "Invalid ID"

            const updatedProduct = await productModel.updateOne({_id: id}, {$set: product})

            const validateCod = await this.validateCode(product.code)
            if (validateCod) return "Code already exists"

            return updatedProduct;

        }catch(error){
            return error;
        }
    };

    deleteProduct = async (id) => {

        try {

            const productExists = await productModel.findById(id)
            if(!productExists) return "Product not found"

            const productDelete = await productModel.deleteOne({_id: id})

            return productDelete;

        } catch(error){
            return error;
        }
    };
}


export default ProductManager