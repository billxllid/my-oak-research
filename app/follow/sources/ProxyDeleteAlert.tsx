"use client";

import { SettingDeleteAlertDialog } from "@/components/SettingDeleteAlertDialog";
import { useRouter } from "next/navigation";
import React from "react";
import { Proxy } from "@/lib/generated/prisma";
import { toast } from "sonner";

interface Props {
  proxy: Proxy;
  triggerButton: React.ReactNode;
}

const ProxyDeleteAlert = ({ proxy, triggerButton }: Props) => {
  const router = useRouter();
  const handleDelete = async (proxy: Proxy) => {
    await fetch(`/api/follow/proxy/${proxy.id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (res.ok) {
          toast.success("Proxy deleted successfully");
          setTimeout(() => {
            router.refresh();
          }, 200);
        }
      })
      .catch((err) => {
        toast.error("Failed to delete proxy");
        console.error(err);
      });
  };
  return (
    <SettingDeleteAlertDialog
      triggerButton={triggerButton}
      title="Delete Proxy"
      description="Are you sure you want to delete this proxy?"
      onDelete={() => handleDelete(proxy)}
    />
  );
};

export default ProxyDeleteAlert;
