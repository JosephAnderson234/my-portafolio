// Configuración dinámica estilo hyprland.conf.
// Cada opción usa la ruta de Hyprland ("decoration:blur:size") como clave,
// así el editor de texto, `hyprctl keyword` y la UI comparten un solo modelo.

export type HyprValue = number | boolean | string;
export type HyprConfig = Record<string, HyprValue>;

type Base = { key: string; label: string };
export type OptionDef =
    | (Base & { type: "int" | "float"; min: number; max: number; step: number; default: number })
    | (Base & { type: "bool"; default: boolean })
    | (Base & { type: "color"; default: string })
    | (Base & { type: "gradient"; default: string })
    | (Base & { type: "enum"; values: readonly string[]; default: string });

export const OPTIONS: OptionDef[] = [
    { key: "$mainMod", label: "Tecla maestra", type: "enum", values: ["ALT", "SUPER"], default: "ALT" },

    { key: "general:layout", label: "Layout", type: "enum", values: ["dwindle", "master"], default: "dwindle" },
    { key: "general:gaps_in", label: "Espacio entre ventanas", type: "int", min: 0, max: 30, step: 1, default: 5 },
    { key: "general:gaps_out", label: "Espacio con los bordes", type: "int", min: 0, max: 60, step: 1, default: 14 },
    { key: "general:border_size", label: "Grosor del borde", type: "int", min: 0, max: 6, step: 1, default: 2 },
    { key: "general:col.active_border", label: "Borde activo", type: "gradient", default: "#33ccffee #00ff99ee 45deg" },
    { key: "general:col.inactive_border", label: "Borde inactivo", type: "color", default: "#59595980" },

    { key: "decoration:rounding", label: "Redondeo", type: "int", min: 0, max: 24, step: 1, default: 10 },
    { key: "decoration:active_opacity", label: "Opacidad activa", type: "float", min: 0.6, max: 1, step: 0.01, default: 1 },
    { key: "decoration:inactive_opacity", label: "Opacidad inactiva", type: "float", min: 0.6, max: 1, step: 0.01, default: 1 },
    { key: "decoration:dim_inactive", label: "Oscurecer inactivas", type: "bool", default: true },
    { key: "decoration:dim_strength", label: "Intensidad del oscurecido", type: "float", min: 0, max: 0.5, step: 0.01, default: 0.12 },
    { key: "decoration:blur:enabled", label: "Desenfoque", type: "bool", default: true },
    { key: "decoration:blur:size", label: "Tamaño", type: "int", min: 1, max: 16, step: 1, default: 7 },
    { key: "decoration:blur:passes", label: "Pasadas", type: "int", min: 1, max: 4, step: 1, default: 2 },
    { key: "decoration:shadow:enabled", label: "Sombra", type: "bool", default: true },
    { key: "decoration:shadow:range", label: "Alcance", type: "int", min: 0, max: 60, step: 1, default: 28 },
    { key: "decoration:shadow:color", label: "Color", type: "color", default: "#00070fb3" },

    { key: "animations:enabled", label: "Animaciones", type: "bool", default: true },
    { key: "animations:speed", label: "Duración (ds)", type: "float", min: 0.5, max: 8, step: 0.5, default: 2.5 },
    { key: "animations:bezier", label: "Curva", type: "enum", values: ["easeOutQuint", "overshot", "smooth", "linear"], default: "easeOutQuint" },
    { key: "animations:windows_style", label: "Estilo de apertura", type: "enum", values: ["popin", "slide", "fade"], default: "popin" },
    { key: "animations:workspaces_style", label: "Cambio de workspace", type: "enum", values: ["slide", "slidevert", "fade"], default: "slide" },

    { key: "dwindle:default_split_ratio", label: "Proporción de división", type: "float", min: 0.2, max: 1.8, step: 0.05, default: 1 },
    { key: "master:mfact", label: "Ancho del master", type: "float", min: 0.2, max: 0.8, step: 0.01, default: 0.55 },
];

export const SECTION_TITLES: Record<string, string> = {
    "": "Variables",
    dwindle: "Layout dwindle",
    master: "Layout master",
    general: "General",
    decoration: "Decoración",
    "decoration:blur": "Desenfoque",
    "decoration:shadow": "Sombra",
    animations: "Animaciones",
};

const OPTION_MAP = new Map(OPTIONS.map((o) => [o.key, o]));
export const getOption = (key: string) => OPTION_MAP.get(key);

