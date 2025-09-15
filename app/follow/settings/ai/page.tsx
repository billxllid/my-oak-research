"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  // 选择通用大模型
  model: z.string().min(1, "Model is required"),
  // 选择决策大模型
  decisionModel: z.string().min(1, "Decision Model is required"),
});

const AISetting = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "DeepSeek",
      decisionModel: "DeepSeek",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">AI</h1>
        <p className="text-sm text-muted-foreground">
          AI is a AI that is used to track the content of the website.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>General Model</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select General Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DeepSeek">DeepSeek</SelectItem>
                      <SelectItem value="OpenAI">OpenAI</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>The general model for the AI.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="decisionModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Decision Model</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Decision Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DeepSeek">DeepSeek</SelectItem>
                      <SelectItem value="OpenAI">OpenAI</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  The decision model for the AI. This model is used to make
                  decisions for the AI.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AISetting;
