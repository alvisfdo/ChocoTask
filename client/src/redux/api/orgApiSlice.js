import { apiSlice } from "../slices/apiSlice"; // Import the apiSlice from the specified location

const ORG_URL = "/org"; // Define the base URL for organization-related endpoints

export const orgApiSlice = apiSlice.injectEndpoints({ // Define API endpoints using Redux Toolkit's apiSlice.injectEndpoints method
    endpoints: (builder) => ({ // Define the endpoints object using the builder parameter
        updateOrganization: builder.mutation({ // Define an endpoint for updating organization profile information
            query: (data) => ({ // Define the query function for the updateOrganization endpoint
                url: `${ORG_URL}/profile`, // Set the URL for the updateOrganization endpoint
                method: "PUT", // Set the HTTP method as PUT for updating data so that's why here we use the builder.mutation instead of builder.query
                body: data, // Pass the data in the request body for updating the profile
                credentials: "include", // Include credentials in the request for authentication
            }),
        }),

        getOrganizationList: builder.query({ // Define an endpoint for fetching the team list
            query: () => ({ // Define the query function for the getTeamList endpoint
                url: `${ORG_URL}/get-org`, // Set the URL for fetching the team list
                method: "GET", // Set the HTTP method as GET for fetching data
                credentials: "include", // Include credentials in the request for authentication
            }),
        }),

        deleteOrganization: builder.mutation({ // Define an endpoint for deleting a organization
            query: (id) => ({ // Define the query function for the deleteOrganization endpoint
                url: `${ORG_URL}/${id}`, // Set the URL for the deleteOrganization endpoint with the organization ID to be deleted
                method: "DELETE", // Set the HTTP method as DELETE for deleting data
                credentials: "include", // Include credentials in the request for authentication
            }),
        }),

        organizationAction: builder.mutation({ // Define an endpoint for generic organization actions
            query: (data) => ({ // Define the query function for the organizationAction endpoint
                url: `${ORG_URL}/${data.id}`, // Set the URL for the organizationAction endpoint with the organization ID to perform actions on
                method: "PUT", // Set the HTTP method as PUT for performing actions
                body: data, // Pass the data in the request body for performing organization actions
                credentials: "include", // Include credentials in the request for authentication
            }),
        }),

        // Define the register mutation endpoint
        organizationRegister: builder.mutation({
            // Configure the query for the register endpoint and Queries are used to fetch data from the server, such as fetching a organization's profile information, 
            // fetching a list of items, or retrieving specific data based on criteria.
            query: (data) => ({
                url: `${ORG_URL}/org-register`, // Set the URL for the register endpoint
                method: "POST", // Use POST method for registration
                body: data, // Include the data (e.g., organization details) in the request body
                credentials: "include", // Include credentials (e.g., cookies) in the request
            }),
        }),
    }),
});

export const { // Destructure hooks for each API endpoint defined above for use in components
    useGetOrganizationListQuery,
    useUpdateOrganizationMutation,
    useDeleteOrganizationMutation,
    useOrganizationActionMutation,
    useOrganizationRegisterMutation,
} = orgApiSlice;
