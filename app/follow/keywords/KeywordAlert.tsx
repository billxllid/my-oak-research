"use client";

import { Prisma } from "@/lib/generated/prisma";
import { DeleteAlert } from "@/components/common";

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
  return (
    <DeleteAlert
      item={keyword}
      itemName="name"
      title="Delete Keyword"
      description={(item) =>
        `Are you sure you want to delete "${item.name}" keyword? This action cannot be undone.`
      }
      queryKeys={[["keywords"]]}
      deleteEndpoint={(id) => `/api/follow/keywords/${id}`}
      triggerButton={triggerButton}
    />
  );
};

export default DeleteKeywordDialog;
