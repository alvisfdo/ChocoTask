import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Loader from './Loader.jsx';
import Button from "./Button.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useGetOrganizationListQuery, useOrganizationRegisterMutation, useUpdateOrganizationMutation } from '../redux/api/orgApiSlice.js';

import ModalWrapper from './ModalWrapper.jsx';
import { Dialog } from '@headlessui/react';
import Textbox from './Textbox.jsx';
import OrganizationList from './OrganizationList.jsx';

const toastStyle = {
  padding: '16px 24px',
  borderRadius: '8px',
  minHeight: '60px',
  display: 'flex',
  fontSize: '16px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
};

const AddOrganization = ({ open, setOpen, organizationData }) => {
  let defaultValues = organizationData ?? {}; // If organizationData exists, use it as default values
  const { organization } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const { data, refetch } = useGetOrganizationListQuery();
  const [addNewOrganization, { isLoading }] = useOrganizationRegisterMutation();
  const [updateOrganization, { isLoading: isUpdating }] = useUpdateOrganizationMutation();
  
  const handleOnSubmit = async (data) => {
    try {
      if (organizationData) {
        const result = await updateOrganization(data).unwrap();

        // Add a new property before returning it to the frontend
        const updatedOrganizationData = { ...result.organization, newProperty: 'newValue' };

        refetch();
        toast.success("Organization Updated Successfully.", { style: toastStyle });
        setOpen(false);

        setTimeout(() => {
          window.location.reload();
        }, 900);

        if (organizationData?._id === organization?._id) {
          dispatch(setCredentials({ ...organizationData, ...updatedOrganizationData }));
        }
      } else {
        const result = await addNewOrganization(data).unwrap();

        // Add a new property before returning it to the frontend
        const newOrganizationData = { ...result.organization, newProperty: 'newValue' };

        refetch();
        toast.success("New Organization added successfully.", { style: toastStyle });
        setOpen(false);
      }

      setTimeout(() => {
        setOpen(false);
      }, 30);
    } catch (error) {
      console.log(error);
      toast.error(error.data.message, { style: toastStyle });
    }
  };

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
        <Dialog.Title as='h2' className='text-base font-bold leading-6 text-gray-900 mb-4'>
          {organizationData ? "UPDATE ORGANIZATION" : "ADD NEW ORGANIZATION"}
        </Dialog.Title>
        <div className='mt-2 flex flex-col gap-6'>
          <Textbox 
            placeholder="Organization name"
            type="text"
            name="name"
            label="Organization Name"
            className="w-full rounded-lg shadow-lg"
            register={register("name", { required: "Organization name is required!" })}
            error={errors.name ? errors.name.message : ""}
          />
          <Textbox 
            placeholder="Title"
            type="text"
            name="title"
            label="Title"
            className="w-full rounded-lg shadow-lg"
            register={register("title", { required: "Title is required!" })}
            error={errors.title ? errors.title.message : ""}
          />
          <Textbox 
            placeholder="Email Address"
            type="email"
            name="email"
            label="Email Address"
            className="w-full rounded-lg shadow-lg"
            register={register("email", { required: "Email Address is required!" })}
            error={errors.email ? errors.email.message : ""}
          />
          <Textbox 
            placeholder="Contact Number"
            type="text"
            name="contactNumber"
            label="Contact Number"
            className="w-full rounded-lg shadow-lg"
            register={register("contactNumber", { required: "Contact number is required!" })}
            error={errors.contactNumber ? errors.contactNumber.message : ""}
          />
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
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddOrganization;
