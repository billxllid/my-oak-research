"use client";

import React from "react";
import { Control, Controller } from "react-hook-form";
import { SelectItem } from "@/components/ui/select";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { Proxy } from "@/lib/generated/prisma";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ErrorMessage";

interface Props {
  control: Control<any>;
  proxies: Proxy[];
  error?: string;
}

const SelectProxy = ({ control, proxies, error }: Props) => {
  return (
    <div className="grid gap-3">
      <Label htmlFor="proxyId">Proxy</Label>
      <Controller
        name="proxyId"
        control={control}
        render={({ field }) => (
          <ControlledSelect
            value={field.value}
            onValueChange={field.onChange}
            placeholder="Select a proxy"
            nullValue="none"
          >
            {proxies.map((proxy: Proxy) => (
              <SelectItem key={proxy.id} value={proxy.id}>
                {proxy.name}
              </SelectItem>
            ))}
          </ControlledSelect>
        )}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default SelectProxy;
