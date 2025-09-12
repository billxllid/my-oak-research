import React from "react";
import FollowSettingNav from "./FollowSettingNav";

const FollowLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <FollowSettingNav />
      <div className="flex flex-1 flex-col px-4">{children}</div>
    </div>
  );
};

export default FollowLayout;
