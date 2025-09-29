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
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

interface DarknetSource {
  id: string;
  label: string;
  desc: string;
  url: string;
}

const DarknetSettingCard = () => {
  const darknetSources: DarknetSource[] = [
    {
      id: "1",
      label: "Ahmia Search Engine",
      desc: "Ahmia is a popular dark web search engine that indexes .onion websites, making them accessible through the Tor network.",
      url: "http://juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion/",
    },
    {
      id: "2",
      label: "Darknet Search Engine",
      desc: "Darknet Search Engine is a popular dark web search engine that indexes .onion websites, making them accessible through the Tor network.",
      url: "http://darknetsearchengine.onion/",
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Darknet Sources</CardTitle>
        <CardDescription>
          You can manage information sources from the darknet here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search darknet sources..."
              className="pl-9 bg-muted border-none"
              icon={<Search size={16} />}
            />
          </div>
          <AddDarknetSourceDialog />
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
            {darknetSources.map((darknetSource: DarknetSource) => (
              <TableRow key={darknetSource.id}>
                <TableCell>{darknetSource.id}</TableCell>
                <TableCell>{darknetSource.label}</TableCell>
                <TableCell className="max-w-xs whitespace-normal">
                  {darknetSource.desc}
                </TableCell>
                <TableCell className="max-w-xs break-all whitespace-normal">
                  <span className="text-sm">{darknetSource.url}</span>
                </TableCell>
                <TableCell>Proxy</TableCell>
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

const AddDarknetSourceDialog = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon />
            Add Darknet Source
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Darknet Source</DialogTitle>
            <DialogDescription>
              Add a new darknet source to your list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="keyword">Name</Label>
              <Input id="keyword" placeholder="Name" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description"
                required
                rows={3}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="url">Domain</Label>
              <Input
                id="url"
                placeholder="https://xxxxxxxxxxxxxxxx.onion"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="network-environment">Network Environment</Label>
              <Select required>
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

export default DarknetSettingCard;
