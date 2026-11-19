"use client";

import { motion } from "framer-motion";
import { Rnd } from "react-rnd";
import { ReactNode, useEffect, useRef, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { useWindowManager } from "src/context/WindowManagerContext";

type Props = {
    title: string;
    children: ReactNode;
    isActive: boolean;
    onClose: () => void;
    onFocus: () => void;
    defaultSize?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
};

const CASCADE_STEP_X = 46;
const CASCADE_STEP_Y = 38;
const CASCADE_MAX = 5;

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const query = window.matchMedia("(max-width: 639px)");
        setIsMobile(query.matches);
        const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        query.addEventListener("change", listener);
        return () => query.removeEventListener("change", listener);
    }, []);

    return isMobile;
}

function WindowChrome({
    title,
    children,
    isActive,
    onClose,
    onFocus,
    className,
}: {
    title: string;
    children: ReactNode;
    isActive: boolean;
    onClose: () => void;
    onFocus: () => void;
    className?: string;
}) {
    return (
        <motion.div
            animate={{
                borderColor: isActive ? "rgba(111, 242, 255, 0.7)" : "rgba(176, 232, 255, 0.2)",
                boxShadow: isActive
                    ? "0 0 0 1px rgba(111, 242, 255, 0.33), 0 25px 48px rgba(0, 7, 15, 0.58)"
                    : "0 10px 30px rgba(0, 7, 15, 0.35)",
                opacity: isActive ? 1 : 0.6,
            }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`hypr-window flex h-full flex-col overflow-hidden ${className ?? ""}`}
        >
            <div
                onMouseDown={onFocus}
                className={`flex h-9 shrink-0 items-center justify-between px-3 select-none border-b sm:cursor-move ${
                    isActive
                        ? "border-cyan-100/25 bg-slate-900/72"
                        : "border-white/10 bg-slate-950/52"
                }`}
            >
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/85" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300/85" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/85" />
                    <span className="pl-1 text-sm tracking-wide text-slate-100">{title}</span>
                </div>

                <button
                    onClick={onClose}
                    className="rounded-md border border-white/10 p-1 text-slate-300 transition-colors hover:border-cyan-100/40 hover:text-cyan-100"
                    title="Cerrar ventana"
                    aria-label="Cerrar ventana"
                >
                    <IconX size={14} stroke={2.2} />
                </button>
            </div>

            <div
                className="flex-1 overflow-auto p-3 text-sm text-slate-100"
                style={{ fontFamily: "var(--font-mono)" }}
            >
                {children}
            </div>
        </motion.div>
    );
}

export default function Window({
    title,
    children,
    isActive,
    onClose,
    onFocus,
    defaultSize = { x: 120, y: 120, width: 520, height: 320 },
}: Props) {
    const { windows } = useWindowManager();
    const isMobile = useIsMobile();

    const cascadeIndexRef = useRef<number | null>(null);
    if (cascadeIndexRef.current === null) {
        cascadeIndexRef.current = Math.max(windows.length - 1, 0) % CASCADE_MAX;
    }
    const cascadeIndex = cascadeIndexRef.current;

    const cascadedDefault = {
        ...defaultSize,
        x: defaultSize.x + cascadeIndex * CASCADE_STEP_X,
        y: defaultSize.y + cascadeIndex * CASCADE_STEP_Y,
    };

    if (isMobile) {
        if (!isActive) return null;

        return (
            <div className="absolute inset-x-2 top-14 bottom-24 z-40">
                <WindowChrome title={title} isActive={isActive} onClose={onClose} onFocus={onFocus}>
                    {children}
                </WindowChrome>
            </div>
        );
    }

    return (
        <Rnd
            default={cascadedDefault}
            bounds="window"
            onMouseDown={onFocus}
            style={{ zIndex: isActive ? 50 : 10 }}
            minWidth={360}
            minHeight={220}
        >
            <WindowChrome title={title} isActive={isActive} onClose={onClose} onFocus={onFocus}>
                {children}
            </WindowChrome>
        </Rnd>
    );
}
