import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast, Toaster } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "invalid email address" }),
});

const ResetPassword = () => {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/password_reset/",
        {
          email: data.email,
        }
      );

      // Handle successful password reset request
      console.log("Password reset email sent:", response.data.message);
      // Display success message to the user
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error) {
      // Handle error
      console.error("Password reset failed:", error);
      // Display error message to the user
      toast.error("Password reset failed. Please try again later.");
    }
    // ✅ This will be type-safe and validated.
    console.log(data);
  }
  return (
    <div className="w-full h-screen bg-green-400 lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center order-1 justify-center py-12">
        <div className="mx-auto grid w-[420px] gap-6 p-8 bg-white">
          <Form {...form}>
            <div className="grid gap-2 ">
              <Toaster />
              <h1 className="text-3xl font-bold">Reset your password</h1>
              <p>
                Enter your email address below, and we’ll send you a link to
                reset your password.
              </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                Reset Password{" "}
              </Button>
              {/* remember me */}
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
};

export default ResetPassword;
