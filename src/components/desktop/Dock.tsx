"use client";

import { useWindowManager, WindowType } from "src/context/WindowManagerContext";

const apps: { id: WindowType; icon: string; label: string }[] = [
    { id: "terminal", icon: "💻", label: "Terminal" },
    { id: "about", icon: "👤", label: "About" },
    { id: "projects", icon: "📁", label: "Projects" },
    { id: "skills", icon: "🛠️", label: "Skills" },
];

export default function Dock() {
    const { open, focus, windows } = useWindowManager();

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur border border-zinc-700 rounded-xl px-4 py-2 flex gap-4">
            {apps.map((app) => {
                const isOpen = windows.some((w) => w.id === app.id);
                const isActive = windows.find((w) => w.id === app.id)?.isActive;

                return (
                    <button
                        key={app.id}
                        onClick={() => (isOpen ? focus(app.id) : open(app.id))}
                        className={`flex flex-col items-center gap-1 transition ${isActive ? "text-white" : "text-zinc-400"
                            }`}
                    >
                        <span className="text-2xl">{app.icon}</span>
                        {isOpen && (
                            <span className="w-1 h-1 rounded-full bg-white" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
