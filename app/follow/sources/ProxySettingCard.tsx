import React from "react";
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
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

enum NetworkEnvironmentProtocol {
  HTTP = "http",
  HTTPS = "https",
  SOCKS5 = "socks5",
}

export interface NetworkEnvironment {
  id: string;
  label: string;
  protocol: NetworkEnvironmentProtocol;
  endpoint: string;
  region: string;
}

export const networkEnvironments: NetworkEnvironment[] = [
  {
    id: "1",
    label: "US HTTP Proxy",
    protocol: NetworkEnvironmentProtocol.HTTP,
    endpoint: "127.0.0.1:8080",
    region: "us",
  },
  {
    id: "2",
    label: "EU HTTPS Proxy",
    protocol: NetworkEnvironmentProtocol.HTTPS,
    endpoint: "127.0.0.1:8081",
    region: "eu",
  },
  {
    id: "3",
    label: "Asia SOCKS5 Proxy",
    protocol: NetworkEnvironmentProtocol.SOCKS5,
    endpoint: "127.0.0.1:8082",
    region: "asia",
  },
];

const ProxySettingCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Proxy Settings</CardTitle>
        <CardDescription>You can manage proxy settings here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search proxy settings..."
              className="pl-9 bg-muted border-none"
              icon={<Search size={16} />}
            />
          </div>
          <AddProxySettingDialog />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Protocol</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {networkEnvironments.map(
              (networkEnvironment: NetworkEnvironment) => (
                <TableRow key={networkEnvironment.id}>
                  <TableCell>{networkEnvironment.id}</TableCell>
                  <TableCell>{networkEnvironment.label}</TableCell>
                  <TableCell>{networkEnvironment.protocol}</TableCell>
                  <TableCell>{networkEnvironment.endpoint}</TableCell>
                  <TableCell>{networkEnvironment.region}</TableCell>
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

const AddProxySettingDialog = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon />
            Add Proxy Setting
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Proxy Setting</DialogTitle>
            <DialogDescription>
              Add a new proxy setting to your list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="protocol">Protocol</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a protocol" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(NetworkEnvironmentProtocol).map((protocol) => (
                    <SelectItem key={protocol} value={protocol}>
                      {protocol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="endpoint">Endpoint</Label>
              <Input id="endpoint" placeholder="Endpoint" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="region">Region</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {networkEnvironments.map((networkEnvironment) => (
                    <SelectItem
                      key={networkEnvironment.id}
                      value={networkEnvironment.id}
                    >
                      {networkEnvironment.region}
                    </SelectItem>
                  ))}
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

export default ProxySettingCard;
