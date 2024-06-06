/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { z } from "zod";
import { set, useForm } from "react-hook-form";
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
import { AppModal } from "../app/modal";
import { AppSelect } from "../app/select";
import { AppButton } from "../app/button";
import api from "@/api";
import { toast, Toaster } from "sonner";

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
  password: z
    .string({
      required_error: "Please enter Password",
    })
    .min(8, "Password must be at least 8 characters"),
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
}) => {
  // form initialization States
  const [lga, setLga] = useState<{ value: string; label: string }[]>([]);
  const [ward, setWard] = useState([]);
  const [taxArea, setTaxArea] = useState<[]>([]);
  const [businessClassification, setBusinessClassification] = useState<
    { value: string; label: string }[]
  >([]);
  const [withholdingTax, setWithholdingTax] = useState<
    { value: string; label: string }[]
  >([]);
  const [type, setType] = useState<{ value: string; label: string }[]>(() => {
    return [
      { value: "business", label: "BUSINESS" },
      { value: "individual", label: "INDIVIDUAL" },
    ];
  });
  const [formWard, setFormWard] = useState<{ value: any; label: string }[]>([]);
  // const [formTaxArea, setFormTaxArea] = useState([]);
  const [formTaxArea, setFormTaxArea] = useState<
    { value: any; label: string }[]
  >([]);
  const payeeform = useForm<z.infer<typeof addPayeeSchema>>({
    resolver: zodResolver(addPayeeSchema),
    defaultValues: {},
  });

  // form Selected fields states
  const [selectedLga, setSelectedLga] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [selectedTaxArea, setSelectedTaxArea] = useState<string>("");
  // const [selectedBusinessClassification, setSelectedBusinessClassification] =
  //   useState<string>("");
  // const [selectedWithholdingTax, setSelectedWithholdingTax] =
  //   useState<string>("");
  // const [selectedType, setSelectedType] = useState("");

  // form fields handlers
  const handleLgaChange = (value: any) => {
    setSelectedLga(value.target.value);
    console.log("selectedLga", selectedLga);
  };

  const handleWardChange = (value: any) => {
    setSelectedWard(value.target.value);
  };

  const handleTaxAreaChange = (value: string) => {
    setSelectedTaxArea(value);
  };
  // form init useEffect
  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const fetchLga = await api.get("/api/v1/policy_configuration/lga/");
        setLga(
          fetchLga.data.map((item: { id: number; name: string }) => ({
            value: item.id.toString(),
            label: item.name,
          }))
        );

        // const fetchWard = await api.get("/api/v1/policy_configuration/wards/");

        // setWard(fetchWard.data);

        // const fetchTaxArea = await api.get(
        //   "/api/v1/policy_configuration/tax-areas/"
        // );
        // setTaxArea(fetchTaxArea.data);

        const fetchBusinessClassification = await api.get(
          "/api/v1/policy_configuration/business-classifications/"
        );
        setBusinessClassification(
          fetchBusinessClassification.data.map(
            (item: { id: number; name: string }) => ({
              value: item.id,
              label: item.name,
            })
          )
        );

        const fetchWithholdingTax = await api.get(
          "/api/v1/policy_configuration/withholding-tax-rates/"
        );
        setWithholdingTax(
          fetchWithholdingTax.data.map(
            (item: { id: any; payment: any; rate: any }) => ({
              value: item.id,
              label: `${item.payment} - ${item.rate}`,
            })
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchInitData();
  }, []);

  useEffect(() => {
    const fetchWard = async () => {
      if (selectedLga) {
        console.log("Fetchin wards");
        const res = await api.get("/api/v1/policy_configuration/wards/");
        const { data } = res;
        console.log("ward", data);
        const filteredAndMappedWard = data
          .filter((item: { lga: string }) => item.lga == selectedLga)
          .map(
            (item: { id: number; area_name: string; area_code: string }) => ({
              value: item.id,
              label: `${item.area_name}-${item.area_code}`,
            })
          );
        console.log(selectedLga);
        console.log(
          "filteredAndMappedWard",
          data.filter((item: { lga: string }) => item.lga == selectedLga)
        );
        console.log(filteredAndMappedWard);
        setFormWard(filteredAndMappedWard);
      }
    };
    fetchWard();
  }, [selectedLga]);

  useEffect(() => {
    const fetchTaxAreas = async () => {
      if (selectedWard) {
        const res = await api.get("/api/v1/policy_configuration/tax-areas/");
        const { data } = res;
        console.log(data);
        const filteredAndMappedTaxArea = data
          .filter((item: { ward: string }) => item.ward == selectedWard)
          .map(
            (item: {
              id: number;
              tax_area_office: string;
              tax_area_code: string;
            }) => ({
              value: item.id,
              label: `${item.tax_area_office} - ${item.tax_area_code}`,
            })
          );
        console.log("selectedWard", selectedWard);
        console.log(
          "filteredtaxarea",
          data.filter((item: { ward: string }) => item.ward === selectedWard)
        );
        console.log("filteredAndMappedTaxArea", filteredAndMappedTaxArea);
        setFormTaxArea(filteredAndMappedTaxArea);
      }
    };
    fetchTaxAreas();
  }, [selectedWard]);

  // submit form
  const createPayee = async (payeeData: any) => {
    toast.loading("Creating Payee", { position: "top-right", duration: 3000 });
    try {
      const response = await api.post("/api/v1/user/tax-payer/", payeeData);
      console.log(response);
      const { data } = response;
      console.log(data);
      toast.success(`Payee created successfully`);
    } catch (error) {
      toast.error("An error occurred", {
        position: "top-right",
        duration: 1500,
      });
      console.error(error);
    }
  };
  const handleSubmit = (data: z.infer<typeof addPayeeSchema>) => {
    console.log(data);
    const payeeData = {
      user: {
        username: data.email,
        password: data.password,
        email: data.email,
        first_name: data.firstname,
        last_name: data.lastname,
        user_role: "tax_payer",
        phone: data.phoneNumber,
        location: data.lga,
      },
      business_name: data.businessname,
      business_status: 4,
      classification: data.businessclassification,
      withholding_tax_rate: data.witholdingtax,
      tax_area: data.taxarea,
      anual_income: data.annualincome,
      type: data.type,
    };
    console.log(payeeData);
    createPayee(payeeData);
  };

  return (
    <AppModal
      open={open}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
      onCancel={onClose}
    >
      <h1 className="text-2xl m-2 p-2 font-bold">Add New Business</h1>
      <Form {...payeeform}>
        <form
          className="w-full flex flex-col gap-3"
          onSubmit={payeeform.handleSubmit(handleSubmit)}
        >
          <FormField
            control={payeeform.control}
            name="taxid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TAX ID</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter Tax ID" {...field} />
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
                    <Input
                      type="text"
                      placeholder="Enter First Name"
                      {...field}
                    />
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
                    <Input
                      type="text"
                      placeholder="Enter Last Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={payeeform.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="********"
                    type="password"
                    className="flex items-center"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <Input
                      type="number"
                      placeholder="Enter Phone Number"
                      {...field}
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
              name="lga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LGA</FormLabel>
                  <FormControl>
                    <AppSelect
                      options={lga}
                      width="w-full"
                      placeholder="Select LGA"
                      onChangeValue={(value: any) => {
                        field.onChange(value);
                        handleLgaChange(value);
                      }}
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
                      options={formWard}
                      width="w-full"
                      placeholder="Select Ward"
                      onChangeValue={(value: any) => {
                        field.onChange(value);
                        handleWardChange(value);
                      }}
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
                    options={formTaxArea}
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
                    <Input
                      type="text"
                      placeholder="Enter Business Name"
                      {...field}
                    />
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
                  <Input
                    type="number"
                    placeholder="Enter Annual Income"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <AppButton type="submit" label="Save" />
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

export default PayeeEnrollmentModal;
