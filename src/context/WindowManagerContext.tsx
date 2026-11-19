"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type WindowType =
    | "terminal"
    | "about"
    | "projects"
    | "skills"
    | "experience"
    | "education"
    | "leadership"
    | "settings";

type WindowState = {
    id: WindowType;
    isActive: boolean;
};

type WindowManagerContextType = {
    windows: WindowState[];
    open: (id: WindowType) => void;
    close: (id: WindowType) => void;
    focus: (id: WindowType) => void;
    closeActive: () => void;
    cycleFocus: (direction: 1 | -1) => void;
};

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

/** Al cerrar la ventana activa, el foco pasa a la última abierta (como Hyprland). */
function removeWindow(prev: WindowState[], id: WindowType): WindowState[] {
    const closing = prev.find((w) => w.id === id);
    const rest = prev.filter((w) => w.id !== id);
    if (closing?.isActive && rest.length) {
        const lastId = rest[rest.length - 1].id;
        return rest.map((w) => ({ ...w, isActive: w.id === lastId }));
    }
    return rest;
}

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
    const [windows, setWindows] = useState<WindowState[]>([{ id: "about", isActive: true }]);

    const open = useCallback((id: WindowType) => {
        setWindows((prev) => {
            if (prev.find((w) => w.id === id)) {
                return prev.map((w) => ({ ...w, isActive: w.id === id }));
            }
            return [...prev.map((w) => ({ ...w, isActive: false })), { id, isActive: true }];
        });
    }, []);

    const close = useCallback((id: WindowType) => {
        setWindows((prev) => removeWindow(prev, id));
    }, []);

    const focus = useCallback((id: WindowType) => {
        setWindows((prev) =>
            prev.some((w) => w.id === id && w.isActive) ? prev : prev.map((w) => ({ ...w, isActive: w.id === id }))
        );
    }, []);

    const closeActive = useCallback(() => {
        setWindows((prev) => {
            const active = prev.find((w) => w.isActive);
            return active ? removeWindow(prev, active.id) : prev;
        });
    }, []);

    const cycleFocus = useCallback((direction: 1 | -1) => {
        setWindows((prev) => {
            if (prev.length < 2) return prev;
            const current = prev.findIndex((w) => w.isActive);
            const next = (current + direction + prev.length) % prev.length;
            return prev.map((w, i) => ({ ...w, isActive: i === next }));
        });
    }, []);

    const value = useMemo(
        () => ({ windows, open, close, focus, closeActive, cycleFocus }),
        [windows, open, close, focus, closeActive, cycleFocus]
    );

    return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>;
}

export function useWindowManager() {
    const ctx = useContext(WindowManagerContext);
    if (!ctx) throw new Error("useWindowManager must be used inside provider");
    return ctx;
}
