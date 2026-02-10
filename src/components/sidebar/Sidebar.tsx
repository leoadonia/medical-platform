"use client";

import { ReactNode } from "react";
import { useSidebarStore } from "./store";

const Header = (props: { children?: ReactNode }) => (
  <div className="flex flex-col items-center py-4">{props.children}</div>
);

const Center = (props: { children?: ReactNode }) => {
  return <div className="flex-1 overflow-y-auto">{props.children}</div>;
};

const Footer = (props: { children?: ReactNode }) => (
  <div className="mt-auto py-2">{props.children}</div>
);

export const Sidebar = (props: {
  header?: ReactNode;
  center?: ReactNode;
  footer?: ReactNode;
}) => {
  const { collapsed } = useSidebarStore();

  if (collapsed) {
    return <></>;
  }

  return (
    <div className="shadow-info-100 flex min-h-screen w-50 flex-col overflow-hidden p-2 shadow-sm lg:w-60">
      <div className="min-h-20">
        {props.header && <Header>{props.header}</Header>}
      </div>
      {props.center && <Center>{props.center}</Center>}
      {props.footer && <Footer>{props.footer}</Footer>}
    </div>
  );
};
