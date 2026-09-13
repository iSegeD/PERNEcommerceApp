type UserRole = 'customer' | 'admin' | 'support';
type OrderStatus = 'pending' | 'paid' | 'failed';

type User = {
  id: string;
  clerkUserId: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
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

type ProductResponse = {
  product: Product;
};

export type ProductBody = Omit<Product, 'id' | 'createdAt'>;

export type PreviewItems = {
  name: string;
  slug: string;
  imageUrl: string | null;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  status: OrderStatus;
  polarCheckoutId: string | null;
  polarOrderId: string | null;
  totalCents: number;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  quantity: number;
  unitPriceCents: number;
  product: Product;
};

type OrderListItem = Order & {
  previewItems: PreviewItems[];
};

export type MeResponse = {
  user: User | undefined;
};

export type CategoriesResponse = {
  categories: string[];
};

export type ProductsResponse = {
  products: Product[];
};

export type ProductBySlugResponse = ProductResponse;

export type CheckoutResponse = {
  checkoutUrl: string;
};

export type OrdersResponse = {
  orders: OrderListItem[];
};

export type OrderResponse = {
  order: Order;
  items: OrderItem[];
};

export type VideoInviteResponse = {
  joinUrl: string;
};

export type StreamChannelResponse = {
  channelType: string;
  channelId: string;
  streamUserId: string;
};

export type StreamTokenResponse = {
  token: string;
  apiKey: string;
  userId: string;
  name: string;
};

export type ImageKitAuthResponse = {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  urlEndpoint: string;
};

export type ImageKitUploadResponse = {
  url: string;
  fileId?: string;
};

export type CreateProductResponse = ProductResponse;

export type UpdateProductByIdResponse = ProductResponse;

export type SaveProductVariables =
  | {
      id?: undefined;
      body: ProductBody;
    }
  | {
      id: string;
      body: Partial<ProductBody>;
    };


