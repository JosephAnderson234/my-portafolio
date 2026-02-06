"use client";

import { Rnd } from "react-rnd";
import { motion } from "framer-motion";

type Props = {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
};

export default function Window({ title, children, onClose }: Props) {
    return (
        <Rnd
            default={{
                x: 100,
                y: 100,
                width: 500,
                height: 300,
            }}
            bounds="window"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-zinc-900 border border-zinc-700 rounded-md shadow-xl flex flex-col"
            >
                <div className="flex items-center justify-between bg-zinc-800 px-3 py-1">
                    <span className="text-sm">{title}</span>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="p-3 overflow-auto flex-1">
                    {children}
                </div>
            </motion.div>
        </Rnd>
    );
}
