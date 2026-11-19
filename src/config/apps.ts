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

type AppMeta = { label: string; Icon: ComponentType<{ size?: number; stroke?: number; className?: string }> };

export const APP_META: Record<WindowType, AppMeta> = {
    terminal: { label: "Terminal", Icon: IconTerminal2 },
    about: { label: "Sobre mí", Icon: IconUserCircle },
    projects: { label: "Proyectos", Icon: IconFolderCode },
    experience: { label: "Experiencia", Icon: IconBriefcase },
    education: { label: "Educación", Icon: IconSchool },
    leadership: { label: "Liderazgo", Icon: IconUsers },
    skills: { label: "Habilidades", Icon: IconTool },
    settings: { label: "hyprland.conf", Icon: IconAdjustmentsHorizontal },
};

/** Orden del dock; también define los atajos Alt+1…7. */
export const DOCK_APPS: WindowType[] = ["terminal", "about", "projects", "experience", "education", "leadership", "skills"];

export const BINDS: { keys: string; action: string }[] = [
    { keys: "Alt + Enter", action: "Abrir la terminal" },
    { keys: "Alt + 1…7", action: "Abrir la app del dock" },
    { keys: "Alt + Q", action: "Cerrar la ventana activa" },
    { keys: "Alt + J / K", action: "Enfocar la ventana siguiente / anterior" },
    { keys: "Alt + V", action: "Alternar dwindle / floating" },
    { keys: "Alt + S", action: "Abrir hyprland.conf" },
];
