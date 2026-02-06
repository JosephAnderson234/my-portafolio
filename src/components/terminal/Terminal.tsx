"use client";

import { useState } from "react";

export default function Terminal() {
    const [lines, setLines] = useState([
        "juan@portfolio:~$ whoami",
        "Juan Pérez - Frontend Developer",
    ]);

    return (
        <div className="font-mono text-sm">
            {lines.map((line, i) => (
                <div key={i}>{line}</div>
            ))}
            <span className="animate-pulse">▋</span>
        </div>
    );
}
