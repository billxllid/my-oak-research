import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

const Sources = () => {
  return (
    <div>
      <Tabs defaultValue="web-sites">
        <TabsList>
          <TabsTrigger value="web-sites">Web Sites</TabsTrigger>
          <TabsTrigger value="social-media">Social Media</TabsTrigger>
          <TabsTrigger value="darknet">Darknet</TabsTrigger>
          <TabsTrigger value="search-engines">Search Engines</TabsTrigger>
        </TabsList>
        <TabsContent value="web-sites">
          <Card>
            <CardHeader>
              <CardTitle>Web Sites</CardTitle>
              <CardDescription>Web Sites</CardDescription>
            </CardHeader>
            <CardContent>
              <div>Web Sites</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="social-media">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Social Media</CardDescription>
            </CardHeader>
            <CardContent>
              <div>Social Media</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="darknet">
          <Card>
            <CardHeader>
              <CardTitle>Darknet</CardTitle>
              <CardDescription>Darknet</CardDescription>
            </CardHeader>
            <CardContent>
              <div>Darknet</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="search-engines">
          <Card>
            <CardHeader>
              <CardTitle>Search Engines</CardTitle>
              <CardDescription>Search Engines</CardDescription>
            </CardHeader>
            <CardContent>
              <div>Search Engines</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sources;
