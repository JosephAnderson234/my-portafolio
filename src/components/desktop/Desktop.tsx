"use client";

import type { ComponentType } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useWindowManager, WindowType } from "src/context/WindowManagerContext";
import { useHyprConfig } from "src/context/HyprConfigContext";
import { useHyprBinds } from "src/hooks/useHyprBinds";
import Dock from "./Dock";
import Panel from "./Panel";
import Wallpaper from "./Wallpaper";
import { WindowIdContext } from "../windows/Windows";
import TerminalWindow from "../windows/TerminalWindows";
import AboutWindow from "../windows/AboutWindow";
import ProjectsWindow from "../windows/ProjectsWindow";
import ExperienceWindow from "../windows/ExperienceWindow";
import EducationWindow from "../windows/EducationWindow";
import LeadershipWindow from "../windows/LeadershipWindow";
import SkillsWindow from "../windows/SkillsWindow";
import SettingsWindow from "../windows/SettingsWindow";

type WindowProps = { isActive: boolean; onClose: () => void; onFocus: () => void };

const WINDOW_COMPONENTS: Record<WindowType, ComponentType<WindowProps>> = {
    terminal: TerminalWindow,
    about: AboutWindow,
    projects: ProjectsWindow,
    experience: ExperienceWindow,
    education: EducationWindow,
    leadership: LeadershipWindow,
    skills: SkillsWindow,
    settings: SettingsWindow,
};

export default function Desktop() {
    const { windows, close, focus } = useWindowManager();
    const { motion: m } = useHyprConfig();
    useHyprBinds();

    return (
        <MotionConfig reducedMotion={m.enabled ? "user" : "always"}>
            <div className="desktop-root" style={{ fontFamily: "var(--font-ui)" }}>
                <Wallpaper />
                <Panel />

                <AnimatePresence>
                    {windows.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center"
                        >
                            <p className="text-sm text-slate-300" style={{ fontFamily: "var(--font-mono)" }}>
                                Haz clic en un ícono del dock para abrir una ventana
                            </p>
                            <p className="hidden text-xs text-slate-400 sm:block" style={{ fontFamily: "var(--font-mono)" }}>
                                o usa <kbd className="hypr-kbd">Alt</kbd> + <kbd className="hypr-kbd">Enter</kbd> para la
                                terminal · <kbd className="hypr-kbd">Alt</kbd> + <kbd className="hypr-kbd">S</kbd> para
                                configurar
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {windows.map((w) => {
                        const Component = WINDOW_COMPONENTS[w.id];
                        return (
                            <WindowIdContext.Provider key={w.id} value={w.id}>
                                <Component
                                    isActive={w.isActive}
                                    onClose={() => close(w.id)}
                                    onFocus={() => focus(w.id)}
                                />
                            </WindowIdContext.Provider>
                        );
                    })}
                </AnimatePresence>

                <Dock />
            </div>
        </MotionConfig>
    );
}
