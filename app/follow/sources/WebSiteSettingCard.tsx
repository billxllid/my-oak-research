import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, Search, PlusIcon } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Category } from "../keywords/CategorySettingCard";
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

enum NetworkEnvironmentProtocol {
  HTTP = "http",
  HTTPS = "https",
  SOCKS5 = "socks5",
}

interface NetworkEnvironment {
  id: string;
  label: string;
  protocol: NetworkEnvironmentProtocol;
  endpoint: string;
  region: string;
}

interface WebSite {
  id: string;
  label: string;
  desc: string;
  url: string;
  networkEnvironment?: NetworkEnvironment;
}

const WebSiteSettingCard = () => {
  const networkEnvironments: NetworkEnvironment[] = [
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

  const webSites: WebSite[] = [
    {
      id: "1",
      label: "BBC",
      desc: "BBC News",
      url: "https://www.bbc.com",
      networkEnvironment: networkEnvironments[0],
    },
    {
      id: "2",
      label: "CNN",
      desc: "CNN News",
      url: "https://www.cnn.com",
    },
    {
      id: "3",
      label: "Reddit",
      desc: "Reddit News",
      url: "https://www.reddit.com",
      networkEnvironment: networkEnvironments[2],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Web Sites</CardTitle>
        <CardDescription>
          You can manage information sources from the web site here.
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
          <AddWebSiteDialog networkEnvironments={networkEnvironments} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Network Environment</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webSites.map((webSite: WebSite) => (
              <TableRow key={webSite.id}>
                <TableCell>{webSite.id}</TableCell>
                <TableCell>{webSite.label}</TableCell>
                <TableCell>{webSite.desc}</TableCell>
                <TableCell>{webSite.url}</TableCell>
                <TableCell>{webSite.networkEnvironment?.label}</TableCell>
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

const AddWebSiteDialog = ({
  networkEnvironments,
}: {
  networkEnvironments: NetworkEnvironment[];
}) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon />
            Add Web Site
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Web Site</DialogTitle>
            <DialogDescription>
              Add a new web site to your list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="keyword">Web Site</Label>
              <Input id="keyword" placeholder="Keyword" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Description" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://www.example.com/path?query=value"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="useProxy">Use Proxy</Label>
              <Select required defaultValue="none" name="useProxy">
                <SelectTrigger>
                  <SelectValue placeholder="Select a proxy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {networkEnvironments.map(
                    (networkEnvironment: NetworkEnvironment) => (
                      <SelectItem
                        key={networkEnvironment.id}
                        value={networkEnvironment.id}
                      >
                        {networkEnvironment.label}
                      </SelectItem>
                    )
                  )}
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

export default WebSiteSettingCard;
