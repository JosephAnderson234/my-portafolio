"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useWindowManager } from "src/context/WindowManagerContext";
import Dock from "./Dock";
import Panel from "./Panel";
import TerminalWindow from "../windows/TerminalWindows";
import AboutWindow from "../windows/AboutWindow";
import ProjectsWindow from "../windows/ProjectsWindow";
import ExperienceWindow from "../windows/ExperienceWindow";
import SkillsWindow from "../windows/SkillsWindow";
import Wallpaper from "./Wallpaper";

const windowVariants = {
    initial: { opacity: 0, scale: 0.96, y: 14 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.94, y: 18 },
};

const transition = { duration: 0.25, ease: "easeOut" } as const;

export default function Desktop() {
    const { windows, close, focus } = useWindowManager();

    return (
        <div className="desktop-root" style={{ fontFamily: "var(--font-ui)" }}>
            <Wallpaper />
            <Panel />

            {/* Desktop hint when no windows are open */}
            <AnimatePresence>
                {windows.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3"
                    >
                        <p className="text-sm text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>
                            Click an icon in the dock to open a window
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {windows.map((w) => {
                    if (w.id === "terminal") {
                        return (
                            <motion.div
                                key={w.id}
                                variants={windowVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={transition}
                            >
                                <TerminalWindow
                                    isActive={w.isActive}
                                    onClose={() => close("terminal")}
                                    onFocus={() => focus("terminal")}
                                />
                            </motion.div>
                        );
                    }

                    if (w.id === "about") {
                        return (
                            <motion.div
                                key={w.id}
                                variants={windowVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={transition}
                            >
                                <AboutWindow
                                    isActive={w.isActive}
                                    onClose={() => close("about")}
                                    onFocus={() => focus("about")}
                                />
                            </motion.div>
                        );
                    }

                    if (w.id === "projects") {
                        return (
                            <motion.div
                                key={w.id}
                                variants={windowVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={transition}
                            >
                                <ProjectsWindow
                                    isActive={w.isActive}
                                    onClose={() => close("projects")}
                                    onFocus={() => focus("projects")}
                                />
                            </motion.div>
                        );
                    }

                    if (w.id === "experience") {
                        return (
                            <motion.div
                                key={w.id}
                                variants={windowVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={transition}
                            >
                                <ExperienceWindow
                                    isActive={w.isActive}
                                    onClose={() => close("experience")}
                                    onFocus={() => focus("experience")}
                                />
                            </motion.div>
                        );
                    }

                    if (w.id === "skills") {
                        return (
                            <motion.div
                                key={w.id}
                                variants={windowVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={transition}
                            >
                                <SkillsWindow
                                    isActive={w.isActive}
                                    onClose={() => close("skills")}
                                    onFocus={() => focus("skills")}
                                />
                            </motion.div>
                        );
                    }

                    return null;
                })}
            </AnimatePresence>

            <Dock />
        </div>
    );
}
