import React, { useState } from 'react'
import Button from '../components/Button.jsx';
import { IoMdAdd } from 'react-icons/io';
import Title from '../components/Title.jsx';
import { getInitials } from '../utils/index.js';
import clsx from 'clsx';
import { summary } from '../assets/data.js';
import AddOrganization from "../components/AddOrganization.jsx";
import ConfirmatioDialog, {OrganizationAction} from "../components/Dialogs.jsx";
import ConfirmationDialog from "../components/Dialogs.jsx"
import AddTask from '../components/task/AddTask.jsx';
import { useDeleteOrganizationMutation, useGetOrganizationListQuery, useOrganizationActionMutation } from '../redux/api/orgApiSlice.js';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice.js';
import { useEffect } from 'react';

const Organizations = () => {

  useEffect(() => {
    if (user?.isSuperUser == false) {
      navigate("/dashboard");
    };
  }, []);

  const toastStyle = {
    padding: '16px 24px',
    borderRadius: '8px',
    minHeight: '60px',
    display: 'flex',
    fontSize: '16px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative'
};
  const [openDialog, setOpenDialog] = useState(false);
  const[open,setOpen] = useState(false);
  const[openEdit,setOpenEdit] = useState(false);
  const[openAction,setOpenAction] = useState(false);
  const[selected,setSelected] = useState(null);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState(null);

  const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);


  const {data,isLoading,refetch} = useGetOrganizationListQuery(); // this is for to get the all the organizations awailable in the database..ignore the name getOrganizationList it is not relavent to it's operation..
  // so this is the GET query
  
  // below this two is the admin can only perform and both is the mutation function
  const[deleteOrganization] = useDeleteOrganizationMutation(); // this is for the delete the organization from the data base
  const[organizationAction] = useOrganizationActionMutation(); // this is for the active and disable the organization


  // console.log(data);
  const organizationActionHandler = async () => {
    try {
      const result  = await organizationAction({
        isActive: !selected?.isActive, // so selected has the current organization on which's state admin want to change..so we toggle it state false or true by curent state
        id:selected?._id,
      }); // see the backend function getOrganization it required the params as a /:id and required the isActive state as the body..so here i pass the isActive as a body with the api request
      // and also pass the id in the body just in case if it is required but in backend we take the id from the params /:id means from the URL
      refetch(); // refetch function is provided with the GET request means query function so that request has the refetch function in it's object..so it automatically
      // refresh the data without loading the page
      toast.success(result.data.message,{style:toastStyle});
      setSelected(null);
      setOpenAction(false); // to close the confirmation dialog box which is for to activate or disable the organization account..
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.message, {style:toastStyle})
    }
  };
  const deleteHandler = async () => {
    try {
      const result = await deleteOrganization(selected); // it pass the only id of the organization which we store in the selected state before
      //  when admin clicked on the delete button..so by using this id in backend we delete this organization from data base
      refetch(); // refetch the updated data into database and refesh the data base
      toast.success("Deleted Successfully.",{style:toastStyle});
      setSelected(null); // set the selected state to null for further operation(like delete or change organization state)
      setOpenDialog(false); // close the dialog
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.message, {style:toastStyle})
    }
  };

  const organizationStatusClick = (el) => {

      setSelected(el); // this state the store the organization data which admin want to change it's state
      // means when admin click on the active or disable button then it call this functionn and set the selected state by that organization
      setOpenAction(true); // and open the dialog box
  }
  const deleteClick = (id) => {
    // when admin/organization click on the delete button then we set this state type and msg and pass in the confirmation dialog as a prop to render the button and message according this..
    // and also set the selected state by the organization's id which admin want to delete
    setType("delete");
    setMsg("Are you sure? you want to delete the selected record?");
    setSelected(id);
    setOpenDialog(true); // open the confirmation dialog and passed as a prop to the confirmation dilog
    // setOpenAction(true);

  };
  const editClick = (el) => {
    // when admin click on the edit button then we render this function in which simply we dispatch the function setCredential and spread the already 
    // existing organization with the new updated organization data...
    dispatch(setCredentials({...organization,el}));
    setSelected(el);
    setOpenEdit(true); // set to "true"
  };

  const TableHeader = () => (
    // creating a table header using the <thead> tag and give a title to this table  
    <thead className="border-b border-gray-300">
    {/* this border-b used to do the line at the bottom of the each row */}
      <tr className='text-black text-left'>
        {/* we render the 5 columns for this /organization route... */}
        <th className='py-2'>Name</th>
        <th className='py-2'>Title</th>
        <th className='py-2 line-clamp-1'>Email</th>
        <th className='py-2'>Contact Number</th>
        <th className='py-2'>Active</th>
      </tr>
    </thead>
  );
  const TableRow = ({organization}) => (
    // this is the function to create the only one row with three differnt data cell <td>...and these three <td> comes inside only single <tr> tag table row...
            <tr className='border-b border-gray-300 text-gray-600 hover:bg-gray-400/10'>
            <td className='p-2'>
                <div className='flex items-center gap-3'>
                <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
                  <span className='text-xs md:text-sm text-center'>
                    {getInitials(organization?.name)} {/* to render the organization ICON with first two capital letters */}
                  </span>
                  </div>
                  {organization?.name} {/* render the organization(organization member) name... */}
                </div>
            </td>
            <td className='p-2'>{organization.title}</td>
            <td className='p-2'>{organization.email || "organization.email.com"}</td>
            <td className='p-2'>{organization.contactNumber}</td>
            <td>
              <button 
                  onClick = {() => organizationStatusClick(organization)}
                  className={clsx("w-fit px-4 py-1 rounded-full",organization?.isActive ? "bg-blue-200" : "bg-yellow-100")}>
                    {organization?.isActive ? "Active":"Disabled"} {/* if organization is active then we render the "Active" text... */}
                </button>
            </td>
            <td className='p-3 flex gap-2 md:gap-4 justify-end'>
                {/* here we render the Edit and Delete Button also */}
                <Button
                  className='text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base'
                  label='Edit'
                  type='button'
                  onClick={()=> editClick(organization)}
                /> {/* so when organization click on the Edit button then it set the "open" state variable to true and this is also render the <AddOrganization> component or AddOrganization.jsx file */}
    
              {/* <Button
                className='text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base'
                label='Delete'
                type='button'
                onClick={() => deleteClick(organization?._id)}
                />   */}
                {/* onClick of this button it call the functio deleteClick in which we set the message(msg) anf type variable  and also set the openDialog to "true" to open the dialog box */}
          </td>
            </tr>
    );
  return (
    <>

    <div className='w-full md:px-1 px-0 mb-6'>
      <div className='flex items-center justify-between mb-8'>
      {/* this render the Title and Button "Add New Organization" Button */}
        <Title title="Organization"/>
        <Button
          label="Add New Organization"
          icon={<IoMdAdd className='text-lg'/>}
          className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-xl pr-5 2xl:py-2.5"
          onClick={() => setOpen(true)}
          // here we used the <Button> component which we created already Button.jsx file.... 
          //  when this button got clicked it set the state "open" to true..and it render the AddOrganization.jsx file or component
        />
      </div>
      {/* this is the same as we created in the Table.jsx file and Dashboard.jsx file */}
      <div className='bg-white px-2 md:px-4 py-4 shadow-xl rounded-3xl'>
        <div className='overflow-x-auto'>
          <table className='w-full mb-5'>
            <TableHeader/>
            <tbody>
              {data?.map((organization,index) => (
                // here we run through a loop of organizations and render the <TableRow/> component...for each organization
                <TableRow key={index} organization={organization}/>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    {openEdit ? (
      // so when the openEdit become true then we simply render this AddOrganization component by passing the existing organization data..so all field which has the already data is remain filled with this data
      // and openEdit is not true then admin is clicked on the add new organization button so we render the below AddOrganization component in which we dont pass any data
      // so all fields of the AddOrganization component is remain empty
            <>
              <AddOrganization 
                open={openEdit}
                setOpen={setOpenEdit}
                organizationData={selected}
                key={new Date().getTime().toString()}
            /> {/* we pass the "open" state variable which is responsible for to open this Dialog box and to render the <AddOrganization> component */}
            </>
          ) : (
            <>
                <AddOrganization 
                  open={open}
                  setOpen={setOpen}
                  key={new Date().getTime().toString()}
                />{/* we pass the "open" state variable which is responsible for to open this Dialog box and to render the <AddOrganization> component */}
            </>
          )}
    
    <ConfirmatioDialog
      open={openDialog}
      setOpen={setOpenDialog}
      msg={msg}
      setMsg={setMsg}
      onClick={deleteHandler}
      type={type}
      setType={setType}
    /> {/* now we pass over the "msg" and "type" variable which we needed for the <ConfirmationDialog> component and aso pass the "open" state variable to open up this dialog */}
    <OrganizationAction
      open={openAction}
      setOpen={setOpenAction}
      onClick={organizationActionHandler}
      /> {/* remaining */}
     
    </>
  )
}

export default Organizations