import lgaData from "./jigawa-lgas-and-wards.json";

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
import { useState } from "react";

const AddLGASchema = z.object({
  lga: z.string({
    required_error: "Please select LGA to add.",
  }),
  ward: z.string({
    required_error: "Please select ward.",
  }),
});

export function AddLGA() {
  const [selectedLGA, setSelectedLGA] = useState("");

  const handleLGAChange = (selectedLGA: string) => {
    setSelectedLGA(selectedLGA);
  };
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
    <div className="">
      <p className="text-xl font-light border-b w-fit mb-4">
        Create Pay Tax Location
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <div className="form__add__lga flex justify-between items-end">
            <FormField
              control={form.control}
              name="lga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select LGA</FormLabel>
                  <Select
                    onValueChange={(newValue) => {
                      field.onChange(newValue);
                      handleLGAChange(newValue);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="min-w-40">
                        <SelectValue placeholder="Select LGA - Code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="min-w-32">
                      {lgaData[0].lgas.map((lga) => (
                        <SelectItem key={lga.lga} value={lga.lga}>
                          {lga.lga}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ward Selection */}
            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {`Select Ward in ${selectedLGA || "LGA"}`}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="min-w-40">
                        <SelectValue placeholder="Select Ward" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="min-w-32">
                      {lgaData[0].lgas
                        .find((lga) => lga.lga === form.getValues("lga"))
                        ?.wards.map((ward) => (
                          <SelectItem key={ward} value={ward}>
                            {ward}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="gap-2" type="submit">
              <PlusIcon /> Add LGA
            </Button>
          </div>
        </form>
      </Form>
    </div>
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
