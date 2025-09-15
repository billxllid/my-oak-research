import React from "react";
import CategoryTable from "./CategoryTable";

const Category = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Category</h1>
        <p className="text-sm text-muted-foreground">
          Category is a category that is used to track the content of the
          website.
        </p>
      </div>
      <CategoryTable />
    </div>
  );
};

export default Category;
