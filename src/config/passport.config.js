import passport from "passport";
import GitHubStrategy from 'passport-github2'
import UserModel from "../dao/models/users.model.js";

const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.082ac96a15c5549d',
        clientSecret: 'fb6592dba7a979787ecef9010ebe4ab8f4f3cdd2',
        callbackURL: 'http://localhost:8080/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
            console.log(profile)

            try{
                const user = await UserModel.findOne({email: profile._json.email})

                if (user) {

                    console.log('already registered')
                    return done(null, user)
                }

                const newUser = await UserModel.create({
                    name: profile._json.name,
                    lastname: '',
                    email: profile._json.email,
                    password: ''
                })

                return done(null, newUser)
            } catch {
                return done ('error to login with github' + error)
            }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initializePassport