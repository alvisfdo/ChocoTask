import express from "express";
import { isAdminRoute, protectRoute, isSuperUserRoute } from "../middlewares/authMiddleware.js";
import { 
    activateUserProfile, 
    changeUserPassword, 
    deleteUserProfile, 
    getNotificationsList, 
    getTeamList, 
    markNotificationRead, 
    registerUser, 
    updateUserProfile,
    getAdminUsersList 
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register",protectRoute, registerUser);
router.get("/get-team",protectRoute,isAdminRoute,getTeamList);
router.get("/get-admin-user",protectRoute,isAdminRoute, isSuperUserRoute, getAdminUsersList);
router.get("/notifications",protectRoute,getNotificationsList);

router.put("/profile",protectRoute,updateUserProfile);
router.put("/read-noti",protectRoute,markNotificationRead);
router.put("/change-password",protectRoute,changeUserPassword);

//   FOR ADMIN ONLY - ADMIN ROUTES
router.route("/:id").put(protectRoute, isAdminRoute, activateUserProfile).delete(protectRoute, isAdminRoute, deleteUserProfile);
// this is admin route because we activate and delete user profile if we are the admin for this only we needed the id from the frontend
// of the user which admin want to delete and activeate and deactivate the profile

export default router;
