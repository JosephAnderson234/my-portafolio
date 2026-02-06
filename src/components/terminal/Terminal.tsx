"use client";

import { useState } from "react";
import { runCommand } from "src/libs/terminalCommands";

export default function Terminal() {
    const [history, setHistory] = useState<string[]>([
        "juan@linux:~$ whoami",
        "juan - frontend developer",
    ]);
    const [input, setInput] = useState("");

    const execute = () => {
        const command = input.trim();
        if (!command) return;

        if (command === "clear") {
            setHistory([]);
            setInput("");
            return;
        }

        const output = runCommand(command);

        setHistory((prev) => [
            ...prev,
            `juan@linux:~$ ${command}`,
            ...output,
        ]);

        setInput("");
    };

    return (
        <div className="text-zinc-100">
            {history.map((line, i) => (
                <div key={i}>{line}</div>
            ))}

            <div className="flex">
                <span className="mr-2">juan@linux:~$</span>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && execute()}
                    autoFocus
                    className="bg-transparent outline-none flex-1"
                />
            </div>
        </div>
    );
}
