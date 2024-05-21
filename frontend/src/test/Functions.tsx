import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import axios from "axios";

const apiUrl = "https://taxstream-3bf552628416.herokuapp.com/api/v1/wards/";

async function fetchData() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("Access token is missing");
    return;
  }

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Response:", response.data);
    // Do something with the response data
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const addLGASchema = z.object({
  lga_name: z
    .string()
    .min(3, { message: "LGA Name Must  must contain at least 3 character(s)" })
    .max(20),
  lga_code: z
    .string()
    .min(3, { message: "LGA Code Must  must contain at least 3 character(s)" })
    .max(5, { message: "LGA Code Must be less than 5  characters long" }),
});
const addWardSchema = z.object({
  ward_name: z
    .string()
    .min(3, { message: "Ward Name Must  must contain at least 3 character(s)" })
    .max(20),
  ward_code: z
    .string()
    .min(3, { message: "Ward Code Must  must contain at least 3 character(s)" })
    .max(5, { message: "Ward Code Must be less than 5  characters long" }),
});

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function AddLGAForm() {
  const form = useForm<z.infer<typeof addLGASchema>>({
    resolver: zodResolver(addLGASchema),
    defaultValues: {
      lga_name: "",
      lga_code: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(data: z.infer<typeof addLGASchema>) {
    // Do something with the form data.
    // ✅ This will be type-safe and validated.
    console.log(data);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="lga_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter LGA Name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lga_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LGA Code</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Enter LGA Code" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="submission__cancel__btn flex gap-6">
            <Button className="w-full" type="submit">
              Save
            </Button>

            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </div>
        </form>
      </Form>
    </>
  );
}
export function AddWardForm() {
  const form = useForm<z.infer<typeof addWardSchema>>({
    resolver: zodResolver(addWardSchema),
    defaultValues: {
      ward_name: "",
      ward_code: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(data: z.infer<typeof addWardSchema>) {
    // ✅ This will be type-safe and validated.
    console.log(data);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="ward_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ward Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Ward Name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ward_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ward Code</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Enter Ward Code" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="submission__cancel__btn flex gap-6">
            <Button className="w-full" type="submit">
              Save
            </Button>

            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </div>
        </form>
      </Form>
    </>
  );
}
export function AddLGAT() {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button>Add LGA</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add LGA</AlertDialogTitle>
            <AlertDialogDescription>
              <AddLGAForm />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
export function AddWardT() {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button>Add Ward</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Ward</AlertDialogTitle>
            <AlertDialogDescription>
              <AddWardForm />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const Functions = () => {
  return (
    <div>
      <AddLGAT />
      <AddWardT />
    </div>
  );
};

export default Functions;
