import { Router } from "express";
import UserModel from "../dao/models/users.model.js";

const sessionRouter = Router()


sessionRouter.post('/register', async (req, res) => {

    const { name, lastname, email, age, password, confirmPassword } = req.body
    if (!name || !lastname || !email || !age || !password || !confirmPassword)
        return res.status(400).json({ status: 'error', message: 'error register'})
    
    console.log("prueba", name, lastname, email, age, password, confirmPassword)

    if (password !== confirmPassword) return res.send("Passwords must match")

    let user = {
        name,
        lastname,
        email,
        age,
        password,
    }

    const existUser = await UserModel.findOne({ email: user.email })

    if (existUser) return res.json({ status: 'error', message: 'email is already registered' })

    await UserModel.create(user)
    res.redirect('/login')
})

sessionRouter.post('/login', async (req, res) => {

    if(req.session.user) return res.send('Already logged')

    const { email, password } = req.body

    if (!email || !password)
    return res.status(400).json({ status: 'error', error: 'all fields required' })

    const userEmail = await UserModel.findOne({ email: email })
    if(!userEmail) return res.status(404).send('User Not Found')

    req.session.user = userEmail
    res.redirect('/products')
})

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.send('Logout error')

        return res.redirect('/')
    })
})

export default sessionRouter; 



