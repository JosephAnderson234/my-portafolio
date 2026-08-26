"use client";

import { createContext, useContext, useState } from "react";

export type WindowType =
    | "terminal"
    | "about"
    | "projects"
    | "skills"
    | "experience"
    | "education"
    | "leadership";

type WindowState = {
    id: WindowType;
    isActive: boolean;
};

type WindowManagerContextType = {
    windows: WindowState[];
    open: (id: WindowType) => void;
    close: (id: WindowType) => void;
    focus: (id: WindowType) => void;
};

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export function WindowManagerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [windows, setWindows] = useState<WindowState[]>([]);

    const open = (id: WindowType) => {
        setWindows((prev) => {
            if (prev.find((w) => w.id === id)) {
                return prev.map((w) => ({ ...w, isActive: w.id === id }));
            }
            return [
                ...prev.map((w) => ({ ...w, isActive: false })),
                { id, isActive: true },
            ];
        });
    };

    const close = (id: WindowType) => {
        setWindows((prev) => prev.filter((w) => w.id !== id));
    };

    const focus = (id: WindowType) => {
        setWindows((prev) =>
            prev.map((w) => ({
                ...w,
                isActive: w.id === id,
            }))
        );
    };

    return (
        <WindowManagerContext.Provider
            value={{ windows, open, close, focus }}
        >
            {children}
        </WindowManagerContext.Provider>
    );
}

export function useWindowManager() {
    const ctx = useContext(WindowManagerContext);
    if (!ctx) throw new Error("useWindowManager must be used inside provider");
    return ctx;
}
