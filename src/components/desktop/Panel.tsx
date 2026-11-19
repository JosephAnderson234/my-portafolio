"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    IconAdjustmentsHorizontal,
    IconClock,
    IconLayoutBoardSplit,
    IconStack2,
    IconX,
} from "@tabler/icons-react";
import { APP_META } from "src/config/apps";
import { useWindowManager } from "src/context/WindowManagerContext";
import { useHyprConfig } from "src/context/HyprConfigContext";
import siteData from "src/data/site.json";

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
    const { windows, focus, close, open } = useWindowManager();
    const { config, setOption } = useHyprConfig();
    const layout = config["general:layout"];
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
    const LayoutIcon = layout === "dwindle" ? IconLayoutBoardSplit : IconStack2;

    return (
        <motion.header
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="hypr-panel absolute top-0 z-50 flex h-11 w-full items-center justify-between gap-2 px-2 text-xs sm:px-3"
        >
            <nav aria-label="Ventanas abiertas" className="hypr-no-scrollbar flex min-w-0 items-center gap-1.5 overflow-x-auto">
                {windows.map((w) => {
                    const { Icon, label } = APP_META[w.id];

                    return (
                        <div
                            key={w.id}
                            className={`flex shrink-0 items-center rounded-md border transition-colors ${
                                w.isActive
                                    ? "hypr-active-outline bg-white/10 text-slate-50"
                                    : "border-white/10 text-slate-300 hover:border-white/25 hover:text-slate-50"
                            }`}
                        >
                            <button
                                onClick={() => focus(w.id)}
                                className="flex h-8 cursor-pointer items-center gap-1.5 rounded-l-md px-2.5"
                                title={label}
                                aria-label={`Enfocar ${label}`}
                                aria-current={w.isActive ? "true" : undefined}
                            >
                                <Icon size={14} stroke={1.9} />
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                            <button
                                onClick={() => close(w.id)}
                                className="flex h-8 w-7 cursor-pointer items-center justify-center rounded-r-md border-l border-white/10 transition-colors hover:bg-white/8"
                                title={`Cerrar ${label}`}
                                aria-label={`Cerrar ${label}`}
                            >
                                <IconX size={12} stroke={2.2} />
                            </button>
                        </div>
                    );
                })}
            </nav>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2" style={{ fontFamily: "var(--font-mono)" }}>
                <button
                    onClick={() => setOption("general:layout", layout === "dwindle" ? "floating" : "dwindle")}
                    className="hidden h-8 cursor-pointer items-center gap-1.5 rounded-md border border-white/10 bg-slate-950/40 px-2 text-slate-200 transition-colors hover:border-white/25 sm:flex"
                    title="Alternar layout (Alt+V)"
                    aria-label={`Layout actual: ${layout}. Cambiar layout`}
                >
                    <LayoutIcon size={14} stroke={1.9} style={{ color: "var(--hypr-accent-solid)" }} />
                    {layout}
                </button>
                <button
                    onClick={() => open("settings")}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-slate-950/40 text-slate-200 transition-colors hover:border-white/25"
                    title="hyprland.conf (Alt+S)"
                    aria-label="Abrir configuración hyprland.conf"
                >
                    <IconAdjustmentsHorizontal size={15} stroke={1.9} />
                </button>
                {clockLabel && (
                    <span className="hidden h-8 items-center gap-1.5 rounded-md border border-white/10 bg-slate-950/40 px-2 text-slate-200 md:flex">
                        <IconClock size={13} stroke={1.9} style={{ color: "var(--hypr-accent-solid)" }} />
                        <time dateTime={now?.toISOString()}>{clockLabel}</time>
                    </span>
                )}
                <span className="hidden text-slate-200 lg:inline">{userHost}</span>
            </div>
        </motion.header>
    );
}
