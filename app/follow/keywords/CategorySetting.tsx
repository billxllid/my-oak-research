import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Category } from "@/lib/generated/prisma";
import { SettingCard } from "@/components/SettingCard";
import EditCategoryDialog from "./CategoryDialog";
import CategoryTable from "./Categories";

interface Props {
  categories: Category[];
}

const CategorySettingCard = ({ categories }: Props) => {
  return (
    <SettingCard
      title="Manage Keyword Categories"
      description="You can manage your keyword categories here."
      buttonComponent={
        <EditCategoryDialog
          triggerButton={
            <Button>
              <PlusIcon />
              Add Category
            </Button>
          }
        />
      }
      filterComponent={
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category: Category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      <CategoryTable categories={categories} />
    </SettingCard>
  );
};

export default CategorySettingCard;
