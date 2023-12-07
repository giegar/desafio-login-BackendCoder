import express from "express";
import ProductModel from "../dao/models/product.model.js";
import CartModel from "../dao/models/cart.model.js";
const viewsRouter = express.Router();

// -------- Vistas de login y register 

function sessionFree(req, res, next) {
    // si la sesion existe, redirige
    if(req.session?.user) return res.redirect("/products")
    // si no existe ejecuta la vista
    return next();
}

function sessionRequired(req, res, next) {
    // si existe la sesion, ejecuta la vista
    if(req.session?.user) return next();
    // si no existe redirige al login
    res.redirect('/login')
}

viewsRouter.get("/login", sessionFree, (req, res) => {
    res.render("partials/login", {
        title: "Inicia sesion"
    })
})

viewsRouter.get("/register", sessionFree, (req, res) => {
    res.render("partials/register", {
        title: "Registrate"
    })
})

// -------- Productos con paginacion
viewsRouter.get("/products", sessionFree, async (req, res) => {

    const limit = parseInt(req.query?.limit ?? 10);
    const page = parseInt(req.query?.page ?? 1);
    const category = req.query.category ?? '' ;
    const sort = req.query.sort ?? '' ;
    const stock = parseInt(req.query.stock) ?? '' ;


    const filter = {
        ...(category && { category }),
        ...(stock && { stock }),
    }

    const sortValues = sort === 'asc' ? {price: -1} : ('desc' ? {price: 1} : {})

    const options = {
        limit,
        page,
        sort: sortValues,
        lean: true
    } 

    const pageResults = await ProductModel.paginate(filter, options)
    res.render("partials/products", pageResults)
})

// -------- Home products
viewsRouter.get("/", sessionFree, async (req, res) => {

const products = await ProductModel.find().lean().exec()
    res.render("home", {
        title: "Home",
        product: products
    })
})

// -------- Real Time Products - Websocket
viewsRouter.get("/realTime", sessionRequired, async (req, res) => {
    res.render("partials/realTimeProducts",{
        title: "Real Time",
        product: await ProductModel.find().lean().exec()
    })
})

// -------- WebChat - Websocket
viewsRouter.get("/chat", sessionRequired, async (req, res) => {
    res.render("partials/chat",{
        title: "Live Chat"
    })
})

// ------- Informacion del producto
viewsRouter.get("/product/:pid", sessionRequired, async (req, res) => {
    const { pid } = req.params;
    const product = await ProductModel.findById(pid).lean().exec()
    res.render("partials/product",{
        title: "Detalles",
        product: product
    })
})

// -------- Carrito
viewsRouter.get("/cart/:cid", sessionRequired, async (req, res) => {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid).lean().exec()
    res.render("partials/cart",{
        title: "Cart",
        cart: cart,
    })
})

export default viewsRouter;