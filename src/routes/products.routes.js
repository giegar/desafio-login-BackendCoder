import express from "express";
const productRouter = express.Router();
import ProductModel from "../dao/models/product.model.js";
import mongoosePaginate from 'mongoose-paginate-v2';

// Obtener productos + paginacion y filters
productRouter.get("/", async (req, res) => {

    try{
        const limit = parseInt(req.query?.limit ?? 10);
        const page = parseInt(req.query?.page ?? 1);
        const sort = req.query.sort ?? '' ;
        const category = req.query.category ?? '' ;
        const stock = parseInt(req.query.stock) ?? '' ;

        const filter = {
            ...(category && { category }),
            ...(stock && { stock })
        }

        const sortValues = sort === 'asc' ? {price: 1} : ('desc' ? {price: -1} : {})

        const options = {
            limit,
            page,
            sort: sortValues,
            lean: true
        } 

        const pageResults = await ProductModel.paginate(filter, options)

        const totalPages = pageResults.totalPages;
        const prevPage = pageResults.prevPage;
        const nextPage = pageResults.nextPage;
        const currentPage = pageResults.page;
        const hasPrevPage = pageResults.hasPrevPage;
        const hasNextPage = pageResults.hasNextPage;
        const prevLink = hasPrevPage ? `/api/products?page=${prevPage}` : null;
        const nextLink = hasNextPage ? `/api/products?page=${nextPage}` : null;

        res.status(200).json({
            status: 'success',
            payload: pageResults.docs,
            totalPages,
            prevPage,
            nextPage,
            page: currentPage,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        });

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
})

// Buscar un producto especifico
productRouter.get("/:pid", async(req,res) =>{
    const { pid } = req.params;

    try{
        const product = await ProductModel.findById(pid);
        return res.status(200).json({ message: "Product found", product })
    }catch(error){
        return res.status(404).json({ message: error.message })
    }
})

// Crear un producto
productRouter.post("/", async(req, res) =>{

    try{
        const data = req.body;
        const product = await ProductModel.create(data)

        return res.status(200).json({ message: "New product added", product})
        
    } catch(error){
        return res.status(400).json({ message: error.message })
    }
})

// Modificar un producto
productRouter.put("/:pid", async(req, res) =>{

    try{
        let { pid } = req.params;
        let update = req.body;
        await ProductModel.updateOne({ _id: pid }, update)
        const updatedProducts = await ProductModel.find()

        return res.status(200).json({ message: "Product updated", updatedProducts})

    } catch(error){
        return res.status(400).json({ message: error.message })
    }
})

// Eliminar un producto
productRouter.delete("/:pid", async(req,res) =>{
    const { pid } = req.params;

    try{
        const result = await ProductModel.findByIdAndDelete(pid)
        if(result === null) {
            return res.status(404).json({ status: 'error', error: `Product ID ${pid} not found` })
        }
        const updatedProducts = await ProductModel.find().lean().exec()
        return res.status(200).json({ message: "Product deleted", updatedProducts })
    } catch(error){
        return res.status(500).json({ message: error.message })
    }
})

export default productRouter;