/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { ThreeDots } from "react-loader-spinner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import logo from "@/assets/jg-logo.png";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  username: z.string().min(2, {
    message: "invalid username or username.",
  }),
  password: z.string().min(8, {
    message: "password must be at least 8 characters.",
  }),
  rememberMe: z.boolean().default(false).optional(),
});

export function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { login } = useAuth();

  const navigate = useNavigate();
  async function onSubmit(data: z.infer<typeof loginSchema>) {
    const { username, password } = data;

    login(data);

    // setIsLoggingIn(true);
    // // Start login process
    // try {

    //   // toast.success(`You are logged in successfully`);
    //   // setIsLoggingIn(false);
    //   // setTimeout(() => {
    //   //   navigate("/dashboard");
    //   // }, 2500);
    // } catch (error) {
    //   toast.error("An error occurred", {
    //     position: "top-right",
    //     duration: 1500,
    //   });
    //   setIsLoggingIn(false);
    // }
  }

  // try {
  //       const response = await axios.post(
  //         "https://taxstream-3bf552628416.herokuapp.com/api/token/",
  //         { username: data.username, password: data.password }
  //       );

  //       const accessToken = response.data.access;
  //       const refreshToken = response.data.refresh;

  //       // Store tokens in localStorage
  //       localStorage.setItem("accessToken", accessToken);
  //       localStorage.setItem("refreshToken", refreshToken);

  //       toast.success(`You are logged in successfully`);

  //     } catch (error: any) {
  //       if (error.response) {
  //         const errorMessage = error.response.data.detail;
  //         toast.error(errorMessage || "An error occurred", {
  //           position: "top-right",
  //         });
  //       } else {

  //       }
  //     } finally {
  //       setIsLoggingIn(false); // End login process
  //     }
  //   }

  return (
    <div className="flex flex-col place-content-center h-full m-0 p-8 bg-green-400">
      <div className="w-full h-full bg-green-400 flex flex-col sm:flex-row p-4 gap-2 justify-around align-middle">
        <div className="flex items-center order-1 justify-center py-12">
          <div className="mx-auto grid w-[420px] gap-6 p-8 bg-white">
            <Form {...form}>
              <Toaster richColors position="top-right" />
              <div className="grid gap-2 ">
                <h1 className="text-3xl font-bold">Login</h1>
              </div>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>username or Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Staff ID or username" {...field} />
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
                <div className="button-wrapper">
                  {isLoggingIn ? (
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={isLoggingIn}
                    >
                      <ThreeDots
                        visible={true}
                        height="24"
                        width="24"
                        color="#FFFFFF"
                      />
                    </Button>
                  ) : (
                    <Button className="w-full" type="submit">
                      Login
                    </Button>
                  )}
                </div>
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

        <div className="bg-green-400 flex-col  flex place-content-center">
          <img
            src={logo}
            alt="Jigawa state mapImage"
            // width="1920"
            // height="1080"
            className="h-auto w-full object-cover bg-green-400 dark:brightness-[0.2] dark:grayscale"
          />
          <div className="sm:hidden flex place-content-center">
            <h1 className="text-white text-5xl text-center">
              JIGAWA INTERNAL REVENUE SERVICE
            </h1>
          </div>
        </div>
      </div>
      <div className="sm:flex hidden place-content-center">
        <h1 className="text-white text-5xl text-center">
          JIGAWA INTERNAL REVENUE SERVICE
        </h1>
      </div>
    </div>
  );
}
