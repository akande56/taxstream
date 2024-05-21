import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const ResetPassword = () => {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const navigate = useNavigate();
  async function handleSubmit(data: z.infer<typeof resetPasswordSchema>) {
    try {
      const response = await axios.post(
        "https://taxstream-3bf552628416.herokuapp.com/api/password_reset/",
        { email: data.email }
      );

      toast.success(`${response.data.message}`, { position: "top-right" });

      navigate("/otp-verification");
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data.email?.[0];
        toast.error(errorMessage || "An error occurred", {
          position: "top-right",
        });
      } else {
        toast.error("An error occurred", { position: "top-right" });
      }
      setTimeout(() => {
        navigate("/otp-verification");
      }, 3500);
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center order-1 justify-center ">
        <div className=" items-center content-center h-screen grid w-[420px] gap-6 p-8 bg-white">
          <Toaster richColors position="top-right" />
          <Form {...form}>
            <div className="grid gap-2 ">
              <h1 className="text-3xl font-bold">Reset your password</h1>
              <p>
                Enter your email address below, and we’ll send you a link to
                reset your password.
              </p>
            </div>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email </FormLabel>
                    <FormControl>
                      <Input placeholder="someone@abc.xyz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Reset Password
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="hidden  bg-green-400 lg:block">
        {/* Placeholder for an image */}
      </div>
    </div>
  );
};

export default ResetPassword;
