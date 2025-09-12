import React from "react";
import FollowSettingNav from "./FollowSettingNav";

const FollowLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <FollowSettingNav />
      <div className="flex flex-col w-full px-4">{children}</div>
    </div>
  );
};

export default FollowLayout;
