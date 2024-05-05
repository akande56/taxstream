import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Link } from "react-router-dom";

const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const OTPVerification = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <div className="w-full h-screen bg-green-400 lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center order-1 justify-center py-12">
        <div className="mx-auto grid w-[420px] gap-6 p-8 bg-white">
          <Form {...form}>
            <div className="grid gap-2 ">
              <h1 className="text-3xl font-bold">OTP Verification</h1>
              <p className="text-sm">
                Please enter the one-time password (OTP) that was sent to your
                registered email
              </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit">
                Verify
              </Button>

              <div className="mt-4  text-sm">
                <p>Didn&apos;t Receive the OTP?</p>
                <Link to="#" className="underline">
                  Resend
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
};

export default OTPVerification;

// SHit Code
