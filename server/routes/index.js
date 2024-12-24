import express from "express";
import userRoutes from "./userRoutes.js";
import taskRoutes from "./taskRoutes.js";
import organizationRoutes from "./organizationRoutes.js";
import authRoutes from "./authRoutes.js";




const router = express.Router();

router.use("/user",userRoutes); // => /api/user/login
router.use("/task",taskRoutes); // => /api/user/taskRoutes
router.use("/org",organizationRoutes); // => /api/user/taskRoutes
router.use("/auth",authRoutes); // => /api/auth/taskRoutes

// here we create a two router with it's different route coming from the userRoutes and taskRoutes

export default router;