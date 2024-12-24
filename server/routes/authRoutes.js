import express from "express";
import { 
    forgotPassword,
    loginUser, 
    logoutUser, 
    resetPassword,
    verifyToken
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login",loginUser);
router.post("/logout",logoutUser);

router.post('/forgotpassword', forgotPassword); 
router.get('/verifyToken/:token', verifyToken);
router.post('/resetpassword', resetPassword)

export default router;
