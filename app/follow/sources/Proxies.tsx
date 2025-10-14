"use client";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Proxy } from "@/lib/generated/prisma";
import { Table } from "@/components/ui/table";
import React from "react";
import EditProxySettingDialog from "./ProxySettingDialog";
import ProxyDeleteAlert from "./ProxyDeleteAlert";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";

interface Props {
  proxies: Proxy[];
}

const Proxies = ({ proxies }: Props) => {
  return (
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
        {proxies.map((proxy, index: number) => (
          <TableRow key={proxy.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{proxy.name}</TableCell>
            <TableCell>{proxy.type}</TableCell>
            <TableCell>{proxy.url}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <EditProxySettingDialog
                  triggerButton={
                    <Button size="sm" variant="outline">
                      <PencilIcon className="size-3" />
                    </Button>
                  }
                  currentProxy={proxy}
                />
                <ProxyDeleteAlert
                  proxy={proxy}
                  triggerButton={
                    <Button size="sm" variant="outline">
                      <TrashIcon className="size-3" />
                    </Button>
                  }
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Proxies;
