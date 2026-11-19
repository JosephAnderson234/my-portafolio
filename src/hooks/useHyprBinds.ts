"use client";

import { useEffect } from "react";
import { DOCK_APPS } from "src/config/apps";
import { useHyprConfig } from "src/context/HyprConfigContext";
import { useWindowManager } from "src/context/WindowManagerContext";

/**
 * Atajos estilo Hyprland. Se usa Alt como modificador porque el navegador
 * no recibe la tecla Super. Se ignora Ctrl+Alt (AltGr en teclados en español).
 */
export function useHyprBinds() {
    const { open, closeActive, cycleFocus } = useWindowManager();
    const { config, setOption } = useHyprConfig();
    const layout = config["general:layout"];

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!e.altKey || e.ctrlKey || e.metaKey) return;

            let handled = true;
            if (e.code === "Enter") open("terminal");
            else if (e.code === "KeyQ") closeActive();
            else if (e.code === "KeyJ") cycleFocus(1);
            else if (e.code === "KeyK") cycleFocus(-1);
            else if (e.code === "KeyS") open("settings");
            else if (e.code === "KeyV") setOption("general:layout", layout === "dwindle" ? "floating" : "dwindle");
            else if (/^Digit[1-9]$/.test(e.code)) {
                const app = DOCK_APPS[Number(e.code.slice(5)) - 1];
                if (app) open(app);
                else handled = false;
            } else handled = false;

            if (handled) e.preventDefault();
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, closeActive, cycleFocus, setOption, layout]);
}
