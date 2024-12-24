import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import { getInitials } from "../utils"; 
import { MdCheck } from "react-icons/md";
import { useGetOrganizationListQuery } from "../redux/api/orgApiSlice"; 

const OrganizationList = ({ setOrganization, organization }) => {
  const { data, isLoading } = useGetOrganizationListQuery();
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  const handleChange = (organization) => {
    setSelectedOrganization(organization);
    setOrganization(organization ? organization._id : '');
  };

  useEffect(() => {
    if (!isLoading) {
      if (!organization || organization.length === 0) {
        if (data && data.length > 0) {
          const defaultOrganization = data[0];
          setSelectedOrganization(defaultOrganization);
          setOrganization(defaultOrganization._id);
        }
      } else {
        const defaultOrganization = data?.find(org => org._id === organization);
        setSelectedOrganization(defaultOrganization);
      }
    }
  }, [isLoading, data, organization, setOrganization]);

  return (
    <div>
      <p className='text-gray-900'>Organization Name:</p>
      <Listbox
        value={selectedOrganization}
        onChange={handleChange}
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-3 pl-3 pr-10 text-left shadow-lg border border-gray-300 sm:text-md">
            <span className="block truncate">{selectedOrganization ? selectedOrganization.name : "Select an organization"}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <BsChevronExpand className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {data?.map((organization) => (
                <Listbox.Option
                  key={organization._id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={organization}
                >
                  {({ selected }) => (
                    <>
                      <div className={`flex items-center gap-2 truncate ${selected ? "font-medium" : "font-normal"}`}>
                        <div className="w-6 h-6 rounded-full text-white flex items-center justify-center bg-violet-600">
                          <span className="text-center text-[10px]">
                            {getInitials(organization.name)}
                          </span>
                        </div>
                        <span>{organization?.name}</span>
                      </div>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <MdCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default OrganizationList;
