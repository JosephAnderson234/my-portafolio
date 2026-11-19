import { BINDS } from "src/config/apps";
import { HyprConfig, HyprValue, OPTIONS, coerce, formatValue, getOption } from "src/config/hypr";

type Api = { config: HyprConfig; setOption: (key: string, value: HyprValue) => void };

const USAGE = [
    "usage: hyprctl <command> [args]",
    "  keyword <option> <value>   Set a config option live",
    "  getoption <option>         Print the current value",
    "  options                    List every available option",
    "  binds                      List keybinds",
];

/** Subconjunto de `hyprctl` que opera sobre la config dinámica del portafolio. */
export function runHyprctl(args: string[], { config, setOption }: Api): string[] {
    const [sub, key, ...rest] = args;

    switch (sub) {
        case "keyword": {
            if (!key || rest.length === 0) return ["usage: hyprctl keyword <option> <value>"];
            const def = getOption(key);
            if (!def) return [`config option <${key}> does not exist.`];
            const res = coerce(def, rest.join(" "));
            if (!res.ok) return [res.error];
            setOption(key, res.value);
            return ["ok"];
        }
        case "getoption": {
            if (!key) return ["usage: hyprctl getoption <option>"];
            const def = getOption(key);
            if (!def) return [`no such option <${key}>`];
            return [`${key} = ${formatValue(def, config[key])}`];
        }
        case "options":
            return OPTIONS.map((o) => `  ${o.key.padEnd(30)} ${formatValue(o, config[o.key])}`);
        case "binds":
            return BINDS.map((b) => `  ${b.keys.padEnd(14)} ${b.action}`);
        default:
            return USAGE;
    }
}
