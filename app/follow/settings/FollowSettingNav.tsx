import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  PencilLine,
  Folder,
  Twitch,
  Search,
  Earth,
  GlobeLock,
  Bot,
  Blocks,
} from "lucide-react";

const menuItems = [
  {
    title: "Keyword",
    url: "/follow/settings/keyword",
    icon: PencilLine,
  },
  {
    title: "Category",
    url: "/follow/settings/category",
    icon: Folder,
  },
  {
    title: "Platform",
    url: "/follow/settings/platform",
    icon: Twitch,
  },
  {
    title: "Site",
    url: "/follow/settings/site",
    icon: Earth,
  },
  {
    title: "Search Engine",
    url: "/follow/settings/search-engine",
    icon: Search,
  },
  {
    title: "Proxy",
    url: "/follow/settings/proxy",
    icon: GlobeLock,
  },
  {
    title: "AI",
    url: "/follow/settings/ai",
    icon: Bot,
  },
  {
    title: "Misc",
    url: "/follow/settings/misc",
    icon: Blocks,
  },
];

const FollowSettingNav = () => {
  return (
    <div className="flex flex-col w-64 gap-2 border-r pr-4">
      {menuItems.map((item) => (
        <Button
          asChild
          variant="ghost"
          key={item.title}
          className="justify-start"
        >
          <Link href={item.url}>
            <item.icon />
            {item.title}
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default FollowSettingNav;
