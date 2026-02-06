"use client";

import Wallpaper from "./Wallpaper";
import Dock from "./Dock";
import Panel from "./Panel";

export default function Desktop() {
    return (
        <div className="w-screen h-screen relative">
            <Wallpaper />
            <Panel />
            <Dock />
        </div>
    );
}
