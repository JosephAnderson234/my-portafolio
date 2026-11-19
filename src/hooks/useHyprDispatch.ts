"use client";

import { useCallback } from "react";
import { validateDispatch } from "src/config/hypr";
import { useWindowManager, WindowType } from "src/context/WindowManagerContext";

/** Ventana visible más cercana en la dirección indicada, usando su geometría real. */
function findInDirection(from: WindowType | null, dir: string): WindowType | null {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.hypr-window[data-visible="true"]'));
    const current = nodes.find((n) => n.dataset.wid === from);
    if (!current) return (nodes[0]?.dataset.wid as WindowType) ?? null;

    const a = current.getBoundingClientRect();
    const ax = a.left + a.width / 2;
    const ay = a.top + a.height / 2;
    let best: { id: WindowType; score: number } | null = null;

    for (const node of nodes) {
        if (node === current) continue;
        const b = node.getBoundingClientRect();
        const dx = b.left + b.width / 2 - ax;
        const dy = b.top + b.height / 2 - ay;
        const ok = (dir === "l" && dx < -1) || (dir === "r" && dx > 1) || (dir === "u" && dy < -1) || (dir === "d" && dy > 1);
        if (!ok) continue;
        // Priorizar el eje principal y penalizar el desvío lateral
        const primary = dir === "l" || dir === "r" ? Math.abs(dx) : Math.abs(dy);
        const lateral = dir === "l" || dir === "r" ? Math.abs(dy) : Math.abs(dx);
        const score = primary + lateral * 2;
        if (!best || score < best.score) best = { id: node.dataset.wid as WindowType, score };
    }
    return best?.id ?? null;
}

/**
 * Ejecuta un dispatcher de Hyprland. Devuelve un mensaje de error o null.
 * Lo comparten los binds de teclado y `hyprctl dispatch`.
 */
export function useHyprDispatch() {
    const wm = useWindowManager();
    const { open, killActive, switchWorkspace, moveToWorkspace, toggleSpecial, toggleFloating, toggleFullscreen, focus, setLauncherOpen, focused, launcherOpen } = wm;

    return useCallback(
        (dispatcher: string, arg = ""): string | null => {
            const error = validateDispatch(dispatcher, arg);
            if (error) return error;
            const a = arg.trim();

            switch (dispatcher) {
                case "exec":
                    if (a === "launcher") setLauncherOpen(!launcherOpen);
                    else open(a as WindowType);
                    break;
                case "killactive":
                    killActive();
                    break;
                case "togglefloating":
                    toggleFloating();
                    break;
                case "fullscreen":
                    toggleFullscreen();
                    break;
                case "workspace":
                    switchWorkspace(a);
                    break;
                case "movetoworkspace":
                case "movetoworkspacesilent":
                    moveToWorkspace(a, dispatcher === "movetoworkspacesilent");
                    break;
                case "movefocus": {
                    const target = findInDirection(focused, a);
                    if (target) focus(target);
                    break;
                }
                case "togglespecialworkspace":
                    toggleSpecial();
                    break;
            }
            return null;
        },
        [open, killActive, switchWorkspace, moveToWorkspace, toggleSpecial, toggleFloating, toggleFullscreen, focus, setLauncherOpen, focused, launcherOpen]
    );
}
