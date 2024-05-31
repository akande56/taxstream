// import { useEffect, useState } from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { AppModal } from "./app/modal";
// import { AppSelect } from "./app/select";
// import { AppButton } from "./app/button";
// import axios from "axios";

// const addPayeeSchema = z.object({
//   taxid: z.string({
//     required_error: "Please enter Tax ID",
//   }),
//   firstname: z.string({
//     required_error: "Please enter Full Name",
//   }),
//   lastname: z.string({
//     required_error: "Please enter Full Name",
//   }),
//   email: z
//     .string({
//       required_error: "Please enter Email",
//     })
//     .email({
//       message: "Invalid email address",
//     }),
//   phoneNumber: z.string({
//     required_error: "Please enter Phone Number",
//   }),
//   lga: z.string({
//     required_error: "Please select LGA",
//   }),
//   ward: z.string({
//     required_error: "Please select Ward",
//   }),
//   taxarea: z.string({
//     required_error: "Please select Tax Area",
//   }),
//   businessclassification: z.string({
//     required_error: "Please select Business Classification",
//   }),
//   witholdingtax: z.string({
//     required_error: "Please select Witholding Tax",
//   }),
//   type: z.string({
//     required_error: "Please select Type",
//   }),
//   businessname: z.string({
//     required_error: "Please enter Business Name",
//   }),
//   annualincome: z.string({
//     required_error: "Please enter Annual Income",
//   }),
// });

// interface AddPayeeeModalProps {
//   open: boolean;
//   onClose: () => void;
//   onUpdate: (data: z.infer<typeof addPayeeSchema>) => void;
// }

// const PayeeEnrollmentModal: React.FC<AddPayeeeModalProps> = ({
//   open,
//   onClose,
//   onUpdate,
// }) => {
//   const [lga, setLga] = useState<[]>([]);
//   const [ward, setWard] = useState<[]>([]);
//   const [taxArea, setTaxArea] = useState<[]>([]);
//   const [businessClassification, setBusinessClassification] = useState<[]>([]);
//   const [withholdingTax, setWithholdingTax] = useState<[]>([]);
//   const [type, setType] = useState<[]>([]);

//   const payeeform = useForm<z.infer<typeof addPayeeSchema>>({
//     resolver: zodResolver(addPayeeSchema),
//     defaultValues: {},
//   });

//   useEffect(() => {
//     const fetchinitData = async () => {
//       const fetchlga = await axios.get("/api/lga");
//       setLga(fetchlga.data);
//       const fetchWard = await axios.get("/api/ward");
//       setWard(fetchWard.data);
//       const fetchTaxArea = await axios.get("/api/taxarea");
//       setTaxArea(fetchTaxArea.data);
//       const fetchBusinessClassification = await axios.get(
//         "/api/businessclassification"
//       );
//       setBusinessClassification(fetchBusinessClassification.data);
//       const fetchWithholdingTax = await axios.get("/api/withholdingtax");
//       setWithholdingTax(fetchWithholdingTax.data);
//       const fetchType = await axios.get("/api/type");
//       setType(fetchType.data);
//     };
//     fetchinitData();
//   }, []);

