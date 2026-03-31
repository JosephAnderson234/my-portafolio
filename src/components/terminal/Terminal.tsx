"use client";

import { useEffect, useRef, useState } from "react";
import { runCommand } from "src/libs/terminalCommands";
import siteData from "src/data/site.json";
import profileData from "src/data/profile.json";

export default function Terminal() {
    const prompt = siteData.terminalPrompt;
    const bottomRef = useRef<HTMLDivElement>(null);

    const [history, setHistory] = useState<{ type: "input" | "output"; text: string }[]>([
        { type: "output", text: `Welcome to ${siteData.desktopName} — ${siteData.version}` },
        { type: "output", text: `${profileData.name} · ${profileData.role}` },
        { type: "output", text: `Type 'help' for available commands.` },
        { type: "output", text: "" },
    ]);
    const [input, setInput] = useState("");
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const execute = () => {
        const command = input.trim();

        if (command) {
            setCmdHistory((prev) => [command, ...prev]);
            setHistoryIndex(-1);
        }

        if (!command) return;

        if (command === "clear") {
            setHistory([]);
            setInput("");
            return;
        }

        const output = runCommand(command);

        setHistory((prev) => [
            ...prev,
            { type: "input", text: command },
            ...output.map((line) => ({ type: "output" as const, text: line })),
        ]);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            execute();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const next = Math.min(historyIndex + 1, cmdHistory.length - 1);
            setHistoryIndex(next);
            setInput(cmdHistory[next] ?? "");
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = Math.max(historyIndex - 1, -1);
            setHistoryIndex(next);
            setInput(next === -1 ? "" : cmdHistory[next] ?? "");
        }
    };

    return (
        <div
            className="flex h-full flex-col rounded-lg border border-cyan-100/10 bg-slate-950/40 p-3"
            style={{ fontFamily: "var(--font-mono)" }}
        >
            <div className="flex-1 overflow-auto space-y-0.5">
                {history.map((entry, i) => (
                    <div key={i} className="leading-5">
                        {entry.type === "input" ? (
                            <div className="flex gap-2">
                                <span className="shrink-0 text-cyan-300">{prompt}</span>
                                <span className="text-slate-100">{entry.text}</span>
                            </div>
                        ) : (
                            <span className="text-slate-400">{entry.text}</span>
                        )}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="mt-2 flex items-center gap-2 border-t border-white/8 pt-2">
                <span className="shrink-0 text-cyan-300">{prompt}</span>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="flex-1 bg-transparent text-slate-50 outline-none caret-cyan-400"
                    spellCheck={false}
                    autoComplete="off"
                />
            </div>
        </div>
    );
}
