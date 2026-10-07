"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { trackLeadSubmit } from "@/lib/analytics";

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  phone: string;
  lookingFor: string;
}

interface LeadFormProps {
  onSuccess?: () => void;
}

export const LeadForm = ({ onSuccess }: LeadFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LeadFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      phone: "",
      lookingFor: "",
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          companyName: data.companyName,
          phone: data.phone,
          lookingFor: data.lookingFor,
          source: "website",
        },
      };

      const response = await fetch(
        "https://cs.fabbuilder.com/api/tenant/69a9645ba03cc092c3b0de23/lead",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      trackLeadSubmit("success");
      toast({
        title: "Thank you!",
        description: "We’ve received your request and will be in touch soon.",
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Form submission error:", error);
      trackLeadSubmit("error");
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "We couldn’t submit the form. Please try again or contact us directly.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            rules={{ required: "First name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Alex" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            rules={{ required: "Last name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Taylor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="alex@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyName"
          rules={{ required: "Organization is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Example Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          rules={{ required: "Phone number is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lookingFor"
          rules={{ required: "Please tell us briefly what you need help with" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>What are you looking for?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us briefly what you need help with......"
                  className="min-h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          variant="hero"
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Sending..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
