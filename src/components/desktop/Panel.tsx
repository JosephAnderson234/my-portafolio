"use client";

import { motion } from "framer-motion";
import { IconLayoutGrid } from "@tabler/icons-react";
import { useWindowManager } from "src/context/WindowManagerContext";
import siteData from "src/data/site.json";

export default function Panel() {
    const { windows, focus } = useWindowManager();
    const userHost = `${siteData.panelUser}@${siteData.panelHost}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="hypr-panel absolute top-0 z-50 flex h-11 w-full items-center justify-between px-3 text-xs sm:px-4"
        >
            <div className="flex min-w-0 items-center gap-2">
                {windows.map((w) => (
                    <button
                        key={w.id}
                        onClick={() => focus(w.id)}
                        className={`rounded-md border px-2.5 py-1 capitalize transition-colors ${
                            w.isActive
                                ? "hypr-active-outline bg-cyan-300/15 text-cyan-100"
                                : "border-white/10 text-slate-300 hover:border-cyan-100/35 hover:text-white"
                        }`}
                    >
                        {w.id}
                    </button>
                ))}
            </div>

            <span className="flex items-center gap-1.5 text-slate-200">
                <IconLayoutGrid size={14} stroke={1.9} className="text-cyan-200" />
                {userHost}
            </span>
        </motion.div>
    );
}
