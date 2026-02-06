"use client";

import Window from "./Windows";
import Terminal from "src/components/terminal/Terminal";

type Props = {
    isActive: boolean;
    onClose: () => void;
    onFocus: () => void;
};

export default function TerminalWindow({
    isActive,
    onClose,
    onFocus,
}: Props) {
    return (
        <Window
            title="Terminal"
            isActive={isActive}
            onClose={onClose}
            onFocus={onFocus}
            defaultSize={{ x: 150, y: 120, width: 600, height: 360 }}
        >
            <Terminal />
        </Window>
    );
}
