
import express from 'express';
import { register,login,logout,sendVerificationOtp,
        verifyEmail,isAuthenticated, resetPassword,
        sendResetOtp} 
        from "../controllers/authController.js";
import userAuth from '../middleware/userAuth.js';

 const authRouter = express.Router();

 authRouter.post("/register", register);
 authRouter.post("/login", login);
 authRouter.post("/logout", logout);
 authRouter.post("/send-verification-otp", userAuth,sendVerificationOtp); 
 authRouter.post("/verify-email",userAuth,verifyEmail); 
 authRouter.post("/is-authenticated", userAuth, isAuthenticated); 
 authRouter.post("/send-reset-otp", userAuth, sendResetOtp);
 authRouter.post("/reset-password", userAuth, resetPassword);

export default authRouter;


