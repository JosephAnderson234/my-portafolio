"use client";

import { useEffect, useState } from "react";

export default function Panel() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-8 bg-zinc-900/90 border-b border-zinc-700 flex items-center justify-between px-3 text-xs select-none">
            {/* Left */}
            <div className="flex items-center gap-3">
                <span className="font-semibold">🖥 portfolioOS</span>
                <span className="text-zinc-400">juan@linux</span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4 text-zinc-300">
                <span>📶</span>
                <span>🔋</span>
                <span>{time}</span>
            </div>
        </div>
    );
}
