import { Router } from "express";
import passport from "passport";
import UserModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";

const sessionRouter = Router()

sessionRouter.post('/error', async (req, res) => {
    res.send('Error')
})

sessionRouter.get('/github', passport.authenticate('github', {scope: ['user: email']}),
    async (req, res) => {
    
})
sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/error'}),
    async (req, res) => {
        req.session.user = req.user
        console.log('User session setted')

        res.redirect('/products')
})

sessionRouter.post('/register', async (req, res) => {

    const { name, lastname, email, age, password, confirmPassword } = req.body
    if (!name || !lastname || !email || !age || !password || !confirmPassword)
        return res.status(400).json({ status: 'error', message: 'error register'})

    if (password !== confirmPassword) return res.send("Passwords must match")

    let user = {
        name,
        lastname,
        email,
        age,
        password: createHash(password)
    }

    const existUser = await UserModel.findOne({ email: user.email })

    if (existUser) return res.json({ status: 'error', message: 'email is already registered' })

    await UserModel.create(user)
    req.session.user = user
    res.redirect('/products')
})

sessionRouter.post('/login', async (req, res) => {

    const { email, password } = req.body

    if (!email || !password)
    return res.status(400).json({ status: 'error', error: 'all fields required' })

    const user = await UserModel.findOne({ email: email })
    if(!user) return res.status(404).send('User Not Found')

    if(!isValidPassword(user, password)) return res.send('Incorrect password')
    delete user.password

    if(req.session.user) return res.send('Already logged')

    req.session.user = user

    res.redirect('/products')
})

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.send('Logout error')

        return res.redirect('/')
    })
})

export default sessionRouter; 



