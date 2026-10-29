// src/app/providers/QueryClientProvider.js
import React from "react";
import PropTypes from "prop-types";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";

// Decide si un error merece reintento (red/5xx sí, 4xx NO, aborts NO)
const isRetryableError = (error) => {
  const status = error?.response?.status;
  if (error?.code === "ERR_CANCELED" || error?.name === "CanceledError") return false;
  if (status == null) return true; // fallo de red
  if (status >= 500 && status < 600) return true; // 5xx
  return false; // 4xx
};

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 min "fresco"
      gcTime: 10 * 60 * 1000, // 10 min cache
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: "ifStale",
      retry: (failureCount, error) => {
        if (failureCount >= 2) return false;
        return isRetryableError(error);
      },
    },
    mutations: {
      retry: 0, // no reintentar mutaciones por defecto
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query?.meta?.silent) return;
      // opcional: enviar a Sentry / mostrar toast
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) => {
      if (mutation?.meta?.silent) return;
      // opcional: mostrar toast
    },
  }),
});

export default function WithQueryClient({ children }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

WithQueryClient.propTypes = { children: PropTypes.any };
