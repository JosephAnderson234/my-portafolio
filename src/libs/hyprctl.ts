import { APP_META, formatCombo } from "src/config/apps";
import { Bind, HyprConfig, HyprValue, OPTIONS, coerce, formatBind, formatValue, getOption } from "src/config/hypr";
import type { WindowState, WindowType } from "src/context/WindowManagerContext";

type Api = {
    config: HyprConfig;
    binds: Bind[];
    mainMod: string;
    setOption: (key: string, value: HyprValue) => void;
    dispatch: (dispatcher: string, arg?: string) => string | null;
    windows: WindowState[];
    activeWorkspace: number;
    specialOpen: boolean;
    focused: WindowType | null;
};

const USAGE = [
    "usage: hyprctl <command> [args]",
    "  dispatch <dispatcher> [arg]  Run a dispatcher (workspace 2, movetoworkspace 3, exec about…)",
    "  keyword <option> <value>     Set a config option live",
    "  getoption <option>           Print the current value",
    "  clients                      List open windows",
    "  workspaces                   List workspaces",
    "  activewindow                 Show the focused window",
    "  binds                        List keybinds",
    "  options                      List every config option",
];

const wsName = (ws: WindowState["workspace"]) => (ws === "special" ? "special:magic" : String(ws));

/** Subconjunto de `hyprctl` que opera sobre el compositor del portafolio. */
export function runHyprctl(args: string[], api: Api): string[] {
    const [sub, key, ...rest] = args;

    switch (sub) {
        case "dispatch": {
            if (!key) return ["usage: hyprctl dispatch <dispatcher> [arg]"];
            const error = api.dispatch(key, rest.join(" "));
            return [error ?? "ok"];
        }
        case "keyword": {
            if (!key || rest.length === 0) return ["usage: hyprctl keyword <option> <value>"];
            const def = getOption(key);
            if (!def) return [`config option <${key}> does not exist.`];
            const res = coerce(def, rest.join(" "));
            if (!res.ok) return [res.error];
            api.setOption(key, res.value);
            return ["ok"];
        }
        case "getoption": {
            if (!key) return ["usage: hyprctl getoption <option>"];
            const def = getOption(key);
            if (!def) return [`no such option <${key}>`];
            return [`${key} = ${formatValue(def, api.config[key])}`];
        }
        case "clients":
            if (api.windows.length === 0) return ["(no clients)"];
            return api.windows.flatMap((w) => [
                `Window ${w.id} -> ${APP_META[w.id].label}:`,
                `    workspace: ${wsName(w.workspace)}`,
                `    floating: ${w.floating ? 1 : 0}`,
                `    fullscreen: ${w.fullscreen ? 1 : 0}`,
                `    focused: ${w.id === api.focused ? 1 : 0}`,
                "",
            ]);
        case "workspaces": {
            const ids = [...new Set<WindowState["workspace"]>([api.activeWorkspace, ...api.windows.map((w) => w.workspace)])].sort(
                (a, b) => (a === "special" ? 1 : b === "special" ? -1 : a - b)
            );
            return ids.flatMap((ws) => {
                const inWs = api.windows.filter((w) => w.workspace === ws);
                const shown = ws === "special" ? api.specialOpen : ws === api.activeWorkspace;
                return [
                    `workspace ID ${ws === "special" ? -98 : ws} (${wsName(ws)})${shown ? " [visible]" : ""}:`,
                    `    windows: ${inWs.length}`,
                    `    lastwindow: ${inWs.at(-1)?.id ?? "-"}`,
                    "",
                ];
            });
        }
        case "activewindow": {
            const w = api.windows.find((x) => x.id === api.focused);
            if (!w) return ["Invalid"];
            return [`Window ${w.id} -> ${APP_META[w.id].label}:`, `    workspace: ${wsName(w.workspace)}`, `    floating: ${w.floating ? 1 : 0}`];
        }
        case "options":
            return OPTIONS.map((o) => `  ${o.key.padEnd(32)} ${formatValue(o, api.config[o.key])}`);
        case "binds":
            return api.binds.map((b) => `  ${formatCombo(b.mods, b.key, api.mainMod).padEnd(18)} bind = ${formatBind(b)}`);
        default:
            return USAGE;
    }
}