export const DEFAULT_CONFIG: HyprConfig = Object.fromEntries(OPTIONS.map((o) => [o.key, o.default]));

// Zona reservada por la barra (equivalente a la "exclusive zone" de waybar)
export const PANEL_HEIGHT = 44;
export const WORKSPACE_COUNT = 10;

/* ------------------------------ Binds ------------------------------ */

export type Bind = { mods: string; key: string; dispatcher: string; arg: string };

export const EXEC_TARGETS = [
    "launcher",
    "terminal",
    "about",
    "projects",
    "experience",
    "education",
    "leadership",
    "skills",
    "settings",
] as const;

export const DISPATCHERS = [
    "exec",
    "killactive",
    "togglefloating",
    "fullscreen",
    "workspace",
    "movetoworkspace",
    "movetoworkspacesilent",
    "movefocus",
    "togglespecialworkspace",
] as const;

const MOD_NAMES = ["$MAINMOD", "SUPER", "ALT", "SHIFT", "CTRL", "CONTROL"];

const KEY_CODES: Record<string, string> = {
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    RETURN: "Enter",
    ENTER: "Enter",
    SPACE: "Space",
    TAB: "Tab",
    ESCAPE: "Escape",
    COMMA: "Comma",
    PERIOD: "Period",
    MOUSE_DOWN: "WheelDown",
    MOUSE_UP: "WheelUp",
};

/** Nombre de tecla de Hyprland → KeyboardEvent.code ("Q" → "KeyQ"). */
export function keyToCode(key: string): string | null {
    const k = key.trim().toUpperCase();
    if (/^[A-Z]$/.test(k)) return `Key${k}`;
    if (/^[0-9]$/.test(k)) return `Digit${k}`;
    return KEY_CODES[k] ?? null;
}

/** "$mainMod SHIFT" → conjunto de modificadores reales, p. ej. {"ALT","SHIFT"}. */
export function resolveMods(mods: string, mainMod: string): Set<string> {
    const out = new Set<string>();
    for (const raw of mods.split(/[\s_+]+/).filter(Boolean)) {
        const m = raw.toUpperCase();
        if (m === "$MAINMOD") out.add(mainMod.toUpperCase());
        else if (m === "CONTROL") out.add("CTRL");
        else out.add(m);
    }
    return out;
}

const WS_ARG = /^(\d+|[er]?[+-]\d+)$/;

/** Valida la sintaxis dispatcher + argumento sin ejecutarlo. Devuelve un error o null. */
export function validateDispatch(dispatcher: string, arg: string): string | null {
    const a = arg.trim();
    switch (dispatcher) {
        case "exec":
            return (EXEC_TARGETS as readonly string[]).includes(a)
                ? null
                : `exec: "${a}" no existe (${EXEC_TARGETS.join(", ")})`;
        case "killactive":
        case "togglefloating":
        case "fullscreen":
        case "togglespecialworkspace":
            return null;
        case "workspace": {
            if (!WS_ARG.test(a)) return `workspace: argumento no válido "${a}"`;
            if (/^\d+$/.test(a) && (Number(a) < 1 || Number(a) > WORKSPACE_COUNT))
                return `workspace: usa 1…${WORKSPACE_COUNT}`;
            return null;
        }
        case "movetoworkspace":
        case "movetoworkspacesilent":
            if (/^special(:\w+)?$/.test(a)) return null;
            return validateDispatch("workspace", a)?.replace("workspace", dispatcher) ?? null;
        case "movefocus":
            return /^[lrud]$/.test(a) ? null : `movefocus: usa l, r, u o d`;
        default:
            return `dispatcher desconocido "${dispatcher}"`;
    }
}

export function parseBind(value: string): { ok: true; bind: Bind } | { ok: false; error: string } {
    const parts = value.split(",");
    if (parts.length < 3) return { ok: false, error: "bind: formato «MODS, tecla, dispatcher, argumento»" };
    const [mods, key, dispatcher] = parts.map((p) => p.trim());
    const arg = parts.slice(3).join(",").trim();

    const badMod = mods.split(/[\s_+]+/).filter(Boolean).find((m) => !MOD_NAMES.includes(m.toUpperCase()));
    if (badMod) return { ok: false, error: `bind: modificador desconocido "${badMod}"` };
    if (!keyToCode(key)) return { ok: false, error: `bind: tecla desconocida "${key}"` };
    const err = validateDispatch(dispatcher, arg);
    if (err) return { ok: false, error: `bind: ${err}` };
    return { ok: true, bind: { mods, key, dispatcher, arg } };
}

