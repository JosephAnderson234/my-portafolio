"use client";

import { useWindowManager } from "src/context/WindowManagerContext";

export default function Panel() {
    const { windows, focus } = useWindowManager();

    return (
        <div className="absolute top-0 w-full h-8 bg-zinc-900 border-b border-zinc-700 flex items-center justify-between px-3 text-xs">
            {/* Left */}
            <div className="flex gap-2">
                {windows.map((w) => (
                    <button
                        key={w.id}
                        onClick={() => focus(w.id)}
                        className={`px-2 py-0.5 rounded ${w.isActive ? "bg-zinc-700 text-white" : "text-zinc-400"
                            }`}
                    >
                        {w.id}
                    </button>
                ))}
            </div>

            {/* Right */}
            <span className="text-zinc-400">juan@linux</span>
        </div>
    );
}
