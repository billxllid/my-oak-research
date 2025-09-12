"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { StarIcon, MoonIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Headbar = () => {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "Home", href: "/" }];

    let currentPath = "";
    for (const segment of segments) {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({
        label,
        href: currentPath,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  return (
    <div className="flex items-center py-4 gap-4">
      <SidebarTrigger />
      <div className="flex items-center justify-between w-full">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map(
              (item: { label: string; href: string }, index: number) => (
                <React.Fragment key={item.label}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < breadcrumbItems.length - 1 && (
                    <BreadcrumbSeparator />
                  )}
                </React.Fragment>
              )
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex">
          <Button variant="ghost">
            <StarIcon />
          </Button>
          <Button variant="ghost">
            <MoonIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Headbar;
