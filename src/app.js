import express from "express";
import session from "express-session";
import { engine } from "express-handlebars";

import { Server } from "socket.io";

import mongoose from "mongoose";
import MongoStore from "connect-mongo";

import * as path from "path";
import __dirname from "./utils.js";

import viewsRouter from "./routes/views.routes.js";
import cartRouter from "./routes/carts.routes.js";
import productRouter from "./routes/products.routes.js";
import sessionRouter from "./routes/session.routes.js";

import MsgModel from "./dao/models/message.model.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";

const urldb = 'mongodb+srv://gise:TNAKBcy8ZgZPOEs8@cluster0.z6bx0jy.mongodb.net/';
const mongoDbName = 'ecommerce'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + "/public"))

// -------- HANDLEBARS CONFIG

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

// ------ SESSIONS

const sessionStore = MongoStore.create({
    mongoUrl: urldb,
    dbName: mongoDbName
})

app.use(session({
    store: sessionStore,
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

initializePassport();
app.use(passport.initialize())
app.use(passport.session())

// ------- ROUTES

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter)
app.use("/sessions", sessionRouter)

// ------ MONGO DB CONNECT

mongoose.connect(urldb, {dbName: mongoDbName})
    .then(() => {
        console.log("DataBase connected")
    })
    .catch(e => {
        console.error("Error connecting to DataBase")
    })

// --------- LISTEN SERVER

const httpServer = app.listen(8080, () => { console.log("Server in port 8080")})
const socketServer = new Server(httpServer)

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