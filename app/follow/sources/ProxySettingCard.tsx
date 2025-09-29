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
import { Proxy, ProxyType } from "@/lib/generated/prisma";

interface Props {
  proxies: Proxy[];
}

const ProxySettingCard = ({ proxies }: Props) => {
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
              <TableHead>Type</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proxies.map((proxy: Proxy, index: number) => (
              <TableRow key={proxy.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{proxy.name}</TableCell>
                <TableCell>{proxy.type}</TableCell>
                <TableCell>{proxy.url}</TableCell>
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
            ))}
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
              <Label htmlFor="type">Type</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Proxy type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ProxyType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="proxy://user:pass@host:port"
                required
              />
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
