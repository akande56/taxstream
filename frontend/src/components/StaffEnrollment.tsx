/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { AppButton } from "./app/button";
import { AppInput } from "./app/input";
import { AppSelect, IOption } from "./app/select";
import { AppTable } from "./app/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AppModal } from "./app/modal";
import StaffInfoModal from "./StaffInfo";
import UpdateStaffModal from "./StaffUpdate";
import api from "@/api";

const StaffEnrollment = () => {
  const addStaffSchema = z.object({
    fullname: z.string({
      required_error: "Please enter Full Name",
    }),
    // staffId: z.string({
    //   required_error: "Please enter Staff ID",
    // }),
    password: z.string({
      required_error: "Please create a Password",
    }),
    phoneNumber: z.string({
      required_error: "Please enter Phone Number",
    }),
    email: z
      .string({
        required_error: "Please enter Email",
      })
      .email({
        message: "Invalid email address",
      }),
    role: z.string({
      required_error: "Please enter Role",
    }),
    lga: z.string({
      required_error: "Please enter LGA",
    }),
  });

  const [getFilterValue, setFilterValue] = useState<string>("");
  const [getSearch, setSearch] = useState<string>("");
  const [showStaffAddModal, setShowStaffAddModal] = useState<boolean>(false);
  const [showStaffInfoModal, setShowStaffInfoModal] = useState<boolean>(false);
  const [showUpdateStaffModal, setShowUpdateStaffModal] =
    useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [getStaffRoleOptions, setStaffRoleOptions] = useState<IOption[]>([]);
  const [getStaffs, setStaffs] = useState<any[]>([]);
  const [lga, setLga] = useState<{ value: string; label: string }[]>([]);

  const staffform = useForm<z.infer<typeof addStaffSchema>>({
    resolver: zodResolver(addStaffSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const options: IOption[] = [
      { label: "SUPERVISOR/DIRECTOR", value: "supervisor1" },
      { label: "LGA SUPERVISOR/MONITOR", value: "supervisor2" },
      { label: "WARD SUPERVISOR/MONITOR", value: "ward_monitor" },
      { label: "TAX COLLECTOR", value: "tax_collector" },
      { label: "ASSESSMENT OFFICER", value: "assessment_officer" },
      { label: "AUDIT OFFICER", value: "audit_officer" },
      { label: "TAX PAYER", value: "tax_payer" },
    ];

    setStaffRoleOptions(options);
    const staffData = [
      {
        key: "1",
        fullname: "John Doe",
        staffId: "JD01",
        role: "Manager",
        lga: "Location 1",
        email: "johndoe@example.com",
        phoneNumber: "123-456-7890",
        state: 1,
      },
      {
        key: "2",
        fullname: "Jane Smith",
        staffId: "JS02",
        role: "Assistant",
        lga: "Location 2",
        email: "janesmith@example.com",
        phoneNumber: "098-765-4321",
        state: 0,
      },
      {
        key: "3",
        fullname: "Bob Johnson",
        staffId: "BJ03",
        role: "Supervisor",
        lga: "Location 3",
        email: "bobjohnson@example.com",
        phoneNumber: "111-222-3333",
        state: 1,
      },
      {
        key: "4",
        fullname: "Alice Williams",
        staffId: "AW04",
        role: "Employee",
        lga: "Location 4",
        email: "alicewilliams@example.com",
        phoneNumber: "444-555-6666",
        state: 0,
      },
      {
        key: "5",
        fullname: "Charlie Brown",
        staffId: "CB05",
        role: "Manager",
        lga: "Location 5",
        email: "charliebrown@example.com",
        phoneNumber: "777-888-9999",
        state: 1,
      },
    ];
    setStaffs(staffData);

    const fetchInitData = async () => {
      try {
        const fetchLga = await api.get("/api/v1/policy_configuration/lga/");
        const { data } = fetchLga;
        console.log(data);
        setLga(
          data.map((item: { id: number; name: string }) => ({
            value: item.id.toString(),
            label: item.name,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchInitData();
  }, []);

  const handleUpdateStaff = (data: any) => {
    // Simulate API call
    setTimeout(() => toast.success(`Staff Updated successfully`), 5000);
    setShowUpdateStaffModal(false);
    // axios.put(API_URL, data).then(response => {
    //   toast.success(`Staff Updated successfully`);
    // }).catch(error => {
    //   toast.error("Error");
    // });
  };
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleView = (staff: any) => {
    console.log(staff);
    setSelectedStaff(staff);
    setShowStaffInfoModal(!showStaffInfoModal);
  };

  const handleEdit = (staff: any) => {
    console.log(staff);
    setSelectedStaff(staff);

    setShowUpdateStaffModal(!showUpdateStaffModal);
  };

  const handleAddStaff = () => {
    setShowStaffAddModal(true);
  };

  const createStaff = async (staffData: any) => {
    const staffCreatedata = {
      email: staffData.email,
      password: staffData.password,
      phone: staffData.phoneNumber,
      user_role: staffData.role,
      full_name: staffData.fullname,
      location: staffData.lga,
    };
    console.log(staffCreatedata);
    try {
      const req = await api.post("/api/v1/user/staff", staffCreatedata);
      const { data } = req;
      console.log(data);
      toast.success(`Staff created successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Error saving staff");
    }
  };
  const onAddStaffSubmit = (data: z.infer<typeof addStaffSchema>) => {
    console.log("data", data);
    createStaff(data);

    toast.success(`Staff Added successfully`);
    setShowStaffAddModal(!showStaffAddModal);
    staffform.reset({
      fullname: "",
      // staffId: "",
      password: "",
      phoneNumber: "",
      email: "",
      role: "",
      lga: "",
    });
    // Add your axios request here if needed
  };

  const closeModal = () => {
    setShowStaffAddModal(false);
    staffform.reset({
      fullname: "",
      // staffId: "",
      password: "",
      phoneNumber: "",
      email: "",
      role: "",
      lga: "",
    });
  };
  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Staff ID",
      dataIndex: "staffId",
      key: "staffId",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Location",
      dataIndex: "lga",
      key: "lga",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Status",
      key: "state",
      render: (val: any, record: any) => (
        <div className="flex items-center gap-3 text-primary text-sm">
          <button className={`${val === 0 && "text-red-500"}`}>
            {val === 0 ? "Inactive" : "Active"}
          </button>
          <button
            className=" border rounded-sm py-2 px-4"
            onClick={() => handleEdit(record)}
          >
            Edit
          </button>
          <button
            className=" border rounded-sm py-2 px-4"
            onClick={() => handleView(record)}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full p-10">
      <Toaster richColors position="top-right" />
      <div className="w-full shadow-lg h-full border">
        <AppModal
          open={showStaffAddModal}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          onCancel={closeModal}
        >
          <h1 className="text-2xl font-bold">Add New Staff</h1>
          <Form {...staffform}>
            <form
              className="w-full flex flex-col gap-3"
              onSubmit={staffform.handleSubmit(onAddStaffSubmit)}
            >
              <FormField
                control={staffform.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FULL NAME</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Staff Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-4">
                {/* <FormField
                  control={staffform.control}
                  name="staffId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>STAFF ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Staff ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={staffform.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter Password"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row gap-4">
                <FormField
                  control={staffform.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={staffform.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={staffform.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <AppSelect
                        options={getStaffRoleOptions}
                        placeholder={"Select Staff Role"}
                        onChangeValue={field.onChange}
                        selectValue={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={staffform.control}
                name="lga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LGA</FormLabel>
                    <FormControl>
                      <AppSelect
                        width="w-full"
                        options={lga}
                        placeholder="Select LGA"
                        onChangeValue={field.onChange}
                        selectValue={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <AppButton type="submit" label="Save" />
                <button
                  onClick={closeModal}
                  className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-sm transition duration-200 ease-in-out w-full "
                >
                  Cancel
                </button>
              </div>
            </form>
          </Form>
        </AppModal>
        <StaffInfoModal
          open={showStaffInfoModal}
          // visible={showStaffInfoModal}
          onClose={() => setShowStaffInfoModal(false)}
          staff={selectedStaff}
        />

        <UpdateStaffModal
          open={showUpdateStaffModal}
          // visible={showUpdateStaffModal}
          onClose={() => setShowUpdateStaffModal(false)}
          staff={selectedStaff}
          onUpdate={handleUpdateStaff}
          roleOptions={getStaffRoleOptions}
        />
        <div className="flex px-5 py-3 border-b gap-1">
          <AppButton
            width="2/4"
            label="Add Staff"
            icon={<PlusIcon />}
            onClick={handleAddStaff}
          />
          <AppSelect
            placeholder="Filter By"
            selectValue={getFilterValue}
            onChangeValue={handleFilterChange}
            options={[
              { label: "Test 1", value: "test-1" },
              { label: "Test 2", value: "test-2" },
            ]}
          />
          <AppInput
            placeholder="Search"
            inputValue={getSearch}
            onChangeValue={handleSearchChange}
          />
        </div>
        <AppTable columns={columns} dataSource={getStaffs} pagination={false} />
      </div>
    </div>
  );
};

export default StaffEnrollment;
