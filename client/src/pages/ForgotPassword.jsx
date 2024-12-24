import React, { useState } from 'react'
import Textbox from '../components/Textbox';
import Button from '../components/Button';
import Loader from '../components/Loader';
import {useForm} from "react-hook-form";
import { useForgotPasswordMutation } from '../redux/api/authApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showState, setShowState] = useState(true); // State to toggle the div
  const{register,handleSubmit,formState:{errors},} = useForm();

  const [ login, {isLoading} ] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const submitHandler = async (data) => {
    try {
        const result = await login(data).unwrap();
        toast.success("Your password reset link is on its way! Please check your email for further instructions.",{style:toastStyle}) // toasting with the successful message with custom toast styles...
        navigate("/");
    } catch (error) {
        console.log(error);
        // toast.error('My error toast');
        toast.error(error?.data?.message || error.message,{style:toastStyle});
    }
  };

  const toastStyle = {
    padding: '16px 24px',
    borderRadius: '8px',
    minHeight: '60px',
    display: 'flex',
    fontSize: '16px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };

 
return (
    <>
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row'>
        <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
             {/* this below whole "div" is for the left side rendering of the login page */}
            {/* <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
                <div className='w-full md:max-w-lg 2xl:max-w-xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:mt-20'>
                    <span className='flex gap-1 py-2 border px-3 rounded-full text-sm md:text-base border-gray-300 text-gray-600'>
                        Manage all your task in one place!
                    </span>
                    <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700'>
                        <span>Cloud-Based</span>
                        <span>Task Manager</span>
                    </p>
                    <div className='cell'>
                        <div className='circle rotate-in-up-left'></div>
                    </div>
                </div>
            </div> */}
            {/* this below whole "div" is for the right side rendering of the login page */}
            <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col jusitfy-center items-center'>
            <form onSubmit={handleSubmit (submitHandler)} className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 py-14'>
                {/* when we submit the form then it called this submit handler function which has make the request on the server with the required user credentials */}
                    <div className='text-center'>
                        <p className='choco-font-login'>
                            ChocoTask
                        </p>
                        <p className='welcome-message'>
                            Welcome back!
                        </p>
                        <p className='text-base text-gray-700'>
                            Keep all your credentials safe!
                        </p>
                    </div>
                    {showState && ( // Conditionally render the div based on showState
                    
                    <div className='flex flex-col gap-y-5'>
                        <Textbox
                            placeholder="email@example.com"
                            type="email"
                            name="email"
                            label="Email Address"
                            className="w-full rounded-full"
                            register={register("email",{
                                required:"Email Address is required!",
                            })}
                            error={errors.email ? errors.email.message:""}
                        />
                        {/* register("email", {...}) registers the input field with the form. 
                        It tells react-hook-form to track the value, validation, and any errors related to the "email" field. */}

                        {isLoading ? <Loader /> : <Button
                            type="submit"
                            label="Submit"
                            className='w-full h-10 bg-blue-700 text-white'
                        />}
                        <Link to='/log-in'> 
                            <Button type='button' label='Back to Login' className='w-full h-10 bg-blue-700 text-white' /> 
                        </Link> 
                    </div>
                    
                
                )} 
                {!showState && <p>{message}</p>} {/* Conditionally show the message */}
                </form>
            </div>
        </div>
    </div>
    {/* <ChangePassword open={openPassword} setOpen={setOpenPassword}/> */}
    </>
    // css information : 
    // 2xl:max-w-xl: Sets the maximum width to xl size on extra-large screens and above.
    // flex: Applies flexbox layout.
    // flex-col: Arranges child elements in a column (vertically).
    // flex-row: Arranges child elements horizontally in a row.
    // items-center: Centers items vertically.
    // justify-center: Centers items horizontally.
    // lg:w-2/3: Sets the width to 2/3 of the container on large screens and above
    // gap-5: Adds a gap of 5 units between flex items.
    )

}

export default ForgotPassword