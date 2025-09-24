"use client";

import { Category } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SettingDeleteAlertDialog } from "@/components/SettingDeleteAlertDialog";

const DeleteCategoryDialog = ({
  category,
  triggerButton,
}: {
  category: Category;
  triggerButton: React.ReactNode;
}) => {
  const router = useRouter();
  const handleDelete = async (category: Category) => {
    await fetch(`/api/follow/categories/${category.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        const handleResponse = () => {
          if (res.ok) return toast.success("Category deleted successfully");
          if (res.status === 409)
            return toast.error(
              "Category is in use by keywords; migrate or remove those first"
            );
          return toast.error("Failed to delete category");
        };

        handleResponse();

        setTimeout(() => {
          router.refresh();
        }, 200);
      })
      .catch((err) => {
        toast.error("Failed to delete category");
        console.error(err);
      });
  };
  return (
    <SettingDeleteAlertDialog
      triggerButton={triggerButton}
      title="Delete Category"
      description={`Are you sure you want to delete ${category.name} category?`}
      onDelete={() => handleDelete(category)}
    />
  );
};

export default DeleteCategoryDialog;
