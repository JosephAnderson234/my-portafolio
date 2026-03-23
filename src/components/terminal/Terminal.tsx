"use client";

import { useState } from "react";
import { runCommand } from "src/libs/terminalCommands";
import siteData from "src/data/site.json";
import profileData from "src/data/profile.json";

export default function Terminal() {
    const prompt = siteData.terminalPrompt;

    const treeFiles = {
        "home": {
            "projects": [
                "project1.md",
                "project2.md",
                "project3.md",
            ],
            "experiences": [
                "javascript.md",
                "react.md",
                "nextjs.md",
            ],
        },
    }

    const [history, setHistory] = useState<string[]>([
        `${prompt} whoami`,
        `${profileData.name} - ${profileData.role}`,
    ]);
    const [, setCurrentPath] = useState<string[]>(["home"]);
    const [input, setInput] = useState("");

    const execute = () => {
        const command = input.trim();
        if (!command) return;

        if (command === "clear") {
            setHistory([]);
            setInput("");
            return;
        }

        if (command.startsWith("cd ")) {
            const path = command.slice(3).trim();
            const parts = path.split("/").filter(Boolean);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let node: any = treeFiles;
            for (const part of parts) {
                if (node[part]) {
                    node = node[part];
                } else {
                    setHistory((prev) => [
                        ...prev,
                        `${prompt} ${command}`,
                        `bash: cd: ${path}: No such file or directory`,
                    ]);
                    setInput("");
                    return;
                }
            }
            setCurrentPath(parts);
            setHistory((prev) => [
                ...prev,
                `${prompt} ${command}`,
            ]);
            setInput("");
            return;
        }

        const output = runCommand(command);

        setHistory((prev) => [
            ...prev,
            `${prompt} ${command}`,
            ...output,
        ]);

        setInput("");
    };

    return (
        <div className="h-full rounded-lg border border-cyan-100/10 bg-slate-950/28 p-2 text-slate-100">
            {history.map((line, i) => (
                <div key={i} className="leading-6">
                    {line}
                </div>
            ))}

            <div className="mt-1 flex items-center">
                <span className="mr-2 text-cyan-200">{prompt}</span>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && execute()}
                    autoFocus
                    className="flex-1 bg-transparent text-slate-50 outline-none"
                />
            </div>
        </div>
    );
}
