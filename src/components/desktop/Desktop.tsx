"use client";

import { useWindowManager } from "src/context/WindowManagerContext";
import Dock from "./Dock";
import Panel from "./Panel";
import TerminalWindow from "../windows/TerminalWindows";
// importa otras ventanas

export default function Desktop() {
    const { windows, close, focus } = useWindowManager();

    return (
        <div className="w-screen h-screen relative">
            <Panel />

            {windows.map((w) => {
                if (w.id === "terminal") {
                    return (
                        <TerminalWindow
                            key={w.id}
                            isActive={w.isActive}
                            onClose={() => close("terminal")}
                            onFocus={() => focus("terminal")}
                        />
                    );
                }
                return null;
            })}

            <Dock />
        </div>
    );
}
