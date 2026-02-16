export const AUTO_SAVE_DELAY = 1000;

export const TOAST_DURATION = 5000;

export const NODE_DEFAULTS = {
  MIN_WIDTH: 120,
  MIN_HEIGHT: 120,
  PADDING: 10,
  BORDER_WIDTH: 2,
} as const;

export const SHAPE_STYLES = {
  rectangle: {
    borderRadius: 8,
  },
  circle: {
    borderRadius: "50%",
    width: NODE_DEFAULTS.MIN_WIDTH,
    height: NODE_DEFAULTS.MIN_HEIGHT,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  diamond: {
    transform: "rotate(45deg)",
    width: NODE_DEFAULTS.MIN_WIDTH,
    height: NODE_DEFAULTS.MIN_HEIGHT,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
} as const;

export const USER_ROLES = {
  EDITOR: "editor",
  VIEWER: "viewer",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/",
  DIAGRAM: "/diagram/:id",
  PROFILE: "/profile",
} as const;

// Colors
export const COLORS = {
  PRIMARY: "#667eea",
  PRIMARY_HOVER: "#5568d3",
  SECONDARY: "#764ba2",
  SUCCESS: "#28a745",
  ERROR: "#d63031",
  WARNING: "#ffc107",
  INFO: "#0c5460",
  BORDER: "#ddd",
  TEXT_PRIMARY: "#333",
  TEXT_SECONDARY: "#666",
  TEXT_MUTED: "#999",
  BACKGROUND: "#f8f9fa",
} as const;

export const COLLECTIONS = {
  USERS: "users",
  DIAGRAMS: "diagrams",
} as const;

export const ERROR_MESSAGES = {
  GENERIC: "An unexpected error occurred. Please try again.",
  NETWORK: "Network error. Please check your internet connection.",
  PERMISSION_DENIED: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  AUTHENTICATION_REQUIRED: "Please log in to continue.",
} as const;
