"use client";

import React from "react";

import ThemeProvider from "@/components/theme/theme-provider";
import { ReactQueryProvider } from "./react-query-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ReactQueryProvider>
            <ThemeProvider>{children}</ThemeProvider>
        </ReactQueryProvider>
    );
}
