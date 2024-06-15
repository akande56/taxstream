// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
// import { useForm, UseFormReturn } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Input } from "@/components/ui/input";
// import { AppButton } from "../app/button";
// import { AppSelect, IOption } from "../app/select";
// import { AppModal } from "../app/modal";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// const updateStaffSchema = z.object({
//   fullname: z.string().min(1, "Please enter Full Name"),
//   staffId: z.string().min(1, "Please enter Staff ID"),
//   password: z.string().min(1, "Please enter Password"),
//   role: z.string().min(1, "Please enter Role"),
//   lga: z.string().min(1, "Please enter LGA"),
//   email: z.string().email("Invalid email address").min(1, "Please enter Email"),
//   phoneNumber: z.string().min(1, "Please enter Phone Number"),
// });

// interface UpdateStaffModalProps {
//   open: boolean;
//   onClose: () => void;
//   staff: any; // Define proper type based on your staff structure
//   onUpdate: (data: z.infer<typeof updateStaffSchema>) => void;
//   roleOptions: IOption[];
// }

// const UpdateStaffModal: React.FC<UpdateStaffModalProps> = ({
//   open,
//   onClose,
//   staff,
//   onUpdate,
//   roleOptions,
// }) => {
//   const methods: UseFormReturn<z.infer<typeof updateStaffSchema>> = useForm({
//     resolver: zodResolver(updateStaffSchema),
//     defaultValues: staff,
//   });

//   const handleUpdate = (data: z.infer<typeof updateStaffSchema>) => {
//     onUpdate(data);
//     methods.reset();
//   };

//   return (
//     <AppModal
//       open={open}
//       onCancel={onClose}
//       okButtonProps={{ hidden: true }}
//       cancelButtonProps={{ hidden: true }}
//     >
//       <h1 className="text-2xl font-bold">Update Staff Information</h1>
//       <Form {...methods}>
//         <form
//           className="w-full flex flex-col place-content-center gap-3"
//           onSubmit={methods.handleSubmit(handleUpdate)}
//         >
//           <FormField
//             control={methods.control}
//             name="fullname"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Full Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter Full Name" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex flex-row gap-2">
//             <FormField
//               control={methods.control}
//               name="staffId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Staff ID</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter Staff ID" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={methods.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Change Password</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Enter New Password"
//                       {...field}
//                       type="password"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className="flex flex-row gap-2">
//             <FormField
//               control={methods.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input type="email" placeholder="Enter Email" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={methods.control}
//               name="phoneNumber"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone Number</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter Phone Number" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <FormField
//             control={methods.control}
//             name="role"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel> Change Staff Role</FormLabel>
//                 <FormControl>
//                   <AppSelect
//                     options={roleOptions}
//                     placeholder="Select Role"
//                     onChangeValue={field.onChange}
//                     selectValue={field.value}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={methods.control}
//             name="lga"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Change Staff Location</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter LGA" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="flex gap-3">
//             <AppButton type="submit" label="Update" />
//             <button
//               onClick={onClose}
//               className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-sm transition duration-200 ease-in-out w-full "
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </Form>
//     </AppModal>
//   );
// };

// export default UpdateStaffModal;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { AppButton } from "../app/button";
import { AppSelect, IOption } from "../app/select";
import { AppModal } from "../app/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const updateStaffSchema = z.object({
  fullname: z.string().min(1, "Please enter Full Name"),
  staffId: z.string().min(1, "Please enter Staff ID"),
  password: z.string().min(1, "Please enter Password"),
  role: z.string().min(1, "Please enter Role"),
  lga: z.string().min(1, "Please enter LGA"),
  email: z.string().email("Invalid email address").min(1, "Please enter Email"),
  phoneNumber: z.string().min(1, "Please enter Phone Number"),
});

interface UpdateStaffModalProps {
  open: boolean;
  onClose: () => void;
  staff: any; // Define proper type based on your staff structure
  onUpdate: (data: z.infer<typeof updateStaffSchema>) => void;
  roleOptions: IOption[];
}

const UpdateStaffModal: React.FC<UpdateStaffModalProps> = ({
  open,
  onClose,
  staff,
  onUpdate,
  roleOptions,
}) => {
  const methods: UseFormReturn<z.infer<typeof updateStaffSchema>> = useForm({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: staff,
  });

  useEffect(() => {
    if (staff) {
      methods.reset(staff);
    }
  }, [staff, methods]);

  const handleUpdate = (data: z.infer<typeof updateStaffSchema>) => {
    onUpdate(data);
    methods.reset();
  };

  return (
    <AppModal
      open={open}
      onCancel={onClose}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <h1 className="text-2xl font-bold">Update Staff Information</h1>
      <Form {...methods}>
        <form
          className="w-full flex flex-col place-content-center gap-3"
          onSubmit={methods.handleSubmit(handleUpdate)}
        >
          <FormField
            control={methods.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-2">
            <FormField
              control={methods.control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Staff ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter New Password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-2">
            <FormField
              control={methods.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
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
          </div>
          <FormField
            control={methods.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Change Staff Role</FormLabel>
                <FormControl>
                  <AppSelect
                    options={roleOptions}
                    placeholder="Select Role"
                    onChangeValue={field.onChange}
                    selectValue={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="lga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Change Staff Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter LGA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <AppButton type="submit" label="Update" />
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-sm transition duration-200 ease-in-out w-full "
            >
              Cancel
            </button>
          </div>
        </form>
      </Form>
    </AppModal>
  );
};

export default UpdateStaffModal;
