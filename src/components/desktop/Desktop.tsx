"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useWindowManager } from "src/context/WindowManagerContext";
import Dock from "./Dock";
import Panel from "./Panel";
import TerminalWindow from "../windows/TerminalWindows";
import Wallpaper from "./Wallpaper";
// importa otras ventanas

export default function Desktop() {
    const { windows, close, focus } = useWindowManager();

    return (
        <div className="desktop-root" style={{ fontFamily: "var(--font-ui)" }}>
            <Wallpaper />
            <Panel />

            <AnimatePresence>
                {windows.map((w) => {
                    if (w.id === "terminal") {
                        return (
                            <motion.div
                                key={w.id}
                                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                                <TerminalWindow
                                    isActive={w.isActive}
                                    onClose={() => close("terminal")}
                                    onFocus={() => focus("terminal")}
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
