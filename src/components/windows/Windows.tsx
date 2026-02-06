"use client";

import { Rnd } from "react-rnd";
import { ReactNode } from "react";

type Props = {
    title: string;
    children: ReactNode;
    isActive: boolean;
    onClose: () => void;
    onFocus: () => void;
    defaultSize?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
};

export default function Window({
    title,
    children,
    isActive,
    onClose,
    onFocus,
    defaultSize = { x: 120, y: 120, width: 520, height: 320 },
}: Props) {
    return (
        <Rnd
            default={defaultSize}
            bounds="window"
            onMouseDown={onFocus}
            className={`z-${isActive ? 50 : 10}`}
        >
            <div
                className={`h-full flex flex-col rounded-md shadow-xl border transition
          ${isActive
                        ? "border-zinc-300 bg-zinc-900"
                        : "border-zinc-700 bg-zinc-900/80"}
        `}
            >
                {/* Title bar */}
                <div
                    onMouseDown={onFocus}
                    className={`h-8 flex items-center justify-between px-3 cursor-move select-none
            ${isActive ? "bg-zinc-800" : "bg-zinc-800/70"}
          `}
                >
                    <span className="text-sm">{title}</span>

                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-3 font-mono text-sm">
                    {children}
                </div>
            </div>
        </Rnd>
    );
}
