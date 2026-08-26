"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    IconBriefcase,
    IconClock,
    IconFolderCode,
    IconLayoutGrid,
    IconSchool,
    IconTerminal2,
    IconTool,
    IconUserCircle,
    IconUsers,
    IconX,
} from "@tabler/icons-react";
import { useWindowManager, WindowType } from "src/context/WindowManagerContext";
import siteData from "src/data/site.json";

const appMeta: Record<WindowType, { label: string; Icon: React.ComponentType<{ size?: number; stroke?: number }> }> = {
    terminal: { label: "Terminal", Icon: IconTerminal2 },
    about: { label: "About Me", Icon: IconUserCircle },
    projects: { label: "Projects", Icon: IconFolderCode },
    experience: { label: "Experience", Icon: IconBriefcase },
    education: { label: "Education", Icon: IconSchool },
    leadership: { label: "Leadership", Icon: IconUsers },
    skills: { label: "Skills", Icon: IconTool },
};

function useClock() {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date());
        const id = setInterval(() => setNow(new Date()), 1000 * 30);
        return () => clearInterval(id);
    }, []);

    return now;
}

export default function Panel() {
    const { windows, focus, close } = useWindowManager();
    const userHost = `${siteData.panelUser}@${siteData.panelHost}`;
    const now = useClock();
    const clockLabel = now
        ? now.toLocaleString("es-PE", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "";

    return (
        <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="hypr-panel absolute top-0 z-50 flex h-11 w-full items-center justify-between px-3 text-xs sm:px-4"
        >
            <div className="flex min-w-0 items-center gap-2">
                {windows.map((w) => {
                    const { Icon, label } = appMeta[w.id];

                    return (
                        <div
                            key={w.id}
                            className={`flex items-center rounded-md border transition-colors ${
                                w.isActive
                                    ? "hypr-active-outline bg-cyan-300/15 text-cyan-100"
                                    : "border-white/10 text-slate-300 hover:border-cyan-100/35 hover:text-white"
                            }`}
                        >
                            <button
                                onClick={() => focus(w.id)}
                                className="flex items-center gap-1.5 px-2.5 py-1"
                                title={label}
                                aria-label={`Focus ${label}`}
                            >
                                <Icon size={14} stroke={1.9} />
                                <span className="hidden capitalize sm:inline">{label}</span>
                            </button>
                            <button
                                onClick={() => close(w.id)}
                                className="rounded-r-md border-l border-white/10 px-1.5 py-1 transition-colors hover:text-cyan-100"
                                title={`Close ${label}`}
                                aria-label={`Close ${label}`}
                            >
                                <IconX size={12} stroke={2.2} />
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center gap-3">
                {clockLabel && (
                    <span className="hidden items-center gap-1.5 rounded-md border border-white/8 bg-slate-950/40 px-2 py-1 text-slate-300 sm:flex">
                        <IconClock size={13} stroke={1.9} className="text-cyan-200" />
                        {clockLabel}
                    </span>
                )}
                <span className="flex items-center gap-1.5 text-slate-200">
                    <IconLayoutGrid size={14} stroke={1.9} className="text-cyan-200" />
                    {userHost}
                </span>
            </div>
        </motion.div>
    );
}
