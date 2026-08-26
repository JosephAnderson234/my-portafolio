"use client";

import { motion } from "framer-motion";
import type { ComponentType } from "react";
import {
    IconBriefcase,
    IconFolderCode,
    IconSchool,
    IconTerminal2,
    IconTool,
    IconUserCircle,
    IconUsers,
} from "@tabler/icons-react";
import { useWindowManager, WindowType } from "src/context/WindowManagerContext";

const apps: { id: WindowType; icon: ComponentType<{ size?: number; stroke?: number }>; label: string }[] = [
    { id: "terminal", icon: IconTerminal2, label: "Terminal" },
    { id: "about", icon: IconUserCircle, label: "About Me" },
    { id: "projects", icon: IconFolderCode, label: "Projects" },
    { id: "experience", icon: IconBriefcase, label: "Experience" },
    { id: "education", icon: IconSchool, label: "Education" },
    { id: "leadership", icon: IconUsers, label: "Leadership" },
    { id: "skills", icon: IconTool, label: "Skills" },
];

export default function Dock() {
    const { open, focus, windows } = useWindowManager();

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
            className="hypr-dock absolute bottom-3 left-1/2 z-40 -translate-x-1/2 px-3 py-2 sm:bottom-4 sm:px-4 sm:py-2"
        >
            <div className="flex gap-1.5 sm:gap-3">
            {apps.map((app) => {
                const Icon = app.icon;
                const isOpen = windows.some((w) => w.id === app.id);
                const isActive = windows.find((w) => w.id === app.id)?.isActive;

                return (
                    <motion.button
                        key={app.id}
                        onClick={() => (isOpen ? focus(app.id) : open(app.id))}
                        whileHover={{ y: -5, scale: 1.06 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 340, damping: 20 }}
                        className={`group relative flex h-12 w-12 items-center justify-center rounded-xl border transition-colors sm:h-14 sm:w-14 ${
                            isActive
                                ? "hypr-active-outline bg-cyan-200/15 text-cyan-100"
                                : "border-white/10 bg-slate-900/40 text-slate-300 hover:border-cyan-200/35 hover:text-cyan-50"
                        }`}
                        aria-label={app.label}
                        title={app.label}
                    >
                        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-slate-950/90 px-2 py-1 text-[11px] text-slate-200 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-150 group-hover:-translate-y-0.5 group-hover:opacity-100">
                            {app.label}
                        </span>
                        <Icon size={26} stroke={1.8} />
                        {isOpen && (
                            <span className={`hypr-pulse absolute -bottom-1 h-1.5 w-1.5 rounded-full ${isActive ? "bg-cyan-200" : "bg-slate-300"}`} />
                        )}
                    </motion.button>
                );
            })}
            </div>
        </motion.div>
    );
}
