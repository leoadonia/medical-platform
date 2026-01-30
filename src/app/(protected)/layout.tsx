"use client";

import { useProtected } from "@/hooks/use-protected";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const isAuthed = useProtected();
  if (!isAuthed) {
    return <></>;
  }

  return <>{children}</>;
};

export default ProtectedLayout;
