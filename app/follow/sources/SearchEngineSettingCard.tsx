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
import { PlusIcon } from "lucide-react";
import { Source, Proxy } from "@/lib/generated/prisma";
import { SearchEngineSourceConfig } from "@/lib/generated/prisma";
import SearchEngineSourceDialog from "./SearchEngineSourceDialog";
import SourceDeleteAlert from "./SourceDeleteAlert";

interface Props {
  sources: (Source & { search: SearchEngineSourceConfig } & { proxy: Proxy })[];
  proxies: Proxy[];
}

const SearchEngineSettingCard = ({ sources, proxies }: Props) => {
  // const searchEngines: SearchEngine[] = [
  //   {
  //     id: "1",
  //     label: "Google",
  //     desc: "Google is a search engine that indexes the web.",
  //     url: "https://www.google.com",
  //   },
  // ];
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
          <SearchEngineSourceDialog
            triggerButton={
              <Button>
                <PlusIcon />
                Add Search Engine
              </Button>
            }
            proxies={proxies}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Proxy</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map(
              (
                source: Source & { search: SearchEngineSourceConfig } & {
                  proxy: Proxy;
                },
                index
              ) => (
                <TableRow key={source.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{source.name}</TableCell>
                  <TableCell className="max-w-xs whitespace-normal">
                    {source.description}
                  </TableCell>
                  <TableCell className="max-w-xs break-all whitespace-normal">
                    <span className="text-sm">{source.search.query}</span>
                  </TableCell>
                  <TableCell>
                    {source.proxy ? source.proxy?.name : ""}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <SearchEngineSourceDialog
                        triggerButton={
                          <Button size="sm" variant="outline">
                            <PencilIcon className="size-3" />
                          </Button>
                        }
                        proxies={proxies}
                        source={source}
                      />
                      <SourceDeleteAlert
                        source={source}
                        queryKeyType="SEARCH_ENGINE"
                        triggerButton={
                          <Button size="sm" variant="outline">
                            <TrashIcon className="size-3" />
                          </Button>
                        }
                      />
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

export default SearchEngineSettingCard;
