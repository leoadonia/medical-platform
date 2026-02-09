"use client";

import { useSidebarStore } from "@/components/sidebar/store";
import React, { useEffect, useState } from "react";

const Link = ({
  title,
  active,
  onClick,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className="hover:text-info-500 data-[active=true]:text-info-600 scroll-smooth rounded-lg p-2 text-center text-xs font-medium hover:cursor-default data-[active=true]:border data-[active=true]:border-white"
      data-active={active}
      onClick={onClick}
    >
      {title}
    </div>
  );
};

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const { setCollapsed } = useSidebarStore();
  const [hash, setHash] = useState<string>("article");

  useEffect(() => {
    setCollapsed(true);
  }, [setCollapsed]);

  const handleClick = (href: string) => {
    setHash(href);
    const element = document.getElementById(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex">
      <div className="w-50">
        <div className="fixed top-28 flex w-36 flex-col justify-center gap-2">
          <Link
            title="科普文章"
            active={hash === "article"}
            onClick={() => handleClick("article")}
          />
          <Link
            title="锻炼视频"
            active={hash === "video"}
            onClick={() => handleClick("video")}
          />
          <Link
            title="数据目录"
            active={hash === "data"}
            onClick={() => handleClick("data")}
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default SettingsLayout;