//   return (
//     <AppModal
//       open={open}
//       okButtonProps={{ hidden: true }}
//       cancelButtonProps={{ hidden: true }}
//       onCancel={onClose}
//     >
//       <h1 className="text-2xl font-bold">Add New Staff</h1>
//       <Form {...payeeform}>
//         <form
//           className="w-full flex flex-col gap-3"
//           onSubmit={payeeform.handleSubmit(onUpdate)}
//         >
//           <FormField
//             control={payeeform.control}
//             name="taxid"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>TAX ID</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter Tax ID" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex flex-row gap-2">
//             <FormField
//               control={payeeform.control}
//               name="firstname"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>FIRST NAME</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter First Name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={payeeform.control}
//               name="lastname"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>LAST NAME</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter Last Name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="flex flex-row gap-2">
//             <FormField
//               control={payeeform.control}
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
//               control={payeeform.control}
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
//           <div className="flex flex-row gap-2">
//             <FormField
//               control={payeeform.control}
//               name="lga"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>LGA</FormLabel>
//                   <FormControl>
//                     <AppSelect
//                       options={lga}
//                       placeholder="Select LGA"
//                       onChangeValue={field.onChange}
//                       selectValue={field.value}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={payeeform.control}
//               name="ward"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Ward</FormLabel>
//                   <FormControl>
//                     <AppSelect
//                       options={ward}
//                       placeholder="Select Ward"
//                       onChangeValue={field.onChange}
//                       selectValue={field.value}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <FormField
//             control={payeeform.control}
//             name="taxarea"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Tax Area</FormLabel>
//                 <FormControl>
//                   <AppSelect
//                     options={taxArea}
//                     placeholder="Select Tax Area"
//                     onChangeValue={field.onChange}
//                     selectValue={field.value}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex flex-row gap-2">
//             <FormField
//               control={payeeform.control}
//               name="businessclassification"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Business Classification</FormLabel>
//                   <FormControl>
//                     <AppSelect
//                       options={businessClassification}
//                       placeholder="Select Business Classification"
//                       onChangeValue={field.onChange}
//                       selectValue={field.value}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={payeeform.control}
//               name="witholdingtax"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Witholding Tax</FormLabel>
//                   <FormControl>
//                     <AppSelect
//                       options={withholdingTax}
//                       placeholder="Select Witholding Tax"
//                       onChangeValue={field.onChange}
//                       selectValue={field.value}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className="flex flex-row gap-2">
//             <FormField
//               control={payeeform.control}
//               name="type"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Type</FormLabel>
//                   <FormControl>
//                     <AppSelect
//                       options={type}
//                       placeholder="Select Type"
//                       onChangeValue={field.onChange}
//                       selectValue={field.value}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={payeeform.control}
//               name="businessname"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Business Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter Business Name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <FormField
//             control={payeeform.control}
//             name="annualincome"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Annual Income</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter Annual Income" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex gap-3">
//             <AppButton type="submit" label="Save" />
//             <AppButton label="Cancel" onClick={onClose} />
//           </div>
//         </form>
//       </Form>
//     </AppModal>
//   );
// };

// export default PayeeEnrollmentModal;

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AppModal } from "./app/modal";
import { AppSelect } from "./app/select";
import { AppButton } from "./app/button";
import axios from "axios";

const addPayeeSchema = z.object({
  taxid: z.string({
    required_error: "Please enter Tax ID",
  }),
  firstname: z.string({
    required_error: "Please enter First Name",
  }),
  lastname: z.string({
    required_error: "Please enter Last Name",
  }),
  email: z
    .string({
      required_error: "Please enter Email",
    })
    .email({
      message: "Invalid email address",
    }),
  phoneNumber: z.string({
    required_error: "Please enter Phone Number",
  }),
  lga: z.string({
    required_error: "Please select LGA",
  }),
  ward: z.string({
    required_error: "Please select Ward",
  }),
  taxarea: z.string({
    required_error: "Please select Tax Area",
  }),
  businessclassification: z.string({
    required_error: "Please select Business Classification",
  }),
  witholdingtax: z.string({
    required_error: "Please select Withholding Tax",
  }),
  type: z.string({
    required_error: "Please select Type",
  }),
  businessname: z.string({
    required_error: "Please enter Business Name",
  }),
  annualincome: z
    .string({
      required_error: "Please enter Annual Income",
    })
    .regex(/^\d+$/, {
      message: "Annual Income must be a numeric value",
    }),
});

interface AddPayeeeModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: z.infer<typeof addPayeeSchema>) => void;
}