export const formatBind = (b: Bind) => `${b.mods}, ${b.key}, ${b.dispatcher}${b.arg ? `, ${b.arg}` : ""}`;

// Basado en el hyprland.conf por defecto
export const DEFAULT_BINDS: Bind[] = [
    { mods: "$mainMod", key: "Q", dispatcher: "exec", arg: "terminal" },
    { mods: "$mainMod", key: "C", dispatcher: "killactive", arg: "" },
    { mods: "$mainMod", key: "R", dispatcher: "exec", arg: "launcher" },
    { mods: "$mainMod", key: "E", dispatcher: "exec", arg: "projects" },
    { mods: "$mainMod", key: "V", dispatcher: "togglefloating", arg: "" },
    { mods: "$mainMod", key: "F", dispatcher: "fullscreen", arg: "" },
    { mods: "$mainMod", key: "comma", dispatcher: "exec", arg: "settings" },
    { mods: "$mainMod", key: "left", dispatcher: "movefocus", arg: "l" },
    { mods: "$mainMod", key: "right", dispatcher: "movefocus", arg: "r" },
    { mods: "$mainMod", key: "up", dispatcher: "movefocus", arg: "u" },
    { mods: "$mainMod", key: "down", dispatcher: "movefocus", arg: "d" },
    ...Array.from({ length: 10 }, (_, i) => ({
        mods: "$mainMod",
        key: String((i + 1) % 10),
        dispatcher: "workspace",
        arg: String(i + 1),
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
        mods: "$mainMod SHIFT",
        key: String((i + 1) % 10),
        dispatcher: "movetoworkspace",
        arg: String(i + 1),
    })),
    { mods: "$mainMod", key: "S", dispatcher: "togglespecialworkspace", arg: "magic" },
    { mods: "$mainMod SHIFT", key: "S", dispatcher: "movetoworkspace", arg: "special:magic" },
    { mods: "$mainMod", key: "mouse_down", dispatcher: "workspace", arg: "e+1" },
    { mods: "$mainMod", key: "mouse_up", dispatcher: "workspace", arg: "e-1" },
];

export const BEZIERS: Record<string, [number, number, number, number]> = {
    easeOutQuint: [0.23, 1, 0.32, 1],
    overshot: [0.05, 0.9, 0.1, 1.1],
    smooth: [0.4, 0, 0.2, 1],
    linear: [0, 0, 1, 1],
};

export const num = (c: HyprConfig, key: string) => Number(c[key]);
export const bool = (c: HyprConfig, key: string) => c[key] === true;
export const str = (c: HyprConfig, key: string) => String(c[key]);

/* ---------------------------- Colores ---------------------------- */

export function parseColor(token: string): string | null {
    const t = token.trim();
    let m = /^rgba\(([0-9a-f]{8})\)$/i.exec(t);
    if (m) return `#${m[1].toLowerCase()}`;
    m = /^rgb\(([0-9a-f]{6})\)$/i.exec(t);
    if (m) return `#${m[1].toLowerCase()}`;
    m = /^0x([0-9a-f]{8})$/i.exec(t); // formato legado AARRGGBB
    if (m) return `#${m[1].slice(2).toLowerCase()}${m[1].slice(0, 2).toLowerCase()}`;
    m = /^#([0-9a-f]{6}|[0-9a-f]{8})$/i.exec(t);
    if (m) return `#${m[1].toLowerCase()}`;
    return null;
}

export function formatColor(hex: string): string {
    const h = hex.slice(1);
    return h.length === 8 ? `rgba(${h})` : `rgb(${h})`;
}

export type Gradient = { colors: string[]; angle: number };

export function parseGradient(value: string): Gradient | null {
    const tokens = value.trim().split(/\s+/).filter(Boolean);
    let angle = 0;
    const last = tokens[tokens.length - 1];
    if (last && /^-?\d+deg$/.test(last)) {
        angle = parseInt(last, 10);
        tokens.pop();
    }
    const colors = tokens.map(parseColor);
    if (colors.length === 0 || colors.some((c) => c === null)) return null;
    return { colors: colors as string[], angle };
}

export const gradientToString = (g: Gradient) => `${g.colors.join(" ")} ${g.angle}deg`;

/* ----------------------- Validación de valores ----------------------- */

type Coerced = { ok: true; value: HyprValue } | { ok: false; error: string };

