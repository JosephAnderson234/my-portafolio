"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    IconAdjustmentsHorizontal,
    IconApps,
    IconClock,
    IconLayoutBoardSplit,
    IconLayoutSidebar,
    IconSparkles,
} from "@tabler/icons-react";
import { APP_META } from "src/config/apps";
import { WORKSPACE_COUNT } from "src/config/hypr";
import { useWindowManager } from "src/context/WindowManagerContext";
import { modLabel, useHyprConfig } from "src/context/HyprConfigContext";
import siteData from "src/data/site.json";

/** Workspaces que siempre se muestran, como persistent-workspaces en waybar. */
const PERSISTENT = 5;

function useClock() {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date());
        const id = setInterval(() => setNow(new Date()), 1000 * 30);
        return () => clearInterval(id);
    }, []);

    return now;
}

const chip =
    "flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-white/10 bg-slate-950/40 px-2 text-slate-200 transition-colors hover:border-white/25";

export default function Panel() {
    const wm = useWindowManager();
    const { windows, activeWorkspace, specialOpen, focused, switchWorkspace, toggleSpecial, setLauncherOpen, launcherOpen, open } = wm;
    const { config, setOption, mainMod } = useHyprConfig();
    const layout = String(config["general:layout"]);
    const mod = modLabel(mainMod);
    const now = useClock();
    const clockLabel = now
        ? now.toLocaleString("es-PE", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
        : "";

    const occupied = new Set(windows.map((w) => w.workspace));
    const highest = Math.max(PERSISTENT, activeWorkspace, ...[...occupied].filter((w): w is number => typeof w === "number"));
    const workspaces = Array.from({ length: Math.min(highest, WORKSPACE_COUNT) }, (_, i) => i + 1);
    const specialCount = windows.filter((w) => w.workspace === "special").length;
    const focusedWin = windows.find((w) => w.id === focused);
    const LayoutIcon = layout === "master" ? IconLayoutSidebar : IconLayoutBoardSplit;

    return (
        <motion.header
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="hypr-panel absolute top-0 z-50 grid h-11 w-full grid-cols-[1fr_auto] items-center gap-2 px-2 text-xs sm:grid-cols-[1fr_minmax(0,auto)_1fr] sm:px-3"
            style={{ fontFamily: "var(--font-mono)" }}
        >
            {/* Izquierda: lanzador + workspaces */}
            <div className="flex min-w-0 items-center gap-1.5">
                <button
                    onClick={() => setLauncherOpen(!launcherOpen)}
                    className={chip}
                    title={`Aplicaciones (${mod}+R)`}
                    aria-label="Abrir el lanzador de aplicaciones"
                    aria-expanded={launcherOpen}
                >
                    <IconApps size={15} stroke={1.9} style={{ color: "var(--hypr-accent-solid)" }} />
                    <span className="hidden md:inline">apps</span>
                </button>

                <nav aria-label="Workspaces" className="hypr-no-scrollbar flex min-w-0 items-center gap-0.5 overflow-x-auto rounded-md border border-white/10 bg-slate-950/40 p-0.5">
                    {workspaces.map((ws) => {
                        const active = ws === activeWorkspace && !specialOpen;
                        const hasWindows = occupied.has(ws);
                        return (
                            <button
                                key={ws}
                                onClick={() => switchWorkspace(ws)}
                                aria-label={`Workspace ${ws}${hasWindows ? ", con ventanas" : ""}`}
                                aria-current={active ? "true" : undefined}
                                title={`Workspace ${ws} (${mod}+${ws % 10})`}
                                className={`relative flex h-7 min-w-7 cursor-pointer items-center justify-center rounded px-1.5 transition-colors ${
                                    active ? "text-slate-950" : hasWindows ? "text-slate-100 hover:bg-white/10" : "text-slate-400 hover:bg-white/10"
                                }`}
                                style={active ? { background: "var(--hypr-accent-solid)" } : undefined}
                            >
                                {ws}
                                {hasWindows && !active && (
                                    <span aria-hidden className="absolute bottom-0.5 h-0.5 w-2.5 rounded-full bg-slate-300" />
                                )}
                            </button>
                        );
                    })}
                    {(specialCount > 0 || specialOpen) && (
                        <button
                            onClick={toggleSpecial}
                            aria-label={`Scratchpad, ${specialCount} ventanas`}
                            aria-pressed={specialOpen}
                            title={`Scratchpad (${mod}+S)`}
                            className={`flex h-7 cursor-pointer items-center gap-1 rounded px-1.5 transition-colors ${
                                specialOpen ? "text-slate-950" : "text-slate-200 hover:bg-white/10"
                            }`}
                            style={specialOpen ? { background: "var(--hypr-accent-solid)" } : undefined}
                        >
                            <IconSparkles size={13} stroke={2} />
                            {specialCount}
                        </button>
                    )}
                </nav>
            </div>

            {/* Centro: ventana activa (módulo hyprland/window) */}
            <p className="hidden min-w-0 truncate text-center text-slate-200 sm:block" aria-live="polite">
                {focusedWin ? APP_META[focusedWin.id].label : ""}
                {focusedWin?.floating && <span className="ml-1.5 text-slate-400">[float]</span>}
                {focusedWin?.fullscreen && <span className="ml-1.5 text-slate-400">[full]</span>}
            </p>

            {/* Derecha */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                <button
                    onClick={() => setOption("general:layout", layout === "dwindle" ? "master" : "dwindle")}
                    className={`${chip} hidden sm:flex`}
                    title="Cambiar layout (general:layout)"
                    aria-label={`Layout actual: ${layout}. Cambiar layout`}
                >
                    <LayoutIcon size={14} stroke={1.9} style={{ color: "var(--hypr-accent-solid)" }} />
                    {layout}
                </button>
                <button
                    onClick={() => open("settings")}
                    className={`${chip} w-8 justify-center px-0`}
                    title={`hyprland.conf (${mod}+,)`}
                    aria-label="Abrir configuración hyprland.conf"
                >
                    <IconAdjustmentsHorizontal size={15} stroke={1.9} />
                </button>
                {clockLabel && (
                    <span className={`${chip} hidden cursor-default md:flex`}>
                        <IconClock size={13} stroke={1.9} style={{ color: "var(--hypr-accent-solid)" }} />
                        <time dateTime={now?.toISOString()}>{clockLabel}</time>
                    </span>
                )}
                <span className="hidden text-slate-200 xl:inline">{`${siteData.panelUser}@${siteData.panelHost}`}</span>
            </div>
        </motion.header>
    );
}
