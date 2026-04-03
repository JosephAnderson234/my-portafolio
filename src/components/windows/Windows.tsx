"use client";

import { motion } from "framer-motion";
import { Rnd } from "react-rnd";
import { ReactNode } from "react";
import { IconX } from "@tabler/icons-react";

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

export default function Window({
    title,
    children,
    isActive,
    onClose,
    onFocus,
    defaultSize = { x: 120, y: 120, width: 520, height: 320 },
}: Props) {
    return (
        <Rnd
            default={defaultSize}
            bounds="window"
            onMouseDown={onFocus}
            style={{ zIndex: isActive ? 50 : 10 }}
            minWidth={360}
            minHeight={220}
        >
            <motion.div
                animate={{
                    borderColor: isActive ? "rgba(111, 242, 255, 0.7)" : "rgba(176, 232, 255, 0.2)",
                    boxShadow: isActive
                        ? "0 0 0 1px rgba(111, 242, 255, 0.33), 0 25px 48px rgba(0, 7, 15, 0.58)"
                        : "0 10px 30px rgba(0, 7, 15, 0.35)",
                }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="hypr-window h-full flex flex-col overflow-hidden"
            >
                <div
                    onMouseDown={onFocus}
                    className={`h-9 flex items-center justify-between px-3 cursor-move select-none border-b ${
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
                        title="Close window"
                        aria-label="Close window"
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
        </Rnd>
    );
}
