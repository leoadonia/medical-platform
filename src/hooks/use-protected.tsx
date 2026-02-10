"use client";

import { useAuthorized, useProfileStore } from "@/lib/stores/profile";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const useProtected = () => {
  const hasHydrated = useProfileStore((state) => state._hasHydrated);
  const isAuthed = useAuthorized();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!isAuthed) {
      router.replace(`/login?callbackUrl=${path}`);
    }
  }, [hasHydrated, isAuthed, path, router]);

  return isAuthed;
};
