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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";

interface SearchEngine {
  id: string;
  label: string;
  desc: string;
  url: string;
}

const SearchEngineSettingCard = () => {
  const searchEngines: SearchEngine[] = [
    {
      id: "1",
      label: "Google",
      desc: "Google is a search engine that indexes the web.",
      url: "https://www.google.com",
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Search Engines</CardTitle>
        <CardDescription>You can manage search engines here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search search engines..."
              className="pl-9 bg-muted border-none"
              icon={<Search size={16} />}
            />
          </div>
          <AddSearchEngineDialog />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchEngines.map((searchEngine: SearchEngine) => (
              <TableRow key={searchEngine.id}>
                <TableCell>{searchEngine.id}</TableCell>
                <TableCell>{searchEngine.label}</TableCell>
                <TableCell className="max-w-xs whitespace-normal">
                  {searchEngine.desc}
                </TableCell>
                <TableCell className="max-w-xs break-all whitespace-normal">
                  <span className="text-sm">{searchEngine.url}</span>
                </TableCell>
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

const AddSearchEngineDialog = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon />
            Add Search Engine
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Search Engine</DialogTitle>
            <DialogDescription>
              Add a new search engine to your list.
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
              <Input id="url" placeholder="https://www.google.com" required />
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

export default SearchEngineSettingCard;
