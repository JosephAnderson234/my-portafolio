"use client";

import { motion } from "framer-motion";

export default function Wallpaper() {
    return (
        <>
            <motion.div
                initial={{ opacity: 0.82, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.05, ease: "easeOut" }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/wallpapers/linux.avif')" }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/35 via-slate-950/25 to-slate-950/65" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,236,255,0.22),transparent_40%)]" />
            <div className="wallpaper-grain" />
        </>
    );
}
