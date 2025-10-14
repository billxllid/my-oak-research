"use client";

import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { SocialMediaSourceConfig, Source, Proxy } from "@/lib/generated/prisma";
import { SocialConfigByPlatform } from "@/app/api/_utils/zod";
import { z } from "zod";
import {
  DataTable,
  DataTableColumn,
  DataTableAction,
} from "@/components/common";
import SocialMediaSourceDialog from "./SocialMediaSourceDialog";
import SourceDeleteAlert from "./SourceDeleteAlert";

interface Props {
  sources: (Source & { social: SocialMediaSourceConfig } & { proxy: Proxy })[];
  proxies: Proxy[];
}

type SocialMediaSource = Source & { social: SocialMediaSourceConfig } & {
  proxy: Proxy;
};

const SocialMediaSources = ({ sources, proxies }: Props) => {
  // 定义表格列配置
  const columns: DataTableColumn<SocialMediaSource>[] = [
    {
      key: "name",
      label: "Name",
      render: (source) => source.name,
    },
    {
      key: "description",
      label: "Description",
      render: (source) => source.description,
    },
    {
      key: "platform",
      label: "Type",
      render: (source) => source.social.platform,
    },
    {
      key: "proxy",
      label: "Proxy",
      render: (source) => source.proxy?.name || "None",
    },
  ];

  // 定义操作配置
  const actions: DataTableAction<SocialMediaSource>[] = [
    {
      type: "edit",
      render: (source) => (
        <SocialMediaSourceDialog
          proxies={proxies}
          source={
            source as Source & {
              social: z.infer<typeof SocialConfigByPlatform>;
            } & { proxy: Proxy }
          }
          triggerButton={
            <Button size="sm" variant="outline">
              <PencilIcon className="size-3" />
            </Button>
          }
        />
      ),
    },
    {
      type: "delete",
      render: (source) => (
        <SourceDeleteAlert
          source={source}
          queryKeyType="SOCIAL_MEDIA"
          triggerButton={
            <Button size="sm" variant="outline">
              <TrashIcon className="size-3" />
            </Button>
          }
        />
      ),
    },
  ];

  return (
    <DataTable
      data={sources}
      columns={columns}
      actions={actions}
      emptyMessage="No social media sources found. Add your first social media source to get started."
    />
  );
};

export default SocialMediaSources;
