import express from "express";
import { isAdminRoute, isSuperUserRoute, protectRoute } from "../middlewares/authMiddleware.js";
import {
    registerOrganization,
    getOrganizationList,
    activateOrganizationProfile
} from "../controllers/orgController.js";

const router = express.Router();

router.post("/org-register", protectRoute, isAdminRoute, isSuperUserRoute, registerOrganization);
router.get("/get-org",protectRoute, isAdminRoute, isSuperUserRoute, getOrganizationList);

//   FOR ADMIN ONLY - ADMIN ROUTES
router.route("/:id").put(protectRoute, isAdminRoute, isSuperUserRoute, activateOrganizationProfile);
// this is admin route because we activate and delete user profile if we are the admin for this only we needed the id from the frontend
// of the user which admin want to delete and activeate and deactivate the profile

export default router;
