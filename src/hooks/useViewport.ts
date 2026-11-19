"use client";

import { useEffect, useState } from "react";

export type Viewport = { w: number; h: number };

/** Tamaño de la ventana del navegador; `null` hasta montar en el cliente. */
export function useViewport(): Viewport | null {
    const [vp, setVp] = useState<Viewport | null>(null);

    useEffect(() => {
        let frame = 0;
        const update = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => setVp({ w: window.innerWidth, h: window.innerHeight }));
        };
        update();
        window.addEventListener("resize", update);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", update);
        };
    }, []);

    return vp;
}

export const MOBILE_BREAKPOINT = 640;
