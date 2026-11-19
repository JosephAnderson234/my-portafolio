"use client";

import { motion, type TargetAndTransition } from "framer-motion";
import { Rnd } from "react-rnd";
import { CSSProperties, ReactNode, createContext, useContext, useRef } from "react";
import { IconX } from "@tabler/icons-react";
import { isVisible, useWindowManager, WindowState, WindowType } from "src/context/WindowManagerContext";
import { useHyprConfig, WindowsStyle, WorkspacesStyle } from "src/context/HyprConfigContext";
import { PANEL_HEIGHT, num, str } from "src/config/hypr";
import { MOBILE_BREAKPOINT, useViewport } from "src/hooks/useViewport";
import { computeDwindle, computeMaster, Rect } from "src/libs/dwindle";

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

/** Posición de la capa de un workspace oculto según animations:workspaces_style. */
function hiddenTransform(style: WorkspacesStyle, direction: number, special: boolean): string {
    if (special) return "translateY(-100%)";
    if (style === "fade") return "none";
    return style === "slidevert" ? `translateY(${direction * 100}%)` : `translateX(${direction * 100}%)`;
}

function WindowChrome({
    id,
    title,
    children,
    isActive,
    visible,
    onClose,
    onFocus,
    draggable,
}: {
    id: WindowType | null;
    title: string;
    children: ReactNode;
    isActive: boolean;
    visible: boolean;
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
            data-visible={visible}
            data-wid={id ?? undefined}
            aria-label={title}
            onMouseDownCapture={onFocus}
            className="hypr-window flex h-full flex-col overflow-hidden"
        >
            <header
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
                    title={`Cerrar ${title}`}
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
    const wm = useWindowManager();
    const { config, motion: m } = useHyprConfig();
    const viewport = useViewport();
    const lastRect = useRef<Rect | null>(null);
    const lastSelf = useRef<WindowState | null>(null);

    const cascadeIndexRef = useRef<number | null>(null);
    if (cascadeIndexRef.current === null) {
        cascadeIndexRef.current = Math.max(wm.windows.length - 1, 0) % CASCADE_MAX;
    }

    // Durante la animación de cierre la ventana ya no está en la lista: usar su último estado
    const found = wm.windows.find((w) => w.id === id);
    if (found) lastSelf.current = found;
    const self = found ?? lastSelf.current;

    if (!viewport || !self) return null;

    const visible = isVisible(self, wm);
    const special = self.workspace === "special";
    const chrome = (draggable: boolean) => (
        <WindowChrome
            id={id}
            title={title}
            isActive={isActive}
            visible={visible}
            onClose={onClose}
            onFocus={onFocus}
            draggable={draggable}
        >
            {children}
        </WindowChrome>
    );

    // Móvil: solo la ventana enfocada del workspace visible. Las demás se ocultan
    // sin desmontarse, para no perder su estado (p. ej. el historial de la terminal).
    if (viewport.w < MOBILE_BREAKPOINT) {
        const shown = visible && isActive;
        return (
            <div
                className={`absolute inset-x-2 bottom-2 ${shown ? "" : "hidden"}`}
                style={{ top: PANEL_HEIGHT + 8, zIndex: special ? 40 : 30 }}
                inert={!shown}
            >
                {chrome(false)}
            </div>
        );
    }

    // Capa del workspace: se desliza fuera de la pantalla cuando no está visible
    const direction = special ? -1 : Math.sign((self.workspace as number) - wm.activeWorkspace) || 1;
    const layerStyle: CSSProperties = {
        transform: visible ? "none" : hiddenTransform(m.workspaces, direction, special),
        opacity: visible || (m.workspaces !== "fade" && !special) ? 1 : 0,
        zIndex: self.fullscreen ? 60 : special ? 40 : self.floating ? (isActive ? 26 : 25) : isActive ? 21 : 20,
    };
    const opacity = num(config, isActive ? "decoration:active_opacity" : "decoration:inactive_opacity");
    const gapsOut = num(config, "general:gaps_out");
    const area: Rect = {
        x: gapsOut,
        y: PANEL_HEIGHT + gapsOut,
        w: viewport.w - gapsOut * 2,
        h: viewport.h - PANEL_HEIGHT - gapsOut * 2,
    };

    let content: ReactNode;

    if (self.fullscreen) {
        content = (
            <Rnd
                key="fullscreen"
                position={{ x: 0, y: 0 }}
                size={{ width: viewport.w, height: viewport.h }}
                disableDragging
                enableResizing={false}
                className="hypr-frame hypr-tiled hypr-fullscreen"
                style={{ opacity }}
            >
                {chrome(false)}
            </Rnd>
        );
    } else if (!self.floating) {
        // Tiling: dwindle o master entre las ventanas no flotantes del mismo workspace
        const tiled = wm.windows.filter((w) => w.workspace === self.workspace && !w.floating);
        const index = tiled.findIndex((w) => w.id === id);
        const gap = num(config, "general:gaps_in") * 2;
        if (index >= 0) {
            const rects =
                str(config, "general:layout") === "master"
                    ? computeMaster(tiled.length, area, gap, num(config, "master:mfact"))
                    : computeDwindle(tiled.length, area, gap, num(config, "dwindle:default_split_ratio"));
            lastRect.current = rects[index];
        }
        const rect = lastRect.current ?? area;

        content = (
            <Rnd
                key="tiled"
                position={{ x: rect.x, y: rect.y }}
                size={{ width: rect.w, height: rect.h }}
                disableDragging
                enableResizing={false}
                className="hypr-frame hypr-tiled"
                style={{ opacity }}
            >
                {chrome(false)}
            </Rnd>
        );
    } else {
        // Flotante: arrastrable desde la barra de título y redimensionable
        const cascadeIndex = cascadeIndexRef.current;
        const width = Math.min(defaultSize.width, area.w);
        const height = Math.min(defaultSize.height, area.h);
        content = (
            <Rnd
                key="floating"
                default={{
                    width,
                    height,
                    x: Math.min(defaultSize.x + cascadeIndex * CASCADE_STEP_X, viewport.w - width - gapsOut),
                    y: Math.min(Math.max(defaultSize.y, area.y) + cascadeIndex * CASCADE_STEP_Y, viewport.h - height - gapsOut),
                }}
                bounds="parent"
                dragHandleClassName="hypr-titlebar"
                cancel=".hypr-nodrag"
                className="hypr-frame"
                style={{ opacity }}
                minWidth={360}
                minHeight={220}
            >
                {chrome(true)}
            </Rnd>
        );
    }

    return (
        <div className="hypr-ws-layer" data-visible={visible} style={layerStyle} inert={!visible}>
            {content}
        </div>
    );
}