const PayeeEnrollmentModal: React.FC<AddPayeeeModalProps> = ({
  open,
  onClose,
  onUpdate,
}) => {
  const [lga, setLga] = useState<{ value: string; label: string }[]>([]);
  const [ward, setWard] = useState<{ value: string; label: string }[]>([]);
  const [taxArea, setTaxArea] = useState<{ value: string; label: string }[]>(
    []
  );
  const [businessClassification, setBusinessClassification] = useState<
    { value: string; label: string }[]
  >([]);
  const [withholdingTax, setWithholdingTax] = useState<
    { value: string; label: string }[]
  >([]);
  const [type, setType] = useState<{ value: string; label: string }[]>([]);

  const payeeform = useForm<z.infer<typeof addPayeeSchema>>({
    resolver: zodResolver(addPayeeSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const fetchInitData = async () => {
      const fetchLga = await axios.get("/api/lga");
      setLga(
        fetchLga.data.map((item: string) => ({ value: item, label: item }))
      );

      const fetchWard = await axios.get("/api/ward");
      setWard(
        fetchWard.data.map((item: string) => ({ value: item, label: item }))
      );

      const fetchTaxArea = await axios.get("/api/taxarea");
      setTaxArea(
        fetchTaxArea.data.map((item: string) => ({ value: item, label: item }))
      );

      const fetchBusinessClassification = await axios.get(
        "/api/businessclassification"
      );
      setBusinessClassification(
        fetchBusinessClassification.data.map((item: string) => ({
          value: item,
          label: item,
        }))
      );

      const fetchWithholdingTax = await axios.get("/api/withholdingtax");
      setWithholdingTax(
        fetchWithholdingTax.data.map((item: string) => ({
          value: item,
          label: item,
        }))
      );

      const fetchType = await axios.get("/api/type");
      setType(
        fetchType.data.map((item: string) => ({ value: item, label: item }))
      );
    };
    fetchInitData();
  }, []);

  return (
    <AppModal
      open={open}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
      onCancel={onClose}
    >
      <h1 className="text-2xl font-bold">Add New Staff</h1>
      <Form {...payeeform}>
        <form
          className="w-full flex flex-col gap-3"
          onSubmit={payeeform.handleSubmit(onUpdate)}
        >
          <FormField
            control={payeeform.control}
            name="taxid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TAX ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Tax ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-2">
            <FormField
              control={payeeform.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FIRST NAME</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={payeeform.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LAST NAME</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-row gap-2">
            <FormField
              control={payeeform.control}
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
              control={payeeform.control}
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
          <div className="flex flex-row gap-2">
            <FormField
              control={payeeform.control}
              name="lga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LGA</FormLabel>
                  <FormControl>
                    <AppSelect
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
            <FormField
              control={payeeform.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ward</FormLabel>
                  <FormControl>
                    <AppSelect
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
          </div>
          <FormField
            control={payeeform.control}
            name="taxarea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Area</FormLabel>
                <FormControl>
                  <AppSelect
                    width="w-full"
                    options={taxArea}
                    placeholder="Select Tax Area"
                    onChangeValue={field.onChange}
                    selectValue={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-2">
            <FormField
              control={payeeform.control}
              name="businessclassification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Classification</FormLabel>
                  <FormControl>
                    <AppSelect
                      options={businessClassification}
                      width="w-full"
                      placeholder="Select Business Classification"
                      onChangeValue={field.onChange}
                      selectValue={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={payeeform.control}
              name="witholdingtax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Withholding Tax</FormLabel>
                  <FormControl>
                    <AppSelect
                      options={withholdingTax}
                      width="w-full"
                      placeholder="Select Withholding Tax"
                      onChangeValue={field.onChange}
                      selectValue={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-2">
            <FormField
              control={payeeform.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <AppSelect
                      options={type}
                      placeholder="Select Type"
                      onChangeValue={field.onChange}
                      selectValue={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={payeeform.control}
              name="businessname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Business Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={payeeform.control}
            name="annualincome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Income</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Annual Income" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <AppButton type="submit" label="Save" />
            <AppButton label="Cancel" onClick={onClose} />
          </div>
        </form>
      </Form>
    </AppModal>
  );
};

export default PayeeEnrollmentModal;
