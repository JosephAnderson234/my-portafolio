"use client";

import { motion } from "framer-motion";
import { APP_META, DOCK_APPS } from "src/config/apps";
import { useWindowManager } from "src/context/WindowManagerContext";

export default function Dock() {
    const { open, windows } = useWindowManager();

    return (
        <motion.nav
            aria-label="Dock de aplicaciones"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
            className="hypr-dock absolute bottom-3 left-1/2 z-40 -translate-x-1/2 px-2 py-1.5 sm:bottom-4 sm:px-3 sm:py-2"
        >
            <ul className="flex gap-1 sm:gap-2.5">
                {DOCK_APPS.map((id, i) => {
                    const { Icon, label } = APP_META[id];
                    const state = windows.find((w) => w.id === id);
                    const isActive = state?.isActive ?? false;

                    return (
                        <li key={id}>
                            <motion.button
                                onClick={() => open(id)}
                                whileHover={{ y: -4, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 340, damping: 20 }}
                                className={`group relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-[calc(var(--hypr-rounding)*0.8)] border transition-colors sm:h-14 sm:w-14 ${
                                    isActive
                                        ? "hypr-active-outline bg-white/10 text-slate-50"
                                        : "border-white/10 bg-slate-900/40 text-slate-300 hover:border-white/25 hover:text-slate-50"
                                }`}
                                aria-label={`${label} (Alt+${i + 1})`}
                                aria-pressed={isActive}
                            >
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-slate-950/95 px-2 py-1 text-xs text-slate-100 opacity-0 shadow-lg transition-all duration-150 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
                                >
                                    {label}
                                    <span className="ml-1.5 text-slate-400">Alt+{i + 1}</span>
                                </span>
                                <Icon size={24} stroke={1.8} />
                                {state && (
                                    <span
                                        aria-hidden
                                        className={`absolute -bottom-0.5 h-1 rounded-full transition-all ${
                                            isActive ? "hypr-pulse w-3" : "w-1 bg-slate-400"
                                        }`}
                                        style={isActive ? { background: "var(--hypr-accent-solid)" } : undefined}
                                    />
                                )}
                            </motion.button>
                        </li>
                    );
                })}
            </ul>
        </motion.nav>
    );
}
