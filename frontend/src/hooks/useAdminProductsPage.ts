import { useState } from "react";
import { useAuth } from "@clerk/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "../lib/api";

import type {
  MeResponse,
  ProductsResponse,
  CreateProductResponse,
  UpdateProductByIdResponse,
  SaveProductVariables,
  Product
} from "../types";

export const useAdminProductsPage = () => {
  const queryClient = useQueryClient();

  const { getToken, isSignedIn } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<MeResponse>("/api/me", { getToken }),
    enabled: Boolean(isSignedIn),
  });

  const isAdmin = meData?.user?.role === "admin";

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () =>
      apiFetch<ProductsResponse>("/api/admin/products", { getToken }),
    enabled: Boolean(isSignedIn) && isAdmin,
  });

  const saveMutation = useMutation({
    mutationFn: async ({ body, id }: SaveProductVariables) => {
      if (id) {
        return apiFetch<UpdateProductByIdResponse>(
          `/api/admin/products/${id}`,
          {
            getToken,
            method: "PATCH",
            body,
          },
        );
      }

      return apiFetch<CreateProductResponse>("/api/admin/products", {
        getToken,
        method: "POST",
        body,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });

      setModalOpen(false);
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) =>
      apiFetch<void>(`/api/admin/products/${productId}`, {
        getToken,
        method: "DELETE",
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    },

    onError: (err) => {
      window.alert(err instanceof Error ? err.message : "Delete failed");
    },
  });

  return {
    getToken,
    isSignedIn,
    meData,
    modalOpen,
    setModalOpen,
    editing,
    setEditing,
    products: data?.products ?? [],
    isLoading,
    saveMutation,
    deleteMutation,
  };
};