export function coerce(def: OptionDef, raw: string): Coerced {
    const v = raw.trim();
    switch (def.type) {
        case "int":
        case "float": {
            const n = def.type === "int" ? Number.parseInt(v, 10) : Number.parseFloat(v);
            const valid = def.type === "int" ? /^-?\d+$/.test(v) : /^-?\d*\.?\d+$/.test(v);
            if (!valid || Number.isNaN(n)) return { ok: false, error: `${def.key}: se esperaba un número, se recibió "${v}"` };
            return { ok: true, value: Math.min(def.max, Math.max(def.min, n)) };
        }
        case "bool": {
            if (/^(true|yes|on|1)$/i.test(v)) return { ok: true, value: true };
            if (/^(false|no|off|0)$/i.test(v)) return { ok: true, value: false };
            return { ok: false, error: `${def.key}: se esperaba true/false, se recibió "${v}"` };
        }
        case "color": {
            const c = parseColor(v);
            return c ? { ok: true, value: c } : { ok: false, error: `${def.key}: color no válido "${v}" (usa rgba(RRGGBBAA))` };
        }
        case "gradient": {
            const g = parseGradient(v);
            return g ? { ok: true, value: gradientToString(g) } : { ok: false, error: `${def.key}: gradiente no válido "${v}"` };
        }
        case "enum":
            return def.values.includes(v)
                ? { ok: true, value: v }
                : { ok: false, error: `${def.key}: "${v}" no es válido (${def.values.join(" | ")})` };
    }
}

export function formatValue(def: OptionDef, value: HyprValue): string {
    if (def.type === "color") return formatColor(String(value));
    if (def.type === "gradient") {
        const g = parseGradient(String(value));
        return g ? `${g.colors.map(formatColor).join(" ")} ${g.angle}deg` : String(value);
    }
    return String(value);
}

/* ------------------- Serialización / parser .conf ------------------- */

