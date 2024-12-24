import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Loader from './Loader';
import Button from "./Button.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice.js';

import ModalWrapper from './ModalWrapper.jsx';
import { Dialog, DialogTitle } from '@headlessui/react';
import Textbox from './Textbox.jsx';
import { useRegisterMutation } from '../redux/api/authApiSlice.js';
import { toast } from 'sonner';
import { useUpdateUserMutation, useGetTeamListQuery, useGetAdminUsersListQuery } from '../redux/api/userApiSlice.js';
import OrganizationList from './OrganizationList.jsx';

const toastStyle = {
  padding: '16px 24px',
  borderRadius: '8px',
  minHeight: '60px',
  display: 'flex',
  fontSize: '16px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
};

const AddUser = ({ open, setOpen, adminEdit, setAdminEdit, userData }) => {
  let defaultValues = userData ?? {}; // so we take the data if it is passed from the users.jsx file
  const { user } = useSelector((state) => state.auth);
  const [organization, setOrganization] = useState(user?.organization || []); // we initialize the team array by the task.team

  const dispatch = useDispatch();

  const {refetch: refetchTeam} = useGetTeamListQuery(); // this is used for only refetch() function...
  const {refetch: refetchAdmins} = useGetAdminUsersListQuery(); // this is used to refetch() the admin users list

  // below is two function for to update and add new user profile and we user tht two different mutation
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [addNewUser, { isLoading }] = useRegisterMutation();

  const handleOnSubmit = async (data) => {
    //on submit of the form we call this function and this data has the data of the all the input fields is there in this form...this is the beahviour of the react-hook-form
    if(adminEdit){
      // Add isAdmin and organization to the request data 
      data.isAdmin = data.role === 'admin';
      data.organization = organization;
    }

    try {
      if (userData) {
        const result = await updateUser(data).unwrap();
        // so if userData is exist then we call this mutation which pass this new data as a body:data and to find the user we take the id from the
        // backend URL query..see the userSlice.js on which backend url i make the request to the backend..

        toast.success("Profile Updated Successfully.", { style: toastStyle });
        setOpen(false); // close the dialog box
        refetchTeam(); // to refresh the user database...
        refetchAdmins();
        
        // setTimeout(() => {
        //   window.location.reload(); // after some time we reload the page because this new user also should be shown up at the dashboard...
        // }, 900);
      if(userData?._id === user?._id){
              // if the id coming from the userData is same as the current login user(user._id) means admin update his own profile..
              // so we update the user info which is stored in local storage with the new updated data..
              // const updatedUserData = { ...userData, ...result };
              dispatch(setCredentials({...userData,...result?.user})); // so we spread out the existing user data with we get the
              // new data as result from the backend result.user so it is update in the localstorage by using this setCredentials function
        }
      }else{
            // if the userData is not exist means new user is added
            const result = await addNewUser({...data,password: data.email}).unwrap();
            // so we call the "addNewUser" mutation function and pass the form data to create a new user in the data base at the backend and also 
            // pass the password as the user's email one which is admin entered
        
        toast.success("New User added successfully..", { style: toastStyle });
        setOpen(false); // close the dialog box
        refetchTeam(); // to refresh the user database...
        refetchAdmins(); // to refresh the user database...
        
        // setTimeout(() => {
        //   window.location.reload(); // after some time we reload the page because this new user also should be shown up at the dashboard...
        // }, 900);
        
      }

      setTimeout(() => {
        setOpen(false);
      },30)
    } catch (error) {
      console.log(error);
      toast.error(error.data.message,{style:toastStyle});
    }
  };
const {register,handleSubmit,formState:{errors},}=useForm({defaultValues}) // if userData is passed from the users.jsx file then it is the edit user profile
  // so we set the all form's field by it's default values...
  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
      {/* same as other dialog box implemntion nothing changed */}
        <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"} {/* if userdata exist then render the "UPDATE PROFILE" text otherwise render the "ADD NEW USER" */}
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            {/* here we render the four differnt text box as per my need.. */}
            <Textbox 
              placeholder="Full name"
              type="text"
              name="name"
              label="Full Name"
              className="w-full rounded-lg shadow-lg"
              register={register("name",{required:"Full name is required!",})}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox 
              placeholder="Title"
              type="text"
              name="title"
              label="Title"
              className="w-full rounded-lg shadow-lg"
              register={register("title",{required:"Title is required!",})}
              error={errors.title ? errors.title.message : ""}
            />
            <Textbox 
              placeholder="Email Address"
              type="email"
              name="email"
              label="Email Address"
              className="w-full rounded-lg shadow-lg"
              register={register("email",{required:"Email Address is required!",})}
              error={errors.email ? errors.email.message : ""}
            />
            <Textbox 
              placeholder="Role"
              type="text"
              name="role"
              label="Role"
              className="w-full rounded-lg shadow-lg"
              register={register("role",{required:"User role is required!",})}
              error={errors.role ? errors.role.message : ""}
            />
            {user?.isSuperUser && adminEdit && ( // Only render OrganizationList for superusers
              <OrganizationList setOrganization={setOrganization} organization={organization} />
            )}
          </div>
          {isLoading || isUpdating ? (
            <div className='py-5'>
              <Loader />
            </div>
          ) : (
            <div className='py-3 mt-4 sm:flex sm:flex-row-reverse gap-4'>
              <Button
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto shadow-xl"
                label="Submit"
              />
              <Button
                type="button"
                className="bg-gray-200 px-5 text-sm font-semibold text-gray-900 sm:w-auto mr-3 shadow-xl"
                onClick={() => setOpen(false)}
                label="Cancel"
              /> {/* when click on the cancel button dialog box closed because open==false */}
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  )
}

export default AddUser