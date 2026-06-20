"use client";

import { queryClient } from "@/config/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
