import { useState } from "react";

export type WindowType =
    | "terminal"
    | "about"
    | "projects"
    | "skills";

export function useWindowManager() {
    const [windows, setWindows] = useState<WindowType[]>([]);

    const open = (type: WindowType) =>
        setWindows((prev) =>
            prev.includes(type) ? prev : [...prev, type]
        );

    const close = (type: WindowType) =>
        setWindows((prev) => prev.filter((w) => w !== type));

    return { windows, open, close };
}
