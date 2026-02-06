"use client";

import { useWindowManager } from "src/hooks/useWindowManager";

export default function Dock() {
    const { open } = useWindowManager();

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur border border-zinc-700 rounded-xl px-4 py-2 flex gap-4 shadow-lg">
            <DockButton label="Terminal" icon="💻" onClick={() => open("terminal")} />
            <DockButton label="About" icon="👤" onClick={() => open("about")} />
            <DockButton label="Projects" icon="📁" onClick={() => open("projects")} />
            <DockButton label="Skills" icon="🛠️" onClick={() => open("skills")} />
        </div>
    );
}

function DockButton({
    icon,
    label,
    onClick,
}: {
    icon: string;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="group flex flex-col items-center gap-1 text-zinc-300 hover:text-white transition"
        >
            <div className="text-2xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition">
                {label}
            </span>
        </button>
    );
}
