"use client";

import type { ComponentType } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { isVisible, useWindowManager, WindowType } from "src/context/WindowManagerContext";
import { modLabel, useHyprConfig } from "src/context/HyprConfigContext";
import { useHyprBinds } from "src/hooks/useHyprBinds";
import Panel from "./Panel";
import Launcher from "./Launcher";
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
    const wm = useWindowManager();
    const { windows, focused, close, focus, specialOpen, toggleSpecial, activeWorkspace, setLauncherOpen } = wm;
    const { motion: m, mainMod } = useHyprConfig();
    const mod = modLabel(mainMod);
    useHyprBinds();

    const workspaceEmpty = !windows.some((w) => w.workspace === activeWorkspace);

    return (
        <MotionConfig reducedMotion={m.enabled ? "user" : "always"}>
            <div className="desktop-root" style={{ fontFamily: "var(--font-ui)" }}>
                <Wallpaper />
                <Panel />

                <AnimatePresence>
                    {workspaceEmpty && !specialOpen && (
                        <motion.div
                            key={`empty-${activeWorkspace}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            <p className="text-sm text-slate-300">workspace {activeWorkspace} · vacío</p>
                            <button
                                onClick={() => setLauncherOpen(true)}
                                className="h-10 cursor-pointer rounded-md border border-white/15 bg-slate-950/50 px-4 text-sm text-slate-100 backdrop-blur transition-colors hover:border-white/30"
                            >
                                Abrir aplicaciones
                            </button>
                            <p className="hidden text-xs text-slate-400 sm:block">
                                <kbd className="hypr-kbd">{mod}</kbd> + <kbd className="hypr-kbd">R</kbd> lanzador ·{" "}
                                <kbd className="hypr-kbd">{mod}</kbd> + <kbd className="hypr-kbd">1…0</kbd> workspaces
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Fondo atenuado del workspace especial */}
                <AnimatePresence>
                    {specialOpen && (
                        <motion.button
                            key="special-backdrop"
                            aria-label="Ocultar scratchpad"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: m.duration }}
                            onClick={toggleSpecial}
                            className="absolute inset-0 z-[39] cursor-default bg-black/45"
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {windows.map((w) => {
                        const Component = WINDOW_COMPONENTS[w.id];
                        return (
                            <WindowIdContext.Provider key={w.id} value={w.id}>
                                <Component
                                    isActive={w.id === focused && isVisible(w, wm)}
                                    onClose={() => close(w.id)}
                                    onFocus={() => focus(w.id)}
                                />
                            </WindowIdContext.Provider>
                        );
                    })}
                </AnimatePresence>

                <Launcher />
            </div>
        </MotionConfig>
    );
}
