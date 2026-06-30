import axios from "axios";
import * as Sentry from "@sentry/react";

import type { GetToken } from "@clerk/types";

const raw = import.meta.env.VITE_API_URL;
const baseURL = typeof raw === "string" ? raw.replace(/\/+$/, "") : "";

export const api = axios.create({
  baseURL,
});

type ApiOptions = {
  getToken?: GetToken;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

export const apiFetch = async (path: string, options: ApiOptions = {}) => {
  const { getToken, method = "GET", body } = options;

  const headers: Record<string, string> = {};

  if (getToken) {
    const token = await getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const res = await api({
      url: path,
      method,
      headers,
      data: body,
    });

    Sentry.addBreadcrumb({
      category: "api",
      message: `${method} ${path}`,
      level: "info",
      data: { status: res.status },
    });

    return res.data;
  } catch (error: unknown) {
    Sentry.addBreadcrumb({
      category: "api",
      message: `${method} ${path}`,
      level: "error",
      data: {
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
      },
    });

    Sentry.captureException(error, {
      tags: { "api.fetch": "network" },
      extra: { path, method },
    });

    if (axios.isAxiosError(error)) {
      const message =
        typeof error.response?.data?.error === "string"
          ? error.response.data.error
          : error.message;

      throw new Error(message, { cause: error });
    }

    throw error;
  }
};
