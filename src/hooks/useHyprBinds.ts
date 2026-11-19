"use client";

import { useEffect, useMemo } from "react";
import { keyToCode, resolveMods } from "src/config/hypr";
import { useHyprConfig } from "src/context/HyprConfigContext";
import { useHyprDispatch } from "./useHyprDispatch";

type CompiledBind = { code: string; mods: Set<string>; dispatcher: string; arg: string };

const sameMods = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every((m) => b.has(m));

function eventMods(e: KeyboardEvent | WheelEvent) {
    const mods = new Set<string>();
    if (e.altKey) mods.add("ALT");
    if (e.metaKey) mods.add("SUPER");
    if (e.ctrlKey) mods.add("CTRL");
    if (e.shiftKey) mods.add("SHIFT");
    return mods;
}

/**
 * Escucha los `bind = …` de la config y ejecuta su dispatcher.
 * Ctrl+Alt (AltGr en teclados en español) no coincide con binds de solo $mainMod.
 */
export function useHyprBinds() {
    const { binds, mainMod } = useHyprConfig();
    const dispatch = useHyprDispatch();

    const compiled = useMemo<CompiledBind[]>(
        () =>
            binds.flatMap((b) => {
                const code = keyToCode(b.key);
                return code ? [{ code, mods: resolveMods(b.mods, mainMod), dispatcher: b.dispatcher, arg: b.arg }] : [];
            }),
        [binds, mainMod]
    );

    useEffect(() => {
        const run = (code: string, e: KeyboardEvent | WheelEvent) => {
            const mods = eventMods(e);
            if (mods.size === 0) return false; // sin modificador no se roban teclas al contenido
            const bind = compiled.find((b) => b.code === code && sameMods(b.mods, mods));
            if (!bind) return false;
            e.preventDefault();
            dispatch(bind.dispatcher, bind.arg);
            return true;
        };

        const onKey = (e: KeyboardEvent) => {
            if (e.repeat && e.code.startsWith("Digit")) return;
            run(e.code, e);
        };

        let lastWheel = 0;
        const onWheel = (e: WheelEvent) => {
            if (!e.altKey && !e.metaKey) return;
            const now = performance.now();
            if (now - lastWheel < 180) {
                e.preventDefault();
                return;
            }
            if (run(e.deltaY > 0 ? "WheelDown" : "WheelUp", e)) lastWheel = now;
        };

        window.addEventListener("keydown", onKey);
        window.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("wheel", onWheel);
        };
    }, [compiled, dispatch]);
}
