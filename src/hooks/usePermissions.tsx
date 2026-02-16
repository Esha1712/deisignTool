import { useMemo } from "react";
import type { UserRole } from "../types/user.types";
import type { Diagram } from "../types/diagram.types";
import { useAuth } from "./useAuth";

interface UsePermissionsReturn {
  isOwner: boolean;
  isEditor: boolean;
  isViewer: boolean;
  hasAccess: boolean;
  role: UserRole | undefined;
}

export const usePermissions = (
  diagram: Diagram | null
): UsePermissionsReturn => {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user || !diagram) {
      return {
        isOwner: false,
        isEditor: false,
        isViewer: false,
        hasAccess: false,
        role: undefined,
      };
    }

    const isOwner = diagram.ownerId === user.uid;
    const sharedRole = diagram.sharedWith?.[user.uid];

    const role: UserRole | undefined = isOwner ? "editor" : sharedRole;
    const hasAccess = isOwner || sharedRole !== undefined;
    const isEditor = role === "editor";
    const isViewer = role === "viewer";

    return {
      isOwner,
      isEditor,
      isViewer,
      hasAccess,
      role,
    };
  }, [user, diagram]);
};
