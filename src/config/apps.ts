import type { ComponentType } from "react";
import {
    IconAdjustmentsHorizontal,
    IconBriefcase,
    IconFolderCode,
    IconSchool,
    IconTerminal2,
    IconTool,
    IconUserCircle,
    IconUsers,
} from "@tabler/icons-react";
import type { WindowType } from "src/context/WindowManagerContext";

type AppMeta = {
    label: string;
    /** Nombre del "binario", como lo mostraría un lanzador tipo wofi/rofi. */
    exec: string;
    description: string;
    Icon: ComponentType<{ size?: number; stroke?: number; className?: string }>;
};

export const APP_META: Record<WindowType, AppMeta> = {
    terminal: { label: "Terminal", exec: "terminal", description: "Shell interactiva con hyprctl", Icon: IconTerminal2 },
    about: { label: "Sobre mí", exec: "about", description: "Perfil, contacto y CV", Icon: IconUserCircle },
    projects: { label: "Proyectos", exec: "projects", description: "Proyectos y repositorios", Icon: IconFolderCode },
    experience: { label: "Experiencia", exec: "experience", description: "Trayectoria laboral", Icon: IconBriefcase },
    education: { label: "Educación", exec: "education", description: "Formación académica", Icon: IconSchool },
    leadership: { label: "Liderazgo", exec: "leadership", description: "Actividades e intereses", Icon: IconUsers },
    skills: { label: "Habilidades", exec: "skills", description: "Stack técnico", Icon: IconTool },
    settings: { label: "hyprland.conf", exec: "settings", description: "Configuración del compositor", Icon: IconAdjustmentsHorizontal },
};

/** Orden base del lanzador (las apps recientes se muestran primero). */
export const LAUNCHER_APPS: WindowType[] = [
    "about",
    "projects",
    "experience",
    "skills",
    "education",
    "leadership",
    "terminal",
    "settings",
];

/** Descripción legible de un bind para la UI. */
export function describeBind(dispatcher: string, arg: string): string {
    switch (dispatcher) {
        case "exec":
            return arg === "launcher" ? "Abrir el lanzador" : `Abrir ${APP_META[arg as WindowType]?.label ?? arg}`;
        case "killactive":
            return "Cerrar la ventana activa";
        case "togglefloating":
            return "Alternar flotante / en mosaico";
        case "fullscreen":
            return "Pantalla completa";
        case "workspace":
            return /^\d+$/.test(arg) ? `Ir al workspace ${arg}` : `Workspace ${arg.startsWith("e+") ? "siguiente" : "anterior"}`;
        case "movetoworkspace":
        case "movetoworkspacesilent":
            return arg.startsWith("special") ? "Mover ventana al scratchpad" : `Mover ventana al workspace ${arg}`;
        case "movefocus":
            return `Mover foco ${{ l: "a la izquierda", r: "a la derecha", u: "arriba", d: "abajo" }[arg] ?? arg}`;
        case "togglespecialworkspace":
            return "Mostrar / ocultar scratchpad";
        default:
            return dispatcher;
    }
}

/** "$mainMod SHIFT" + "1" → "Alt + Shift + 1" */
export function formatCombo(mods: string, key: string, mainMod: string): string {
    const parts = mods
        .split(/[\s_+]+/)
        .filter(Boolean)
        .map((m) => {
            const u = m.toUpperCase();
            if (u === "$MAINMOD") return mainMod === "SUPER" ? "Super" : "Alt";
            return u.charAt(0) + u.slice(1).toLowerCase();
        });
    const k = key.toLowerCase();
    const keyLabel =
        { left: "←", right: "→", up: "↑", down: "↓", comma: ",", period: ".", mouse_down: "Rueda ↓", mouse_up: "Rueda ↑", return: "Enter" }[k] ??
        key.toUpperCase();
    return [...parts, keyLabel].join(" + ");
}
