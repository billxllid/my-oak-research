import React from "react";
import Headbar from "../components/Headbar";

export default function FollowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Headbar />
      {children}
    </div>
  );
}
