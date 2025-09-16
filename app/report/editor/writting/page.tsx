import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DynamicReportEditor from "./ReportEditor";

const discordMessages = [
  {
    id: 1,
    content: "Hello, how are you?",
    role: "user",
  },
  {
    id: 2,
    content: "I'm fine, thank you!",
    role: "assistant",
  },
  {
    id: 3,
    content: "2025-09-16",
    role: "timestamp",
  },
  {
    id: 4,
    content: "What is your name?",
    role: "user",
  },
  {
    id: 5,
    content: "My name is John Doe",
    role: "assistant",
  },
  {
    id: 6,
    content: "Long paragraph test pls.",
    role: "user",
  },
  {
    id: 7,
    content:
      "So long paragraph So long paragraph So long paragraph So long paragraph So long paragraph So long paragraph So long paragraph So long paragraph So long paragraph So long paragraph So long paragraph ",
    role: "assistant",
  },
  {
    id: 8,
    content: "2025-09-16",
    role: "timestamp",
  },
  {
    id: 9,
    content: "Say my name.",
    role: "user",
  },
  {
    id: 10,
    content: "Hessonbo.",
    role: "assistant",
  },
];

const WrittingReportEditor = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="col-span-2">
        <Card className="h-[calc(100vh-7rem)] bg-gray-100">
          <CardHeader>
            <CardTitle className="font-bold text-2xl">
              Generate Report
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 justify-between h-[calc(100vh-13rem)]">
            <div className="flex flex-col gap-4 px-4 overflow-y-auto">
              {discordMessages.map((message) =>
                message.role === "timestamp" ? (
                  <div
                    key={message.id}
                    className="text-sm text-gray-400 text-center"
                  >
                    {message.content}
                  </div>
                ) : (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 items-center",
                      message.role === "user" ? "justify-start" : "justify-end"
                    )}
                  >
                    {message.role === "user" && (
                      <Avatar>
                        <AvatarImage src="https://github.com/evilrabbit.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[70%] break-words whitespace-pre-wrap",
                        message.role === "user"
                          ? "bg-blue-100 text-blue-900"
                          : "bg-gray-200 text-gray-900"
                      )}
                    >
                      {message.content}
                    </div>
                    {message.role === "assistant" && (
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )
              )}
            </div>
            <div className="flex gap-4">
              <Input
                placeholder="Let's talk about your report ..."
                className="bg-white"
              />
              <Button>Generate</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="hidden md:block md:col-span-3">
        <DynamicReportEditor />
      </div>
    </div>
  );
};

export default WrittingReportEditor;
