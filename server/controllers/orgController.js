import { response } from "express";
import Organization from "../models/organization.js";
import Notice from "../models/notification.js"
import { createJWT } from "../utils/index.js";

export const registerOrganization = async (req, res) => {
    try {
        const { name, email, contactNumber, title, isAdmin } = req.body; // Destructuring the request body to get organization details..this request coming from the frontend side
        
        const orgExist = await Organization.findOne({ email }); // Checking if a organization with the given email already exists
        const orgExistByName = await Organization.findOne({ name }); // Checking if a organization with the given name already exists

        if (orgExist || orgExistByName) {
            return res.status(400).json({
                status: false,
                message: "Organization already exists", // Sending a response if the organization already exists
            });
        }
        
        const organization = await Organization.create({ name, email, contactNumber, title }); // Creating a new organization in the data base using the Organization model

        if (organization) {
            // isAdmin ? createJWT(res, organization._id) : null; // Creating a JWT for the organization if they are an admin..because admin can only register
            // so we check here if organization is admin then create token and send back to the organization as a response

           res.status(201).json(organization); // Sending the created organization as a response
        } else {
            return res.status(400).json({ status: false, message: "Invalid organization data" }); // Sending a response if organization creation failed
        }
    } catch (error) {
        console.log(error); // Logging the error
        return res.status(400).json({ status: false, message: error.message }); // Sending a response if an error occurred
    }
};

export const getOrganizationList = async (req, res) => {
    // this function for the get the all organizations awailable in the data base
    try {
        const organizations = await Organization.find().select("name email contactNumber title isActive"); // Retrieving the list of organizations with selected fields
        // find all "organizations" because we dont specify any condition in the find() function and select the appropiate the field using the select function
        
        res.status(200).json(organizations); // Sending the list of organizations as a response
    } catch (error) {
        console.log(error); // Logging the error
        return res.status(400).json({ status: false, message: error.message }); // Sending a response if an error occurred
    }
};

export const updateOrganizationProfile = async (req, res) => {
    try {
        const { organizationId, isAdmin } = req.organization; // Destructuring to get organizationId and isAdmin from the request object
        const { _id, name, email } = req.body; // Destructuring to get _id, name, and email from the request body...request body means from the frontend side
        // we send the data to the backend with the api request here it is destructured as the req.body

        // console.log(name, email); // Logging the name and email
        const id = isAdmin && organizationId === _id ? organizationId : isAdmin && organizationId !== _id ? _id : organizationId; // Determining the organization ID to be updated
        // isAdmin: This checks if the logged-in organization has admin privileges.
        // organizationId === _id: This checks if the logged-in organization is updating their own profile.
        // If both conditions are true, it sets id to organizationId, meaning the admin is updating their own profile.
        // isAdmin: This checks if the logged-in organization has admin privileges.
        // organizationId !== _id: This checks if the logged-in organization is updating someone else's profile.
        // If both conditions are true, it sets id to _id, meaning the admin is updating another organization's profile.
        // If neither of the above conditions are true, it sets id to organizationId, meaning the organization can only update their own profile if they are not an admin.

        const organization = await Organization.findById(id); // Finding the organization by ID

        if (organization) {
            organization.title = req.body.title || organization.title; // Updating the title if provided
            organization.role = req.body.role || organization.role; // Updating the role if provided

            const organizationExist = await Organization.findOne({ email }).find({ _id: { $ne: id } }); // Checking if another organization with the same email exists
            const organizationExist2 = await Organization.findOne({ name }).find({ _id: { $ne: id } }); // Checking if another organization with the same name exists

            if (organizationExist.length > 0 || organizationExist2.length > 0) {
                return res.status(400).json({
                    status: false,
                    message: "Organization already exists", // Sending a response if a organization with the same email or name already exists
                });
            } else {
                organization.name = name; // Updating the name
                organization.email = email; // Updating the email
            }

            const updatedOrganization = await organization.save(); // Saving the updated organization
            organization.password = undefined; // Removing the password from the organization object before sending the response to the frontend

            res.status(201).json({
                status: true,
                message: "Profile Updated Successfully.",
                organization: updatedOrganization, // Sending the updated organization as a response
            });
        } else {
            return res.status(400).json({ status: false, message: "Organization not found" }); // Sending a response if the organization is not found
        }
    } catch (error) {
        console.log(error); // Logging the error
        return res.status(400).json({ status: false, message: error.message }); // Sending a response if an error occurred
    }
};

export const activateOrganizationProfile = async (req, res) => {
    try {
        const { id } = req.params; // Get the organization ID from the request's URL parameters...means at the frontend side when we make the 
        // request on the specific URL then with this URL params is passed with denote with the (:) colon..
        // ex. For example, in a route like /organizations/:organizationId, req.params.organizationId would give you the value of organizationId from the URL.

        const organization = await Organization.findById(id); // Find the organization by ID

        if (organization) { // If the organization exists
            organization.isActive = req.body.isActive; // Update the organization's isActive status with the value from the request body

            await organization.save(); // Save the updated organization

            res.status(201).json({
                status: true,
                message: `Organization account has been ${organization?.isActive ? "activated" : "disabled"}`, // Send a success response with a message based on isActive status
            });
        } else {
            return res.status(400).json({ status: false, message: "Organization not found" }); // Send a organization not found response
        }
    } catch (error) {
        console.log(error); // Log any errors
        return res.status(400).json({ status: false, message: error.message }); // Send an error response
    }
};

export const deleteOrganizationProfile = async (req, res) => {
    try {
        const { id } = req.params; // Get the organization ID from the request's URL parameters...like above req.params we take the id
        // and on this URL request made by the frontend side..

        await Organization.findByIdAndDelete(id); // Find and delete the organization by ID

        res.status(200).json({ status: true, message: "Organization deleted successfully." }); // Send a success response
    } catch (error) {
        console.log(error); // Log any errors
        return res.status(400).json({ status: false, message: error.message }); // Send an error response
    }
};
