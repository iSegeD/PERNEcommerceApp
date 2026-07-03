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

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
  imageKitFileId: string | null;
  active: boolean;
  createdAt: string;
};

export type CategoriesResponse = {
  categories: string[];
};

export type ProductsResponse = {
  products: Product[];
};
