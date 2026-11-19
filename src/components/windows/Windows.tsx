"use client";

import { motion, type TargetAndTransition } from "framer-motion";
import { Rnd } from "react-rnd";
import { ReactNode, createContext, useContext, useRef } from "react";
import { IconX } from "@tabler/icons-react";
import { useWindowManager, WindowType } from "src/context/WindowManagerContext";
import { useHyprConfig, WindowsStyle } from "src/context/HyprConfigContext";
import { DOCK_RESERVED, PANEL_HEIGHT, num, str } from "src/config/hypr";
import { MOBILE_BREAKPOINT, useViewport } from "src/hooks/useViewport";
import { computeDwindle, Rect } from "src/libs/dwindle";

/** Desktop provee el id de cada ventana para calcular su tile. */
export const WindowIdContext = createContext<WindowType | null>(null);

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

const VARIANTS: Record<WindowsStyle, { initial: TargetAndTransition; exit: TargetAndTransition }> = {
    popin: { initial: { opacity: 0, scale: 0.88 }, exit: { opacity: 0, scale: 0.92 } },
    slide: { initial: { opacity: 0, y: 36 }, exit: { opacity: 0, y: 24 } },
    fade: { initial: { opacity: 0 }, exit: { opacity: 0 } },
};

function WindowChrome({
    title,
    children,
    isActive,
    onClose,
    onFocus,
    draggable,
}: {
    title: string;
    children: ReactNode;
    isActive: boolean;
    onClose: () => void;
    onFocus: () => void;
    draggable: boolean;
}) {
    const { motion: m } = useHyprConfig();
    const variant = VARIANTS[m.style] ?? VARIANTS.popin;

    return (
        <motion.section
            initial={variant.initial}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ ...variant.exit, transition: { duration: m.duration * 0.7, ease: m.ease } }}
            transition={{ duration: m.duration, ease: m.ease }}
            data-active={isActive}
            aria-label={title}
            className="hypr-window flex h-full flex-col overflow-hidden"
        >
            <header
                onMouseDown={onFocus}
                className={`hypr-titlebar flex h-9 shrink-0 items-center justify-between gap-2 border-b pl-3 pr-1.5 select-none ${
                    draggable ? "cursor-move" : ""
                } ${isActive ? "border-white/12 bg-slate-900/60" : "border-white/6 bg-slate-950/40"}`}
            >
                <div className="flex min-w-0 items-center gap-2">
                    <span
                        aria-hidden
                        className="h-2 w-2 shrink-0 rounded-full transition-colors"
                        style={{ background: isActive ? "var(--hypr-accent-solid)" : "rgb(71 85 105)" }}
                    />
                    <h2
                        className={`truncate text-sm tracking-wide ${isActive ? "text-slate-50" : "text-slate-300"}`}
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        {title}
                    </h2>
                </div>

                <button
                    onClick={onClose}
                    className="hypr-nodrag flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/8 hover:text-slate-50"
                    title={`Cerrar ${title} (Alt+Q)`}
                    aria-label={`Cerrar ${title}`}
                >
                    <IconX size={15} stroke={2.2} />
                </button>
            </header>

            <div
                className="flex-1 overflow-auto p-3 text-sm text-slate-100"
                style={{ fontFamily: "var(--font-mono)" }}
            >
                {children}
            </div>
        </motion.section>
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
    const id = useContext(WindowIdContext);
    const { windows } = useWindowManager();
    const { config } = useHyprConfig();
    const viewport = useViewport();
    const lastRect = useRef<Rect | null>(null);

    const cascadeIndexRef = useRef<number | null>(null);
    if (cascadeIndexRef.current === null) {
        cascadeIndexRef.current = Math.max(windows.length - 1, 0) % CASCADE_MAX;
    }

    if (!viewport) return null;

    const opacity = num(config, isActive ? "decoration:active_opacity" : "decoration:inactive_opacity");
    const zIndex = isActive ? 30 : 20;
    const chrome = (draggable: boolean) => (
        <WindowChrome title={title} isActive={isActive} onClose={onClose} onFocus={onFocus} draggable={draggable}>
            {children}
        </WindowChrome>
    );

    // Móvil: una ventana a la vez, a pantalla casi completa
    if (viewport.w < MOBILE_BREAKPOINT) {
        if (!isActive) return null;
        return (
            <div className="absolute inset-x-2 bottom-24 z-30" style={{ top: PANEL_HEIGHT + 8 }}>
                {chrome(false)}
            </div>
        );
    }

    // Tiling dwindle
    if (str(config, "general:layout") === "dwindle") {
        const gapsOut = num(config, "general:gaps_out");
        const gapsIn = num(config, "general:gaps_in");
        const area: Rect = {
            x: gapsOut,
            y: PANEL_HEIGHT + gapsOut,
            w: viewport.w - gapsOut * 2,
            h: viewport.h - PANEL_HEIGHT - DOCK_RESERVED - gapsOut,
        };
        const index = windows.findIndex((w) => w.id === id);
        // Durante la animación de cierre la ventana ya no está en la lista: conservar su último tile
        if (index >= 0) lastRect.current = computeDwindle(windows.length, area, gapsIn * 2)[index];
        const rect = lastRect.current ?? area;

        return (
            <Rnd
                key="tiled"
                position={{ x: rect.x, y: rect.y }}
                size={{ width: rect.w, height: rect.h }}
                disableDragging
                enableResizing={false}
                onMouseDown={onFocus}
                className="hypr-frame hypr-tiled"
                style={{ zIndex, opacity }}
            >
                {chrome(false)}
            </Rnd>
        );
    }

    // Floating
    const cascadeIndex = cascadeIndexRef.current;
    return (
        <Rnd
            key="floating"
            default={{
                ...defaultSize,
                x: defaultSize.x + cascadeIndex * CASCADE_STEP_X,
                y: Math.max(defaultSize.y, PANEL_HEIGHT + 12) + cascadeIndex * CASCADE_STEP_Y,
            }}
            bounds="window"
            dragHandleClassName="hypr-titlebar"
            cancel=".hypr-nodrag"
            onMouseDown={onFocus}
            className="hypr-frame"
            style={{ zIndex, opacity }}
            minWidth={360}
            minHeight={220}
        >
            {chrome(true)}
        </Rnd>
    );
}
