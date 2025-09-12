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
    url: "/follow/keyword",
    icon: PencilLine,
  },
  {
    title: "Category",
    url: "/follow/category",
    icon: Folder,
  },
  {
    title: "Platform",
    url: "/follow/platform",
    icon: Twitch,
  },
  {
    title: "Site",
    url: "/follow/site",
    icon: Earth,
  },
  {
    title: "Search Engine",
    url: "/follow/search-engine",
    icon: Search,
  },
  {
    title: "Proxy",
    url: "/follow/proxy",
    icon: GlobeLock,
  },
  {
    title: "AI",
    url: "/follow/ai",
    icon: Bot,
  },
  {
    title: "Misc",
    url: "/follow/misc",
    icon: Blocks,
  },
];

const FollowSettingNav = () => {
  return (
    <div className="flex flex-col w-64 gap-2 py-6">
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
