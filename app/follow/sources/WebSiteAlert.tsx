import { SettingDeleteAlertDialog } from "@/components/SettingDeleteAlertDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Source, WebSourceConfig, Proxy } from "@/lib/generated/prisma";

interface Props {
  webSite: Source & { web: WebSourceConfig } & { proxy: Proxy };
  triggerButton: React.ReactNode;
}

const DeleteWebSiteDialog = ({ webSite, triggerButton }: Props) => {
  const router = useRouter();
  const handleDelete = async (
    webSite: Source & { web: WebSourceConfig } & { proxy: Proxy }
  ) => {
    await fetch(`/api/follow/sources/${webSite.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Web site deleted successfully");
          setTimeout(() => {
            router.refresh();
          }, 200);
        }
      })
      .catch((err) => {
        toast.error("Failed to delete web site");
        console.error(err);
      });
  };
  return (
    <SettingDeleteAlertDialog
      triggerButton={triggerButton}
      title="Delete Web Site"
      description="Are you sure you want to delete this web site?"
      onDelete={() => handleDelete(webSite)}
    />
  );
};

export default DeleteWebSiteDialog;
