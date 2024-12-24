import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResetPasswordMutation } from '../redux/api/authApiSlice';
import { toast } from 'sonner';
import Textbox from '../components/Textbox';
import Loader from '../components/Loader';
import Button from '../components/Button';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const query = useQuery();
  const [token, setToken] = useState('');
  const toastStyle = {
    padding: '16px 24px',
    borderRadius: '8px',
    minHeight: '60px',
    display: 'flex',
    fontSize: '16px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [changeUserPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = query.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [query]);

  const handleOnSubmit = async (data) => {
    if (data.password !== data.cpass) {
      toast.error("Passwords don't match", { style: toastStyle });
      return;
    }
    try {
      data.token = token;
      const res = await changeUserPassword(data).unwrap();
      toast.success("Password changed successfully.", { style: toastStyle });
      setTimeout(() => {
        navigate("/log-in");
      }, 30);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.data);
    }
  };

  return (
    <>
      <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row'>
        <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
          <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col jusitfy-center items-center'>
            <form onSubmit={handleSubmit(handleOnSubmit)} className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 py-14'>
              <div className='text-center'>
                <p className='choco-font-login'>
                  ChocoTask
                </p>
                <p className='welcome-message'>
                  Reset Password
                </p>
                <p className='text-base text-gray-700'>
                  Keep all your credentials safe!
                </p>
              </div>

              <div className='mt-2 flex flex-col gap-6'>
                <Textbox
                  placeholder="New Password"
                  type="password"
                  name="password"
                  label="New Password"
                  className="w-full rounded-lg shadow-lg"
                  register={register("password", {
                    required: "New Password is required!",
                  })}
                  error={errors.password ? errors.password.message : ""}
                />
                <Textbox
                  placeholder="Confirm New Password"
                  type="password"
                  name="cpass"
                  label="Confirm New Password"
                  className="w-full rounded-lg shadow-lg"
                  register={register("cpass", {
                    required: "Confirm New Password is required!",
                  })}
                  error={errors.cpass ? errors.cpass.message : ""}
                />
              </div>
              {isLoading ? (
                <div className='py-5'>
                  <Loader />
                </div>
              ) : (
                <div className='py-3 mt-4 sm:flex sm:flex-row-reverse gap-4'>
                  <Button
                    type="submit"
                    className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto shadow-xl"
                    label="Save"
                  />
                  <Button
                    type="button"
                    className="bg-gray-200 px-5 text-sm font-semibold text-gray-900 sm:w-auto shadow-xl"
                    onClick={() => navigate('/log-in')}
                    label="Cancel"
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
