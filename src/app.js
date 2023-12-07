import express from "express";
import session from "express-session";
import { Server } from "socket.io";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

import viewsRouter from "./routes/views.routes.js";
import cartRouter from "./routes/carts.routes.js";
import productRouter from "./routes/products.routes.js";
import sessionRouter from "./routes/session.routes.js";
import MsgModel from "./dao/models/message.model.js";

import { engine } from "express-handlebars";
import * as path from "path";
import __dirname from "./utils.js";

const urldb = 'mongodb+srv://gise:TNAKBcy8ZgZPOEs8@cluster0.z6bx0jy.mongodb.net/';
const mongoDbName = 'ecommerce'

// --------- SERVER

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(8080, () => { console.log("Server in port 8080")})
const socketServer = new Server(httpServer)

// ------- ROUTER

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter)
app.use("/api/session", sessionRouter)

// ------- STATIC

app.use("/", express.static(__dirname + "/public"))

// -------- HANDLEBARS

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

// -------- WEBSOCKETS

socketServer.on('connection', async (socket) => {
    console.log('New client connected')
    
    // REAL TIME PRODUCTS
    socket.on('newProduct', data =>{
        socketServer.emit('refreshProducts', data)
    }); 
    
    // CHAT
    const messages = await MsgModel.find();
    socket.emit('logs', messages)

    socket.on('message', async (data) =>{
        const saveMsg = await MsgModel.create({...data})
        if (saveMsg){
            const refresh = await MsgModel.find();
            socketServer.emit('logs', refresh)}
    });
})

// ------ Mongo DB

mongoose.connect(urldb, {dbName: mongoDbName})
    .then(() => {
        console.log("DataBase connected")
    })
    .catch(e => {
        console.error("Error connecting to DataBase")
    })

// ------ Sessions

app.use(session({
    store: MongoStore.create({
        mongoUrl: urldb,
        dbName: mongoDbName
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))




