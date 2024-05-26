import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { PlusIcon } from "lucide-react";
import { AppSelect } from "./app/select";
import { AppButton } from "./app/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { AppModal } from "./app/modal";
import { toast, Toaster } from "sonner";
import { AppTable } from "./app/table";

const taxPaySchema = z.object({
  tax_area_office: z.string({
    required_error: "Please enter tax area office",
  }),
  tax_area_code: z.string({
    required_error: "Please enter tax area code",
  }),
});

const addLGASchema = z.object({
  name: z.string({
    required_error: "Please enter LGA name",
  }),
  code: z.string({
    required_error: "Please enter LGA code",
  }),
});

const addWardSchema = z.object({
  area_name: z.string({
    required_error: "Please enter ward area name",
  }),
  area_code: z.string({
    required_error: "Please enter Ward area code",
  }),
});

export interface ITaxAreas{
  id : number,
  name: string,
  code: string,
  state: number
}

export function AddLGA() {
  const taxform = useForm<z.infer<typeof taxPaySchema>>({
    resolver: zodResolver(taxPaySchema),
    defaultValues: {} 
  });
  const lgaform = useForm<z.infer<typeof addLGASchema>>({
    resolver: zodResolver(addLGASchema),
    defaultValues: {} 
  });
  const wardform = useForm<z.infer<typeof addWardSchema>>({
    resolver: zodResolver(addWardSchema),
    defaultValues: {} 
  });


  const [getLGASelectValue, setLGASelectValue] = useState<string>("");
  const [getWardSelectValue, setWardSelectValue] = useState<string>("");
  const [getLGACode, setLGACode] = useState<any[]>([]);
  const [getWardCode, setWardCode] = useState<any[]>([]);
  const [showTaxAreaForm, setShowTaxAreaForm] = useState<boolean>(false);
  const [getTaxAreas, setTaxAreas] = useState<ITaxAreas[]>([]);
  const [showAddLGAModal, setShowAddLGAModal] = useState<boolean>(false);
  const [showAddWardModal, setShowAddWardModal] = useState<boolean>(false);

  const columns: any[] = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Area Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Area Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      key: 'state',
      render: (val: any) => (
        <div className="flex items-center gap-3 text-primary text-sm">
          <button className={`${val == 0 && 'text-red-500'}`}>{val == 0 ? 'Inactive' : 'Active'}</button>
          <button>Edit</button>
        </div>
      ),
    },
  ];

  const handleLGAChange = (e:any)=>{
    setLGASelectValue(e.target.value);
  }
  const handleWardChange = (e:any)=>{
    setWardSelectValue(e.target.value);
  }

  function onTaxAreaSubmit(data: z.infer<typeof taxPaySchema>) {
    axios.post("https://taxstream-3bf552628416.herokuapp.com/api/v1/policy_configuration/tax-areas/", {
        ward: getWardSelectValue,
        ...data
    }).then((res) => {
      toast.success(`Tax area created successfully`);
      console.log(res)
    }).catch((err) => {
      toast.error('Error')
      console.log(err)
    })
  }

  function onAddLGASubmit(data: z.infer<typeof addLGASchema>) {
    axios.post("https://taxstream-3bf552628416.herokuapp.com/api/v1/policy_configuration/lga/", {
        ...data,
        state: 2
    }).then((res) => {
      toast.success(`LGA created successfully`);
      console.log(res)
    }).catch((err) => {
      toast.error('Error')
      console.log(err)
    }).finally(()=>{
      setShowAddLGAModal(!showAddLGAModal);
    })
  }

  function onAddWardSubmit(data: z.infer<typeof addWardSchema>) {
    axios.post("https://taxstream-3bf552628416.herokuapp.com/api/v1/policy_configuration/wards/", {
        ...data,
        lga: getLGASelectValue,
        status: "active"
    }).then((res) => {
      toast.success(`Ward created successfully`);
      console.log(res)
    }).catch((err) => {
      toast.error('Error')
      console.log(err)
    }).finally(()=>{
      setShowAddWardModal(!showAddWardModal);
    })
  }

  useEffect(()=>{
    axios("https://taxstream-3bf552628416.herokuapp.com/api/v1/policy_configuration/lga/").then((res)=>{
      let lga:any[] = [];
      for(let data of res.data){
        lga.push({
          label: data.code,
          value: data.id
        });
      }
      setLGACode(lga);
    })
  }, [getLGACode]);

  useEffect(()=>{
    axios("https://taxstream-3bf552628416.herokuapp.com/api/v1/policy_configuration/wards/").then((res)=>{
      let ward:any[] = [];
      for(let data of res.data){
        ward.push({
          label: `${data.area_name} - ${data.area_code}`,
          value: data.id
        });
      }
      setWardCode(ward);
    })
  }, [getWardCode]);

  useEffect(()=>{
    axios("https://taxstream-3bf552628416.herokuapp.com/api/v1/policy_configuration/lga/").then((res)=>{
      setTaxAreas(res.data?.map((item: any, i: any) => ({
        ...item,
        key: i + 1
      })));
    })
  }, [getTaxAreas]);

  return (
    <>
      <div className="flex flex-col items-start gap-3 bg-white border border-gray-200 shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
        <div className="flex gap-3 items-end w-full">
          <AppSelect options={getLGACode} placeholder="Select LGA - Code" label="Select LGA" onChangeValue={handleLGAChange} selectValue={getLGASelectValue}/>
          <AppButton icon={<PlusIcon/>} label="Add LGA" onClick={() => setShowAddLGAModal(true)}/>
        </div>
        {getLGASelectValue && (
          <div className="flex gap-3 items-end w-full mt-1">
            <AppSelect options={getWardCode} placeholder="Select Ward - Code" label="Select Ward" onChangeValue={handleWardChange} selectValue={getWardSelectValue}/>
            <AppButton icon={<PlusIcon/>} label="Add Ward" onClick={() => setShowAddWardModal(true)}/>
          </div>
        )}

        {getLGASelectValue && getWardSelectValue && !showTaxAreaForm && (
            <AppButton onClick={() => setShowTaxAreaForm(true)} icon={<PlusIcon/>} label="Add Tax Area"/>
        )}

        {showTaxAreaForm && (
          <Form {...taxform}>
            <h1 className="text-2xl font-bold">Add Tax Area</h1>
            <form className="w-full flex flex-col gap-3" onSubmit={taxform.handleSubmit(onTaxAreaSubmit)}>
                <FormField
                  control={taxform.control}
                  name="tax_area_office"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Tax Area Office</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter New Tax Area Office" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={taxform.control}
                  name="tax_area_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Tax Area Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter New Tax Area Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <AppButton type="submit" label="Save"/>
                  <AppButton label="Cancel" onClick={()=>setShowTaxAreaForm(!showTaxAreaForm)}/>
                </div>
            </form>
          </Form>
        )}
        <AppModal
          open={showAddLGAModal}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          onCancel={()=> setShowAddLGAModal(!showAddLGAModal)}
        >
          <h1 className="text-2xl font-bold">Add LGA</h1>
          <Form {...lgaform}>
            <form className="w-full flex flex-col gap-3" onSubmit={lgaform.handleSubmit(onAddLGASubmit)}>
                <FormField
                  control={lgaform.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LGA</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter New LGA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={lgaform.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter LGA Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <AppButton type="submit" label="Save"/>
                  <AppButton label="Cancel" onClick={()=>setShowAddLGAModal(!showAddLGAModal)}/>
                </div>
            </form>
          </Form>
        </AppModal>
        <AppModal
          open={showAddWardModal}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          onCancel={()=> setShowAddWardModal(!showAddWardModal)}
        >
          <h1 className="text-2xl font-bold">Add Ward</h1>
          <Form {...wardform}>
            <form className="w-full flex flex-col gap-3" onSubmit={wardform.handleSubmit(onAddWardSubmit)}>
                <FormField
                  control={wardform.control}
                  name="area_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ward</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter New Ward" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={wardform.control}
                  name="area_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Ward Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <AppButton type="submit" label="Save"/>
                  <AppButton label="Cancel" onClick={()=>setShowAddWardModal(!showAddWardModal)}/>
                </div>
            </form>
          </Form>
        </AppModal>
      </div>

      <div className="mt-10 bg-white border border-gray-200 shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
        <AppTable
          columns={columns}
          dataSource={getTaxAreas}
          pagination={false}
        />
      </div>
      <AppModal/>
    </>
  );
}

const PolicySettingsLocation = () => {
  return (
    <>
      <AddLGA />
      <Toaster richColors position="top-right" />
    </>
  );
};

export default PolicySettingsLocation;
