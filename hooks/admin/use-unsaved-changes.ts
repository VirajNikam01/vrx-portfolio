"use client";

import { useEffect } from "react";

export function useUnsavedChanges(dirty: boolean) {
    useEffect(() => {
        if (!dirty) return;
        const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
        const leaving = (event: Event) => { if (!window.confirm("You have unsaved changes. Leave without saving?")) event.preventDefault(); };
        const click = (event: MouseEvent) => {
            const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
            if (!anchor || anchor.target === "_blank" || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            const url = new URL(anchor.href);
            if (url.pathname === location.pathname && url.search === location.search) return;
            if (!window.confirm("You have unsaved changes. Leave without saving?")) { event.preventDefault(); event.stopImmediatePropagation(); }
        };
        window.addEventListener("beforeunload", warn);
        window.addEventListener("admin:leaving", leaving);
        document.addEventListener("click", click, true);
        return () => { window.removeEventListener("beforeunload", warn); window.removeEventListener("admin:leaving", leaving); document.removeEventListener("click", click, true); };
    }, [dirty]);
}
