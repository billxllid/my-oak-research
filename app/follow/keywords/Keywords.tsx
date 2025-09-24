import { Category, Prisma } from "@/lib/generated/prisma";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EditKeywordDialog from "./KeywordDialog";
import DeleteKeywordDialog from "./KeywordAlert";

type KeywordWithCategory = Prisma.KeywordGetPayload<{
  include: { category: true };
}>;

const KeywordsTable = ({
  keywords,
  categories,
}: {
  keywords: KeywordWithCategory[];
  categories: Category[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Lang</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Includes</TableHead>
          <TableHead>Excludes</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keywords.map((keyword, index) => (
          <TableRow key={keyword.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{keyword.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{keyword.lang}</Badge>
            </TableCell>
            <TableCell>{keyword.category?.name}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1 max-w-md">
                {keyword.includes.map((include) => (
                  <Badge
                    key={include}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {include}
                    <XIcon
                      size={12}
                      color="gray"
                      className="cursor-pointer hover:text-red-500"
                    />
                  </Badge>
                ))}
                {keyword.synonyms.map((synonym) => (
                  <Badge key={synonym} variant="secondary">
                    {synonym}
                    <XIcon
                      size={12}
                      color="gray"
                      className="cursor-pointer hover:text-red-500"
                    />
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1 max-w-2xl">
                {keyword.excludes.map((exclude) => (
                  <Badge key={exclude} variant="outline">
                    {exclude}
                    <XIcon
                      size={12}
                      color="gray"
                      className="cursor-pointer hover:text-red-500"
                    />
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <EditKeywordDialog
                  keyword={keyword}
                  categories={categories}
                  triggerButton={
                    <Button size="sm" variant="outline">
                      <PencilIcon className="size-3" />
                    </Button>
                  }
                />
                <DeleteKeywordDialog
                  keyword={keyword}
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

export default KeywordsTable;
