"use client";

import { useEffect, useId, useState } from "react";
import { IconAdjustmentsHorizontal, IconRefresh } from "@tabler/icons-react";
import Window from "./Windows";
import { modLabel, useHyprConfig } from "src/context/HyprConfigContext";
import { describeBind, formatCombo } from "src/config/apps";
import {
    OPTIONS,
    OptionDef,
    ParseError,
    PRESETS,
    SECTION_TITLES,
    gradientToString,
    parseConfig,
    parseGradient,
    serializeConfig,
} from "src/config/hypr";

type Props = {
    isActive: boolean;
    onClose: () => void;
    onFocus: () => void;
};

type Tab = "visual" | "editor" | "binds";

const TABS: { id: Tab; label: string }[] = [
    { id: "visual", label: "Ajustes" },
    { id: "editor", label: "Editor" },
    { id: "binds", label: "Atajos" },
];

// Agrupa las opciones por sección ("decoration:blur:size" → "decoration:blur")
const SECTIONS = OPTIONS.reduce<{ id: string; options: OptionDef[] }[]>((acc, def) => {
    const id = def.key.split(":").slice(0, -1).join(":");
    const section = acc.find((s) => s.id === id);
    if (section) section.options.push(def);
    else acc.push({ id, options: [def] });
    return acc;
}, []);

const hex6 = (hex: string) => hex.slice(0, 7);
const alpha = (hex: string) => (hex.length === 9 ? hex.slice(7) : "");

function OptionControl({ def }: { def: OptionDef }) {
    const { config, setOption } = useHyprConfig();
    const id = useId();
    const value = config[def.key];
    const name = def.key.split(":").pop();

    const label = (
        <label htmlFor={id} id={`${id}-label`} className="min-w-0">
            <span className="block text-sm text-slate-100">{def.label}</span>
            <span className="block truncate text-xs text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
                {name}
            </span>
        </label>
    );

    let control: React.ReactNode = null;

    if (def.type === "int" || def.type === "float") {
        control = (
            <div className="flex items-center gap-2">
                <input
                    id={id}
                    type="range"
                    min={def.min}
                    max={def.max}
                    step={def.step}
                    value={Number(value)}
                    onChange={(e) => setOption(def.key, Number(e.target.value))}
                    className="hypr-range w-28 sm:w-36"
                />
                <output htmlFor={id} className="w-10 text-right text-xs tabular-nums text-slate-200" style={{ fontFamily: "var(--font-mono)" }}>
                    {def.type === "float" ? Number(value).toFixed(2).replace(/\.?0+$/, "") || "0" : String(value)}
                </output>
            </div>
        );
    } else if (def.type === "bool") {
        const on = value === true;
        control = (
            <button
                id={id}
                role="switch"
                aria-checked={on}
                onClick={() => setOption(def.key, !on)}
                className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors ${
                    on ? "border-transparent" : "border-white/15 bg-slate-800"
                }`}
                style={on ? { background: "var(--hypr-accent-solid)" } : undefined}
            >
                <span
                    className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-transform ${
                        on ? "translate-x-5.5" : "translate-x-0.5"
                    }`}
                />
            </button>
        );
    } else if (def.type === "enum") {
        control = (
            <div role="group" aria-labelledby={`${id}-label`}className="flex flex-wrap justify-end gap-1">
                {def.values.map((v) => (
                    <button
                        key={v}
                        onClick={() => setOption(def.key, v)}
                        aria-pressed={value === v}
                        className={`h-8 cursor-pointer rounded-md border px-2.5 text-xs transition-colors ${
                            value === v
                                ? "hypr-active-outline bg-white/10 text-slate-50"
                                : "border-white/10 text-slate-300 hover:border-white/25 hover:text-slate-50"
                        }`}
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        {v}
                    </button>
                ))}
            </div>
        );
    } else if (def.type === "color") {
        const hex = String(value);
        control = (
            <input
                id={id}
                type="color"
                value={hex6(hex)}
                onChange={(e) => setOption(def.key, e.target.value + alpha(hex))}
                className="hypr-color"
            />
        );
    } else if (def.type === "gradient") {
        const g = parseGradient(String(value)) ?? { colors: ["#33ccffee"], angle: 0 };
        const update = (colors: string[], angle = g.angle) => setOption(def.key, gradientToString({ colors, angle }));
        control = (
            <div className="flex items-center gap-2">
                {[0, 1].map((i) => {
                    const c = g.colors[i] ?? g.colors[0];
                    return (
                        <input
                            key={i}
                            id={i === 0 ? id : undefined}
                            type="color"
                            aria-label={`Color ${i + 1} del gradiente`}
                            value={hex6(c)}
                            onChange={(e) => {
                                const next = [g.colors[0], g.colors[1] ?? g.colors[0]];
                                next[i] = e.target.value + alpha(c);
                                update(next);
                            }}
                            className="hypr-color"
                        />
                    );
                })}
                <input
                    type="range"
                    min={0}
                    max={360}
                    step={15}
                    value={g.angle}
                    aria-label="Ángulo del gradiente"
                    onChange={(e) => update(g.colors, Number(e.target.value))}
                    className="hypr-range w-16 sm:w-20"
                />
                <span className="w-10 text-right text-xs tabular-nums text-slate-200" style={{ fontFamily: "var(--font-mono)" }}>
                    {g.angle}°
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between gap-3 py-2">
            {label}
            {control}
        </div>
    );
}

