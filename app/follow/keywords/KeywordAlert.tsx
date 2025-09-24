"use client";

import { Prisma } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SettingDeleteAlertDialog } from "@/components/SettingDeleteAlertDialog";

type KeywordWithCategory = Prisma.KeywordGetPayload<{
  include: { category: true };
}>;

const DeleteKeywordDialog = ({
  keyword,
  triggerButton,
}: {
  keyword: KeywordWithCategory;
  triggerButton: React.ReactNode;
}) => {
  const router = useRouter();
  const handleDelete = async (keyword: KeywordWithCategory) => {
    await fetch(`/api/follow/keywords/${keyword.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        const handleResponse = () => {
          if (res.ok) return toast.success("Keyword deleted successfully");
          return toast.error("Failed to delete keyword");
        };

        handleResponse();

        setTimeout(() => {
          router.refresh();
        }, 200);
      })
      .catch((err) => {
        toast.error("Failed to delete keyword");
        console.error(err);
      });
  };
  return (
    <SettingDeleteAlertDialog
      triggerButton={triggerButton}
      title="Delete Keyword"
      description={`Are you sure you want to delete ${keyword.name} keyword?`}
      onDelete={() => handleDelete(keyword)}
    />
  );
};

export default DeleteKeywordDialog;
