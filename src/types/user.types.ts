export type UserRole = "editor" | "viewer";

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
}