function VisualTab() {
    const { applyPreset, reset } = useHyprConfig();

    return (
        <div className="space-y-4">
            <section aria-labelledby="presets-title">
                <div className="mb-2 flex items-center justify-between">
                    <h3 id="presets-title" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Presets
                    </h3>
                    <button
                        onClick={reset}
                        className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2 text-xs text-slate-300 transition-colors hover:bg-white/8 hover:text-slate-50"
                    >
                        <IconRefresh size={13} stroke={2} />
                        Restablecer
                    </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {PRESETS.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => applyPreset(p.id)}
                            className="h-8 cursor-pointer rounded-md border border-white/10 bg-slate-900/40 px-3 text-xs text-slate-200 transition-colors hover:border-white/25 hover:text-slate-50"
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </section>

            {SECTIONS.map((section) => (
                <section
                    key={section.id}
                    aria-labelledby={`sec-${section.id}`}
                    className="rounded-[calc(var(--hypr-rounding)*0.8)] border border-white/8 bg-slate-900/30 px-3 py-1"
                >
                    <h3
                        id={`sec-${section.id}`}
                        className="flex items-baseline justify-between pt-2 text-xs font-semibold uppercase tracking-widest text-slate-400"
                    >
                        {SECTION_TITLES[section.id] ?? section.id}
                        <span className="font-normal normal-case tracking-normal text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
                            {section.id.replaceAll(":", " › ")}
                        </span>
                    </h3>
                    <div className="divide-y divide-white/6">
                        {section.options.map((def) => (
                            <OptionControl key={def.key} def={def} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

function EditorTab() {
    const { config, binds, setMany, setBinds } = useHyprConfig();
    const generated = serializeConfig(config, binds);
    const [text, setText] = useState(generated);
    const [dirty, setDirty] = useState(false);
    const [errors, setErrors] = useState<ParseError[]>([]);
    const [applied, setApplied] = useState<number | null>(null);

    // Si la config cambia desde la UI o hyprctl y no hay cambios locales, sincronizar
    useEffect(() => {
        if (!dirty) setText(generated);
    }, [generated, dirty]);

    const apply = () => {
        const { updates, binds: parsedBinds, errors } = parseConfig(text);
        setMany(updates);
        if (parsedBinds) setBinds(parsedBinds);
        setErrors(errors);
        setApplied(Object.keys(updates).length + (parsedBinds?.length ?? 0));
        setDirty(false);
    };

    return (
        <div className="flex h-full min-h-80 flex-col gap-2">
            <textarea
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    setDirty(true);
                    setApplied(null);
                }}
                onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                        e.preventDefault();
                        apply();
                    }
                }}
                spellCheck={false}
                aria-label="Contenido de hyprland.conf"
                className="min-h-64 flex-1 resize-none rounded-[calc(var(--hypr-rounding)*0.8)] border border-white/10 bg-slate-950/60 p-3 text-[13px] leading-6 text-slate-100 caret-cyan-300 focus:border-white/25"
                style={{ fontFamily: "var(--font-mono)", tabSize: 4 }}
            />

            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={apply}
                    className="hypr-active-outline h-9 cursor-pointer rounded-md border bg-white/10 px-3 text-xs font-medium text-slate-50 transition-colors hover:bg-white/15"
                >
                    Aplicar <span className="text-slate-400">Ctrl+S</span>
                </button>
                <button
                    onClick={() => {
                        setText(generated);
                        setDirty(false);
                        setErrors([]);
                        setApplied(null);
                    }}
                    disabled={!dirty}
                    className="h-9 cursor-pointer rounded-md border border-white/10 px-3 text-xs text-slate-300 transition-colors hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Descartar cambios
                </button>
                <p role="status" className="text-xs text-slate-300">
                    {dirty ? "Cambios sin aplicar" : applied !== null ? `Recargado · ${applied} líneas aplicadas` : ""}
                </p>
            </div>

            {errors.length > 0 && (
                <ul role="alert" className="space-y-1 rounded-md border border-red-400/30 bg-red-500/10 p-2.5 text-xs text-red-200" style={{ fontFamily: "var(--font-mono)" }}>
                    {errors.map((err, i) => (
                        <li key={i}>
                            línea {err.line}: {err.message}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function BindsTab() {
    const { binds, mainMod } = useHyprConfig();
    const mod = modLabel(mainMod);

    return (
        <div className="space-y-3">
            <p className="text-sm text-slate-300">
                El navegador no recibe la tecla <kbd className="hypr-kbd">Super</kbd> en todos los sistemas, por eso{" "}
                <code className="text-slate-100">$mainMod</code> es <kbd className="hypr-kbd">{mod}</kbd>. Cámbialo en{" "}
                <em>Ajustes › Variables</em> y edita los atajos como líneas <code className="text-slate-100">bind = …</code> en el{" "}
                <em>Editor</em>.
            </p>
            <ul className="divide-y divide-white/6 rounded-[calc(var(--hypr-rounding)*0.8)] border border-white/8 bg-slate-900/30 px-3">
                {binds.map((b, i) => (
                    <li key={`${b.mods}-${b.key}-${i}`} className="flex items-center justify-between gap-3 py-2 text-sm">
                        <span className="min-w-0">
                            <span className="block text-slate-200">{describeBind(b.dispatcher, b.arg)}</span>
                            <span className="block truncate text-xs text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
                                {b.dispatcher}
                                {b.arg ? `, ${b.arg}` : ""}
                            </span>
                        </span>
                        <kbd className="hypr-kbd shrink-0">{formatCombo(b.mods, b.key, mainMod)}</kbd>
                    </li>
                ))}
            </ul>
            <pre className="overflow-x-auto rounded-md border border-white/8 bg-slate-950/60 p-3 text-xs leading-6 text-slate-300" style={{ fontFamily: "var(--font-mono)" }}>
{`$ hyprctl dispatch workspace 2
$ hyprctl dispatch movetoworkspace 3
$ hyprctl keyword decoration:rounding 16
$ hyprctl clients`}
            </pre>
        </div>
    );
}

export default function SettingsWindow({ isActive, onClose, onFocus }: Props) {
    const [tab, setTab] = useState<Tab>("visual");
    const baseId = useId();

    return (
        <Window
            title="~/.config/hypr/hyprland.conf"
            isActive={isActive}
            onClose={onClose}
            onFocus={onFocus}
            defaultSize={{ x: 280, y: 70, width: 600, height: 560 }}
        >
            <div className="flex h-full flex-col" style={{ fontFamily: "var(--font-ui)" }}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <IconAdjustmentsHorizontal size={16} stroke={1.8} style={{ color: "var(--hypr-accent-solid)" }} />
                        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Configuración</span>
                    </div>
                    <div role="tablist" aria-label="Secciones de configuración" className="flex gap-1 rounded-lg border border-white/10 bg-slate-950/40 p-0.5">
                        {TABS.map((t) => (
                            <button
                                key={t.id}
                                role="tab"
                                id={`${baseId}-tab-${t.id}`}
                                aria-selected={tab === t.id}
                                aria-controls={`${baseId}-panel`}
                                onClick={() => setTab(t.id)}
                                className={`h-8 cursor-pointer rounded-md px-3 text-xs transition-colors ${
                                    tab === t.id ? "bg-white/12 text-slate-50" : "text-slate-300 hover:text-slate-50"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    role="tabpanel"
                    id={`${baseId}-panel`}
                    aria-labelledby={`${baseId}-tab-${tab}`}
                    className="min-h-0 flex-1"
                >
                    {tab === "visual" && <VisualTab />}
                    {tab === "editor" && <EditorTab />}
                    {tab === "binds" && <BindsTab />}
                </div>
            </div>
        </Window>
    );
}
