"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
    BEZIERS,
    DEFAULT_CONFIG,
    HyprConfig,
    HyprValue,
    OPTIONS,
    PRESETS,
    bool,
    num,
    str,
    toCssVars,
} from "src/config/hypr";

const STORAGE_KEY = "hypr-config-v1";

export type WindowsStyle = "popin" | "slide" | "fade";

type HyprConfigContextType = {
    config: HyprConfig;
    setOption: (key: string, value: HyprValue) => void;
    setMany: (updates: HyprConfig) => void;
    applyPreset: (id: string) => void;
    reset: () => void;
    motion: {
        enabled: boolean;
        duration: number; // segundos
        ease: [number, number, number, number];
        style: WindowsStyle;
    };
};

const HyprConfigContext = createContext<HyprConfigContextType | null>(null);

function sanitize(raw: unknown): HyprConfig {
    const out: HyprConfig = { ...DEFAULT_CONFIG };
    if (!raw || typeof raw !== "object") return out;
    for (const def of OPTIONS) {
        const v = (raw as Record<string, unknown>)[def.key];
        if (typeof v === typeof def.default) out[def.key] = v as HyprValue;
    }
    return out;
}

export function HyprConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<HyprConfig>(DEFAULT_CONFIG);
    const loaded = useRef(false);

    // Guardar + aplicar variables CSS (declarado antes de la carga a propósito,
    // para no sobrescribir lo guardado con los valores por defecto).
    useEffect(() => {
        const root = document.documentElement;
        for (const [k, v] of Object.entries(toCssVars(config))) root.style.setProperty(k, v);
        if (!loaded.current) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        } catch {
            /* almacenamiento no disponible */
        }
    }, [config]);

    useEffect(() => {
        loaded.current = true;
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setConfig(sanitize(JSON.parse(stored)));
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
        // Los presets solo cambian lo visual; el layout elegido se mantiene
        setConfig((c) => ({ ...DEFAULT_CONFIG, "general:layout": c["general:layout"], ...preset.values }));
    }, []);

    const reset = useCallback(() => setConfig(DEFAULT_CONFIG), []);

    const motion = useMemo(() => {
        const enabled = bool(config, "animations:enabled");
        return {
            enabled,
            duration: enabled ? num(config, "animations:speed") / 10 : 0,
            ease: BEZIERS[str(config, "animations:bezier")] ?? BEZIERS.easeOutQuint,
            style: str(config, "animations:windows_style") as WindowsStyle,
        };
    }, [config]);

    const value = useMemo(
        () => ({ config, setOption, setMany, applyPreset, reset, motion }),
        [config, setOption, setMany, applyPreset, reset, motion]
    );

    return <HyprConfigContext.Provider value={value}>{children}</HyprConfigContext.Provider>;
}

export function useHyprConfig() {
    const ctx = useContext(HyprConfigContext);
    if (!ctx) throw new Error("useHyprConfig must be used inside HyprConfigProvider");
    return ctx;
}
