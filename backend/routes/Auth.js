import express from 'express'
import { CheckUser, Login, Logout, register , verifyEmail , updatePassword , resetPassword } from '../controllers/Auth.js'
import {IsUser} from '../middleware/verifyToken.js'
const AuthRoutes=express.Router()

AuthRoutes.post('/register',register)
AuthRoutes.post('/login',Login)
AuthRoutes.post('/logout',Logout)
AuthRoutes.get('/CheckUser',IsUser,CheckUser)
AuthRoutes.post('/verifyEmail' , verifyEmail)
AuthRoutes.post('/updatePassword' , updatePassword)
AuthRoutes.post('/resetPassword/:token' , resetPassword);

export default AuthRoutes