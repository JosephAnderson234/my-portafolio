"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
    BEZIERS,
    Bind,
    DEFAULT_BINDS,
    DEFAULT_CONFIG,
    HyprConfig,
    HyprValue,
    OPTIONS,
    PRESETS,
    bool,
    num,
    parseBind,
    str,
    toCssVars,
} from "src/config/hypr";

const STORAGE_KEY = "hypr-config-v2";

export type WindowsStyle = "popin" | "slide" | "fade";
export type WorkspacesStyle = "slide" | "slidevert" | "fade";

type HyprConfigContextType = {
    config: HyprConfig;
    binds: Bind[];
    setOption: (key: string, value: HyprValue) => void;
    setMany: (updates: HyprConfig) => void;
    setBinds: (binds: Bind[]) => void;
    applyPreset: (id: string) => void;
    reset: () => void;
    mainMod: string;
    motion: {
        enabled: boolean;
        duration: number; // segundos
        ease: [number, number, number, number];
        style: WindowsStyle;
        workspaces: WorkspacesStyle;
    };
};

const HyprConfigContext = createContext<HyprConfigContextType | null>(null);

function sanitizeOptions(raw: unknown): HyprConfig {
    const out: HyprConfig = { ...DEFAULT_CONFIG };
    if (!raw || typeof raw !== "object") return out;
    for (const def of OPTIONS) {
        const v = (raw as Record<string, unknown>)[def.key];
        if (typeof v !== typeof def.default) continue;
        if (def.type === "enum" && !def.values.includes(v as string)) continue;
        out[def.key] = v as HyprValue;
    }
    return out;
}

function sanitizeBinds(raw: unknown): Bind[] {
    if (!Array.isArray(raw)) return DEFAULT_BINDS;
    const binds = raw
        .map((b) => (b && typeof b === "object" ? parseBind(`${b.mods ?? ""}, ${b.key ?? ""}, ${b.dispatcher ?? ""}, ${b.arg ?? ""}`) : null))
        .flatMap((r) => (r && r.ok ? [{ ...r.bind }] : []));
    return binds.length ? binds : DEFAULT_BINDS;
}

export function HyprConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<HyprConfig>(DEFAULT_CONFIG);
    const [binds, setBinds] = useState<Bind[]>(DEFAULT_BINDS);
    const loaded = useRef(false);

    // Guardar + aplicar variables CSS (declarado antes de la carga a propósito,
    // para no sobrescribir lo guardado con los valores por defecto).
    useEffect(() => {
        const root = document.documentElement;
        for (const [k, v] of Object.entries(toCssVars(config))) root.style.setProperty(k, v);
        if (!loaded.current) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ options: config, binds }));
        } catch {
            /* almacenamiento no disponible */
        }
    }, [config, binds]);

    useEffect(() => {
        loaded.current = true;
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                setConfig(sanitizeOptions(data?.options));
                setBinds(sanitizeBinds(data?.binds));
                return;
            }
        } catch {
            /* ignorar datos corruptos */
        }
        // Sin config guardada: respetar prefers-reduced-motion
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setConfig((c) => ({ ...c, "animations:enabled": false }));
        }
    }, []);

    const setOption = useCallback((key: string, value: HyprValue) => {
        setConfig((c) => ({ ...c, [key]: value }));
    }, []);

    const setMany = useCallback((updates: HyprConfig) => {
        setConfig((c) => ({ ...c, ...updates }));
    }, []);

    const applyPreset = useCallback((id: string) => {
        const preset = PRESETS.find((p) => p.id === id);
        if (!preset) return;
        // Los presets solo cambian lo visual; layout y tecla maestra se mantienen
        setConfig((c) => ({
            ...DEFAULT_CONFIG,
            "general:layout": c["general:layout"],
            $mainMod: c.$mainMod,
            ...preset.values,
        }));
    }, []);

    const reset = useCallback(() => {
        setConfig(DEFAULT_CONFIG);
        setBinds(DEFAULT_BINDS);
    }, []);

    const motion = useMemo(() => {
        const enabled = bool(config, "animations:enabled");
        return {
            enabled,
            duration: enabled ? num(config, "animations:speed") / 10 : 0,
            ease: BEZIERS[str(config, "animations:bezier")] ?? BEZIERS.easeOutQuint,
            style: str(config, "animations:windows_style") as WindowsStyle,
            workspaces: str(config, "animations:workspaces_style") as WorkspacesStyle,
        };
    }, [config]);

    const mainMod = str(config, "$mainMod");

    const value = useMemo(
        () => ({ config, binds, setOption, setMany, setBinds, applyPreset, reset, mainMod, motion }),
        [config, binds, setOption, setMany, applyPreset, reset, mainMod, motion]
    );

    return <HyprConfigContext.Provider value={value}>{children}</HyprConfigContext.Provider>;
}

export function useHyprConfig() {
    const ctx = useContext(HyprConfigContext);
    if (!ctx) throw new Error("useHyprConfig must be used inside HyprConfigProvider");
    return ctx;
}

/** Nombre legible de la tecla maestra para la UI ("Alt" / "Super"). */
export const modLabel = (mainMod: string) => (mainMod === "SUPER" ? "Super" : "Alt");
