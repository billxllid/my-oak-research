"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface SocialMedia {
  id: string;
  name: string;
  desc: string;
  type: string;
}

const supportedSocialMedia: { [key: string]: SocialMedia } = {
  twitter: {
    id: "1",
    name: "Twitter",
    desc: "Twitter Messenger (Twitter Business API)",
    type: "twitter",
  },

  facebook: {
    id: "2",
    name: "Facebook",
    desc: "Facebook Messenger (Facebook Business API)",
    type: "facebook",
  },

  whatsapp: {
    id: "3",
    name: "WhatsApp",
    desc: "WhatsApp Messenger (WhatsApp Business API)",
    type: "whatsapp",
  },
};

export const socialMedia: { id: string; api: SocialMedia; desc?: string }[] = [
  { id: "1", api: supportedSocialMedia.twitter, desc: "My Twitter" },
  { id: "2", api: supportedSocialMedia.facebook },
  { id: "3", api: supportedSocialMedia.whatsapp },
];

const SocialMediaSettingCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Social Media</CardTitle>
        <CardDescription>
          You can manage information sources from the social media here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search web sites..."
              className="pl-9 bg-muted border-none"
              icon={<Search size={16} />}
            />
          </div>
          <AddSocialMediaDialog />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {socialMedia.map(
              (socialMedia: {
                id: string;
                desc?: string;
                api: SocialMedia;
              }) => (
                <TableRow key={socialMedia.id}>
                  <TableCell>{socialMedia.id}</TableCell>
                  <TableCell>{socialMedia.api.name}</TableCell>
                  <TableCell>
                    {socialMedia.desc || socialMedia.api.desc}
                  </TableCell>
                  <TableCell>{socialMedia.api.type}</TableCell>
                  <TableCell>{socialMedia.api.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <PencilIcon className="size-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <TrashIcon className="size-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const AddSocialMediaDialog = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedNetworkEnvironment, setSelectedNetworkEnvironment] =
    useState<string>("");
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon />
            Add Social Media
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Social Media</DialogTitle>
            <DialogDescription>
              Add a new social media to your list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="keyword">Name</Label>
              <Input id="keyword" placeholder="Keyword" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Description" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="socialMediaType">Type</Label>
              <Select
                required
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
              {selectedType === "twitter" && (
                <div className="grid gap-3">
                  <Label htmlFor="twitter-api-key">Twitter API Key</Label>
                  <Input
                    id="twitter-api-key"
                    placeholder="Twitter API Key"
                    required
                  />
                </div>
              )}
              {selectedType === "facebook" && (
                <div className="grid gap-3">
                  <Label htmlFor="facebook-api-key">Facebook API Key</Label>
                  <Input
                    id="facebook-api-key"
                    placeholder="Facebook API Key"
                    required
                  />
                </div>
              )}
              {selectedType === "whatsapp" && (
                <div className="grid gap-3">
                  <Label htmlFor="whatsapp-api-key">WhatsApp API Key</Label>
                  <Input
                    id="whatsapp-api-key"
                    placeholder="WhatsApp API Key"
                    required
                  />
                </div>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="network-environment">Network Environment</Label>
              <Select
                required
                value={selectedNetworkEnvironment}
                onValueChange={setSelectedNetworkEnvironment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a network environment" />
                </SelectTrigger>
                <SelectContent>
                  {/* {networkEnvironments.map((networkEnvironment) => (
                    <SelectItem
                      key={networkEnvironment.id}
                      value={networkEnvironment.id}
                    >
                      {networkEnvironment.label}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button>Add</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default SocialMediaSettingCard;
