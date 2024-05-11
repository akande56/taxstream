import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().min(2, {
    message: "invalid email or username.",
  }),
  password: z.string().min(8, {
    message: "password must be at least 8 characters.",
  }),
  rememberMe: z.boolean().default(false).optional(),
});

export function LoginPage() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    // Do something with the form data.

    try {
      const response = await axios.post("http://localhost:8000/api/token/", {
        email: data.email,
        password: data.password,
      });

      // Handle successful login
      const authToken = response.data.token; // Assuming the token is returned in the response
      // Store the authToken securely (e.g., in local storage or a cookie)
      localStorage.setItem("authToken", authToken);
      // Redirect the user to the dashboard or any other authenticated page
      window.location.href = "/dashboard"; // Redirect to the dashboard page
    } catch (error) {
      // Handle login error
      console.error("Login failed:", error);
      // Display error message to the user
      toast.error("Login failed. Please check your credentials and try again.");
    }

    // integrate api endpoint from ustaz
    // ✅ This will be type-safe and validated.
    // const promise: () => Promise<{ name: string }> = () =>
    //   new Promise<{ name: string }>((_, reject) =>
    //     setTimeout(() => {
    //       reject(new Error("Invalid login credentials"));
    //     }, 2000)
    //   );

    // toast.promise(promise, {
    //   loading: "Logging in...",
    //   success: (data) => {
    //     return `${data.name} login successful`;
    //   },
    //   error: (error) => {
    //     return error.message;
    //   },
    // });

    console.log(data);
  }

  return (
    <div className="w-full h-screen bg-green-400 lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center order-1 justify-center py-12">
        <div className="mx-auto grid w-[420px] gap-6 p-8 bg-white">
          <Form {...form}>
            <Toaster richColors position="top-right" />
            <div className="grid gap-2 ">
              <h1 className="text-3xl font-bold">Login</h1>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Staff ID or Email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
              <div className="forgot__password flex justify-between">
                <div className="grid gap-2 order-1">
                  <div className="flex items-center">
                    <Link
                      to="/reset-password"
                      className=" inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md  p-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>

                      <FormLabel>remember me </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <Button className="w-full" type="submit">
                Login
              </Button>
              {/* remember me */}

              <div className="mt-4  text-sm">
                <p>Don&apos;t have an account?</p>
                <Link to="#" className="underline">
                  Contact your supervisor
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="hidden h-screen bg-green-400 lg:block">
        {/* <img
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover bg-green-400 dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div>
  );
}
