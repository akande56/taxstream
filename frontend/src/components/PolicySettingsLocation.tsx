import { Toaster } from "@/components/ui/toaster";

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

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "@/components/ui/use-toast";
import { PlusIcon } from "lucide-react";

const AddLGASchema = z.object({
  lga: z.string({
    required_error: "Please select LGA to add.",
  }),
});

export function AddLGA() {
  const form = useForm<z.infer<typeof AddLGASchema>>({
    resolver: zodResolver(AddLGASchema),
  });

  function onSubmit(data: z.infer<typeof AddLGASchema>) {
    toast({
      title: "You added the following LGA:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <div className="form__add__lga flex justify-between items-end">
          <FormField
            control={form.control}
            name="lga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select LGA</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select LGA - Code" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Ringim - 03083">
                      Ringim - 03083
                    </SelectItem>
                    <SelectItem value="Dutse - 4398">Dutse - 4398</SelectItem>
                    <SelectItem value="Gumel - 3948">Gumel - 3948</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="gap-2" type="submit">
            {" "}
            <PlusIcon /> Add LGA
          </Button>
        </div>
      </form>
    </Form>
  );
}

const PolicySettingsLocation = () => {
  return (
    <>
      <AddLGA />
      <Toaster />
    </>
  );
};

export default PolicySettingsLocation;
