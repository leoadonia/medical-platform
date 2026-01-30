"use client";

import { useAuthorized } from "@/lib/stores/profile";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const useProtected = () => {
  const isAuthed = useAuthorized();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed) {
      router.replace(`/login?callbackUrl=${path}`);
    }
  }, [isAuthed, path, router]);

  return isAuthed;
};
