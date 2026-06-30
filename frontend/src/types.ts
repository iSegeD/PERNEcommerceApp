export type UserRole = "customer" | "admin" | "support";

export type User = {
  id: string;
  clerkUserId: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type MeResponse = {
  user: User | undefined;
};
