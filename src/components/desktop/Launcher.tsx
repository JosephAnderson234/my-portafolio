"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconSearch } from "@tabler/icons-react";
import { APP_META, LAUNCHER_APPS } from "src/config/apps";
import { useWindowManager, WindowType } from "src/context/WindowManagerContext";
import { modLabel, useHyprConfig } from "src/context/HyprConfigContext";

/**
 * Lanzador estilo wofi/rofi (`exec, launcher`). No existe hasta que se invoca:
 * aparece centrado, filtra mientras escribes y ordena por uso reciente.
 */
export default function Launcher() {
    const { launcherOpen, setLauncherOpen, open, recent, windows } = useWindowManager();
    const { motion: m, mainMod } = useHyprConfig();
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const returnFocus = useRef<HTMLElement | null>(null);
    const listId = useId();

    const items = useMemo(() => {
        const ordered: WindowType[] = [...recent.filter((r) => LAUNCHER_APPS.includes(r)), ...LAUNCHER_APPS.filter((a) => !recent.includes(a))];
        const q = query.trim().toLowerCase();
        return ordered.filter((id) => {
            if (!q) return true;
            const meta = APP_META[id];
            return [meta.label, meta.exec, meta.description].some((t) => t.toLowerCase().includes(q));
        });
    }, [recent, query]);

    useEffect(() => {
        if (launcherOpen) {
            returnFocus.current = document.activeElement as HTMLElement | null;
            setQuery("");
            setSelected(0);
            requestAnimationFrame(() => inputRef.current?.focus());
        } else {
            returnFocus.current?.focus?.();
        }
    }, [launcherOpen]);

    useEffect(() => setSelected(0), [query]);

    const launch = (id: WindowType | undefined) => {
        if (id) open(id); // open() también cierra el lanzador
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            e.preventDefault();
            setLauncherOpen(false);
        } else if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
            e.preventDefault();
            setSelected((s) => (items.length ? (s + 1) % items.length : 0));
        } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
            e.preventDefault();
            setSelected((s) => (items.length ? (s - 1 + items.length) % items.length : 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            launch(items[selected]);
        }
    };

    return (
        <AnimatePresence>
            {launcherOpen && (
                <motion.div
                    key="launcher"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: m.duration * 0.6 }}
                    className="absolute inset-0 z-[70] flex items-start justify-center bg-black/30 px-4 pt-[18vh]"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setLauncherOpen(false);
                    }}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Lanzador de aplicaciones"
                        initial={{ opacity: 0, scale: 0.94, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -6, transition: { duration: m.duration * 0.5 } }}
                        transition={{ duration: m.duration, ease: m.ease }}
                        className="hypr-launcher w-full max-w-md overflow-hidden"
                        onKeyDown={onKeyDown}
                    >
                        <div className="flex items-center gap-2 border-b border-white/10 px-3">
                            <IconSearch size={16} stroke={2} className="shrink-0 text-slate-400" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar aplicación…"
                                aria-label="Buscar aplicación"
                                role="combobox"
                                aria-expanded="true"
                                aria-controls={listId}
                                aria-activedescendant={items[selected] ? `${listId}-${items[selected]}` : undefined}
                                className="h-12 flex-1 bg-transparent text-sm text-slate-50 outline-none placeholder:text-slate-400"
                                style={{ fontFamily: "var(--font-mono)" }}
                                spellCheck={false}
                                autoComplete="off"
                            />
                        </div>

                        <ul id={listId} role="listbox" aria-label="Aplicaciones" className="max-h-80 overflow-auto p-1.5">
                            {items.length === 0 && (
                                <li className="px-3 py-6 text-center text-sm text-slate-400">Sin resultados para «{query}»</li>
                            )}
                            {items.map((id, i) => {
                                const { Icon, label, exec, description } = APP_META[id];
                                const isOpen = windows.some((w) => w.id === id);
                                const isRecent = recent.includes(id);
                                return (
                                    <li
                                        key={id}
                                        id={`${listId}-${id}`}
                                        role="option"
                                        aria-selected={i === selected}
                                        onMouseMove={() => setSelected(i)}
                                        onClick={() => launch(id)}
                                        className={`flex cursor-pointer items-center gap-3 rounded-[calc(var(--hypr-rounding)*0.7)] px-3 py-2.5 transition-colors ${
                                            i === selected ? "bg-white/10 text-slate-50" : "text-slate-200"
                                        }`}
                                    >
                                        <Icon size={20} stroke={1.8} className="shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm">{label}</p>
                                            <p className="truncate text-xs text-slate-400">{description}</p>
                                        </div>
                                        <span className="shrink-0 text-xs text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
                                            {isOpen ? "abierta" : isRecent ? "reciente" : exec}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>

                        <p className="border-t border-white/10 px-3 py-2 text-xs text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
                            ↑↓ elegir · Enter abrir · Esc cerrar · {modLabel(mainMod)}+R alternar
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
