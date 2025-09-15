"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  // 超时时间
  timeout: z.number().min(1, "Time out is required"),
  // google搜索设置
  googleSearchApiKey: z.string().min(1, "Google search api key is required"),
  // bing搜索设置
  bingSearchApiKey: z.string().min(1, "Bing search api key is required"),
  // duckduckgo搜索设置
  duckduckgoSearchApiKey: z
    .string()
    .min(1, "Duckduckgo search api key is required"),
  // yahoo搜索设置
  yahooSearchApiKey: z.string().min(1, "Yahoo search api key is required"),
});

const SearchEngine = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeout: 10,
      googleSearchApiKey: "",
      bingSearchApiKey: "",
      duckduckgoSearchApiKey: "",
      yahooSearchApiKey: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Search Engine</h1>
        <p className="text-sm text-muted-foreground">
          Search Engine is a search engine that is used to track the content of
          the website.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="timeout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeout</FormLabel>
                <FormControl>
                  <Input placeholder="10" {...field} />
                </FormControl>
                <FormDescription>
                  The timeout for the search engine.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="googleSearchApiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Search API Key</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Input your google search api key"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormDescription>
                  The google search api key for the search engine.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bingSearchApiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bing Search API Key</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Input your bing search api key"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormDescription>
                  The bing search api key for the search engine.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duckduckgoSearchApiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duckduckgo Search API Key</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Input your duckduckgo search api key"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormDescription>
                  The duckduckgo search api key for the search engine.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yahooSearchApiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yahoo Search API Key</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Input your yahoo search api key"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormDescription>
                  The yahoo search api key for the search engine.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
  );
};

export default SearchEngine;
