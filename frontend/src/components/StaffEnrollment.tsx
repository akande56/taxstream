/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
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
import StaffInfoModal from "./Modal/StaffInfo";
import UpdateStaffModal from "./Modal/StaffUpdate";
import api from "@/api";

const StaffEnrollment = () => {
  // const addStaffSchema = z.object({
  //   fullname: z.string({
  //     required_error: "Please enter Full Name",
  //   }),
  //   // staffId: z.string({
  //   //   required_error: "Please enter Staff ID",
  //   // }),
  //   password: z.string({
  //     required_error: "Please create a Password",
  //   }),
  //   phoneNumber: z.string({
  //     required_error: "Please enter Phone Number",
  //   }),
  //   email: z
  //     .string({
  //       required_error: "Please enter Email",
  //     })
  //     .email({
  //       message: "Invalid email address",
  //     }),
  //   role: z.string({
  //     required_error: "Please enter Role",
  //   }),
  //   lga: z.string({
  //     required_error: "Please enter LGA",
  //   }),
  // });
  const baseSchema = z.object({
    firstName: z.string({
      required_error: "Please enter First Name",
    }),
    lastName: z.string({
      required_error: "Please enter Last Name",
    }),
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
  });

  // Define the schema with conditional fields
  const addStaffSchema = baseSchema
    .extend({
      lga: z.string().optional(),
      ward: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.role === "supervisor2" && !data.lga) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["lga"],
          message: "Please enter LGA for supervisor2",
        });
      }

      if (data.role === "ward_monitor") {
        if (!data.lga) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["lga"],
            message: "Please enter LGA for ward_monitor",
          });
        }
        if (!data.ward) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["ward"],
            message: "Please enter WARD for ward_monitor",
          });
        }
      }
    });
  const [getFilterValue, setFilterValue] = useState<string>("");
  const [getSearch, setSearch] = useState<string>("");
  const [showStaffAddModal, setShowStaffAddModal] = useState<boolean>(false);
  const [showStaffInfoModal, setShowStaffInfoModal] = useState<boolean>(false);
  const [showUpdateStaffModal, setShowUpdateStaffModal] =
    useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [getStaffRoleOptions, setStaffRoleOptions] = useState<IOption[]>([]);
  const [getSelectedStaffRole, setSelectedStaffRole] = useState<string>("");
  const [getStaffs, setStaffs] = useState<any[]>([]);
  const [lga, setLga] = useState<{ value: string; label: string }[]>([]);
  const [ward, setWard] = useState<{ value: string; label: string }[]>([]);
  const [getSelectedLga, setSelectedLga] = useState<string>("");

  const staffform = useForm<z.infer<typeof addStaffSchema>>({
    resolver: zodResolver(addStaffSchema),
    defaultValues: {},
  });

  const fetchWard = async () => {
    const response = await api.get(
      `https://taxstream-3bf552628416.herokuapp.com/api/v1/policy_configuration/lga/${getSelectedLga}`
    );
    const { data } = response;
    let ward: any[] = [];
    for (let wardData of data.lgas_in_ward) {
      ward.push({
        label: `${wardData.area_name} - ${wardData.area_code}`,
        value: wardData.id,
      });

      setWard(ward);
    }
  };

  useEffect(() => {
    if (getSelectedLga) {
      fetchWard();
      console.log("selectedLga has a value:", getSelectedLga);
    }
  }, [getSelectedLga]);

  const fetchStaff = async () => {
    const response = await api.get("/api/v1/user/staff-list");
    const { data } = response;
    if (response.status === 200) {
      setStaffs(
        data.map((staff: any, idx: number) => ({
          key: idx + 1,
          fullname: `${staff.first_name} ${staff.last_name}`,
          staffId: staff.username,
          password: "",
          role: staff.user_role,
          lga: staff.location ? staff.location.name : "",
          email: staff.email,
          phoneNumber: staff.phone,
        }))
      );
    }
  };

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
    setSelectedStaff(staff);
    setShowStaffInfoModal(!showStaffInfoModal);
  };

  const handleEdit = (staff: any) => {
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
      full_name: `${staffData.firstName} ${staffData.LastName}`,
      location: staffData?.lga,
      ward: staffData?.ward,
    };
    console.log(staffCreatedata);
    try {
      const req = await api.post("/api/v1/user/staff", staffCreatedata);
      const { data } = req;
      if (req.status === 201) {
        fetchStaff();
        toast.success(`Staff created successfully`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving staff");
    }
  };
  const onAddStaffSubmit = (data: z.infer<typeof addStaffSchema>) => {
    createStaff(data);
    setShowStaffAddModal(!showStaffAddModal);
    staffform.reset({
      firstName: "",
      lastName: "",
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
      firstName: "",
      lastName: "",
      // staffId: "",
      password: "",
      phoneNumber: "",
      email: "",
      role: "",
      lga: "",
      ward: "",
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

  useEffect(() => {
    const options: IOption[] = [
      { label: "SUPERVISOR/DIRECTOR", value: "supervisor1" },
      { label: "LGA SUPERVISOR/MONITOR", value: "supervisor2" },
      { label: "WARD SUPERVISOR/MONITOR", value: "ward_monitor" },
      { label: "TAX COLLECTOR", value: "tax_collector" },
      { label: "ASSESSMENT OFFICER", value: "assessment_officer" },
      { label: "AUDIT OFFICER", value: "audit_officer" },
    ];

    setStaffRoleOptions(options);

    fetchStaff();

    const fetchInitData = async () => {
      try {
        const fetchLga = await api.get("/api/v1/policy_configuration/lga/");
        const { data } = fetchLga;
        setLga(
          data.map((item: { id: number; name: string; code: string }) => ({
            value: item.id.toString(),
            label: `${item.name} - ${item.code}`,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchInitData();
  }, []);

  return (
    <div className="h-full p-10">
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
              <div className="flex flex-row gap-4">
                <FormField
                  control={staffform.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FULL NAME</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Staff First Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={staffform.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FULL NAME</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Staff Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* <div className="flex flex-row gap-4"> */}
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
              {/* </div> */}
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
              <div className="my-2">
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
                          onChangeValue={(value: any) => {
                            field.onChange(value);
                            setSelectedStaffRole(value.target.value);
                          }}
                          selectValue={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {["supervisor2", "ward_monitor"].includes(
                  getSelectedStaffRole
                ) && (
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
                            onChangeValue={(value: any) => {
                              field.onChange(value);
                              setSelectedLga(value.target.value);
                            }}
                            selectValue={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {getSelectedStaffRole === "ward_monitor" && getSelectedLga && (
                  <FormField
                    control={staffform.control}
                    name="ward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ward</FormLabel>
                        <FormControl>
                          <AppSelect
                            width="w-full"
                            options={ward}
                            placeholder="Select Ward"
                            onChangeValue={field.onChange}
                            selectValue={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

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