export function serializeConfig(config: HyprConfig, binds: Bind[] = DEFAULT_BINDS): string {
    type Node = { values: [string, string][]; children: Map<string, Node> };
    const root: Node = { values: [], children: new Map() };

    for (const def of OPTIONS) {
        const parts = def.key.split(":");
        const name = parts.pop()!;
        let node = root;
        for (const p of parts) {
            if (!node.children.has(p)) node.children.set(p, { values: [], children: new Map() });
            node = node.children.get(p)!;
        }
        node.values.push([name, formatValue(def, config[def.key] ?? def.default)]);
    }

    const lines: string[] = [
        "# hyprland.conf · portafolio",
        "# Edita y pulsa «Aplicar» (Ctrl+S) para recargar, como `hyprctl reload`.",
        "",
    ];
    const write = (node: Node, depth: number) => {
        const pad = "    ".repeat(depth);
        for (const [k, v] of node.values) lines.push(`${pad}${k} = ${v}`);
        for (const [name, child] of node.children) {
            if (depth > 0 || node.values.length) lines.push("");
            lines.push(`${pad}${name} {`);
            write(child, depth + 1);
            lines.push(`${pad}}`);
            if (depth === 0) lines.push("");
        }
    };
    write(root, 0);
    lines.push("", "# Atajos · bind = MODS, tecla, dispatcher, argumento");
    for (const b of binds) lines.push(`bind = ${formatBind(b)}`);
    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

export type ParseError = { line: number; message: string };

export function parseConfig(text: string): { updates: HyprConfig; binds: Bind[] | null; errors: ParseError[] } {
    const updates: HyprConfig = {};
    const binds: Bind[] = [];
    let sawBind = false;
    const errors: ParseError[] = [];
    const stack: string[] = [];

    text.split(/\r?\n/).forEach((rawLine, i) => {
        const lineNo = i + 1;
        // "#" inicia comentario al comienzo o tras un espacio (no en "#33ccff")
        const line = rawLine.replace(/(^|\s)#(\s.*|$)/, "").trim();
        if (!line) return;

        let m = /^([\w.-]+)\s*\{$/.exec(line);
        if (m) {
            stack.push(m[1]);
            return;
        }
        if (line === "}") {
            if (!stack.pop()) errors.push({ line: lineNo, message: "«}» sin bloque abierto" });
            return;
        }
        m = /^([\w.:$-]+)\s*=\s*(.+)$/.exec(line);
        if (!m) {
            errors.push({ line: lineNo, message: `sintaxis no válida: "${line}"` });
            return;
        }
        if (stack.length === 0 && /^bind\w*$/.test(m[1])) {
            if (m[1] !== "bind") {
                errors.push({ line: lineNo, message: `«${m[1]}» no está soportado, usa «bind»` });
                return;
            }
            sawBind = true;
            const res = parseBind(m[2]);
            if (res.ok) binds.push(res.bind);
            else errors.push({ line: lineNo, message: res.error });
            return;
        }
        const key = [...stack, m[1]].join(":");
        const def = getOption(key);
        if (!def) {
            errors.push({ line: lineNo, message: `la opción <${key}> no existe` });
            return;
        }
        const res = coerce(def, m[2]);
        if (res.ok) updates[key] = res.value;
        else errors.push({ line: lineNo, message: res.error });
    });

    if (stack.length) errors.push({ line: text.split(/\r?\n/).length, message: `falta cerrar «${stack.join(" › ")}»` });
    // Como en Hyprland, recargar reemplaza todos los binds; sin líneas bind se conservan los actuales
    return { updates, binds: sawBind ? binds : null, errors };
}

/* ------------------------------ Presets ------------------------------ */

export const PRESETS: { id: string; label: string; values: HyprConfig }[] = [
    { id: "default", label: "Nix", values: {} },
    {
        id: "catppuccin",
        label: "Catppuccin",
        values: {
            "general:col.active_border": "#cba6f7ff #89b4faff 45deg",
            "general:col.inactive_border": "#45475a99",
            "decoration:rounding": 12,
        },
    },
    {
        id: "tokyonight",
        label: "Tokyo Night",
        values: {
            "general:col.active_border": "#7aa2f7ff #bb9af7ff 60deg",
            "general:col.inactive_border": "#41486899",
            "decoration:rounding": 8,
            "animations:bezier": "overshot",
        },
    },
    {
        id: "gruvbox",
        label: "Gruvbox",
        values: {
            "general:col.active_border": "#fabd2fff #fe8019ff 90deg",
            "general:col.inactive_border": "#50494599",
            "decoration:rounding": 4,
        },
    },
    {
        id: "minimal",
        label: "Minimal",
        values: {
            "general:gaps_in": 2,
            "general:gaps_out": 6,
            "general:border_size": 1,
            "general:col.active_border": "#e6f5ffcc 0deg",
            "decoration:rounding": 0,
            "decoration:blur:enabled": false,
            "decoration:shadow:enabled": false,
            "animations:speed": 1.5,
            "animations:windows_style": "fade",
        },
    },
];

/* --------------------------- Variables CSS --------------------------- */

export function toCssVars(c: HyprConfig): Record<string, string> {
    const g = parseGradient(str(c, "general:col.active_border")) ?? { colors: ["#33ccffee"], angle: 0 };
    const borderActive =
        g.colors.length === 1 ? g.colors[0] : `linear-gradient(${g.angle + 90}deg, ${g.colors.join(", ")})`;
    const blurOn = bool(c, "decoration:blur:enabled");
    const shadowOn = bool(c, "decoration:shadow:enabled");
    const range = num(c, "decoration:shadow:range");
    const duration = bool(c, "animations:enabled") ? num(c, "animations:speed") * 100 : 0;
    const bezier = BEZIERS[str(c, "animations:bezier")] ?? BEZIERS.easeOutQuint;

    return {
        "--hypr-gaps-in": `${num(c, "general:gaps_in")}px`,
        "--hypr-gaps-out": `${num(c, "general:gaps_out")}px`,
        "--hypr-border-size": `${num(c, "general:border_size")}px`,
        "--hypr-border-active": borderActive,
        "--hypr-border-inactive": str(c, "general:col.inactive_border"),
        "--hypr-accent-solid": g.colors[0].slice(0, 7),
        "--hypr-rounding": `${num(c, "decoration:rounding")}px`,
        // Lightning CSS descarta `backdrop-filter: var(--x)`, por eso solo se parametriza el radio
        "--hypr-blur-radius": blurOn ? `${num(c, "decoration:blur:size") * num(c, "decoration:blur:passes")}px` : "0px",
        "--hypr-window-surface": blurOn ? "rgba(8, 12, 18, 0.82)" : "rgba(8, 12, 18, 0.96)",
        "--hypr-shadow": shadowOn && range > 0
            ? `0 ${Math.round(range / 3)}px ${range}px ${str(c, "decoration:shadow:color")}`
            : "none",
        "--hypr-dim": bool(c, "decoration:dim_inactive") ? String(num(c, "decoration:dim_strength")) : "0",
        "--hypr-anim-duration": `${duration}ms`,
        "--hypr-anim-ease": `cubic-bezier(${bezier.join(", ")})`,
    };
}
