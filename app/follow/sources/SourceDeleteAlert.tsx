"use client";

import { SettingDeleteAlertDialog } from "@/components/SettingDeleteAlertDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Source, WebSourceConfig, Proxy } from "@/lib/generated/prisma";

interface Props {
  source: Source;
  triggerButton: React.ReactNode;
}

const SourceDeleteAlert = ({ source, triggerButton }: Props) => {
  const router = useRouter();
  const handleDelete = async (source: Source) => {
    await fetch(`/api/follow/sources/${source.id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (res.ok) {
          toast.success("Source deleted successfully");
          setTimeout(() => {
            router.refresh();
          }, 200);
        }
      })
      .catch((err) => {
        toast.error("Failed to delete source");
        console.error(err);
      });
  };
  return (
    <SettingDeleteAlertDialog
      triggerButton={triggerButton}
      title="Delete Source"
      description="Are you sure you want to delete this source?"
      onDelete={() => handleDelete(source)}
    />
  );
};

export default SourceDeleteAlert;
