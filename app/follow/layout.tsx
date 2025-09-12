import React from "react";
import FollowSettingNav from "./FollowSettingNav";

const FollowLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <FollowSettingNav />
      {children}
    </div>
  );
};

export default FollowLayout;
