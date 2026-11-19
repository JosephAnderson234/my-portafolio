"use client";

import { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { WORKSPACE_COUNT } from "src/config/hypr";

export type WindowType =
    | "terminal"
    | "about"
    | "projects"
    | "skills"
    | "experience"
    | "education"
    | "leadership"
    | "settings";

/** Workspaces normales 1…10 o el workspace especial (scratchpad). */
export type WorkspaceId = number | "special";

export type WindowState = {
    id: WindowType;
    workspace: WorkspaceId;
    floating: boolean;
    fullscreen: boolean;
};

type State = {
    windows: WindowState[];
    activeWorkspace: number;
    specialOpen: boolean;
    focused: WindowType | null;
    /** Última ventana enfocada por workspace, para restaurar el foco al volver. */
    lastFocus: Partial<Record<string, WindowType>>;
    /** Apps usadas recientemente (más reciente primero), para el lanzador. */
    recent: WindowType[];
    launcherOpen: boolean;
};

type Action =
    | { type: "open"; id: WindowType }
    | { type: "close"; id: WindowType }
    | { type: "focus"; id: WindowType }
    | { type: "killactive" }
    | { type: "workspace"; target: string | number }
    | { type: "movetoworkspace"; target: string | number; silent: boolean }
    | { type: "togglespecial" }
    | { type: "togglefloating" }
    | { type: "fullscreen" }
    | { type: "launcher"; open: boolean };

const wsKey = (ws: WorkspaceId) => String(ws);

export const isVisible = (w: WindowState, s: Pick<State, "activeWorkspace" | "specialOpen">) =>
    w.workspace === "special" ? s.specialOpen : w.workspace === s.activeWorkspace;

/** Workspace donde ocurren las acciones: el especial si está abierto. */
const currentWs = (s: State): WorkspaceId => (s.specialOpen ? "special" : s.activeWorkspace);

function pickFocus(s: State, ws: WorkspaceId, windows = s.windows): WindowType | null {
    const inWs = windows.filter((w) => w.workspace === ws);
    const remembered = s.lastFocus[wsKey(ws)];
    if (remembered && inWs.some((w) => w.id === remembered)) return remembered;
    return inWs.length ? inWs[inWs.length - 1].id : null;
}

function withFocus(s: State, id: WindowType | null): State {
    if (!id) return { ...s, focused: null };
    const win = s.windows.find((w) => w.id === id);
    if (!win) return s;
    return { ...s, focused: id, lastFocus: { ...s.lastFocus, [wsKey(win.workspace)]: id } };
}

/** "3", "+1", "r-1", "e+1" → número de workspace (o null si no aplica). */
function resolveWorkspace(s: State, target: string | number): number | null {
    const t = String(target).trim();
    if (/^\d+$/.test(t)) {
        const n = Number(t);
        return n >= 1 && n <= WORKSPACE_COUNT ? n : null;
    }
    const m = /^([er]?)([+-]\d+)$/.exec(t);
    if (!m) return null;
    const delta = Number(m[2]);

    if (m[1] === "e") {
        // Relativo entre workspaces existentes (con ventanas) más el actual
        const existing = [
            ...new Set([s.activeWorkspace, ...s.windows.map((w) => w.workspace).filter((w): w is number => w !== "special")]),
        ].sort((a, b) => a - b);
        const idx = existing.indexOf(s.activeWorkspace);
        return existing[(idx + delta + existing.length * Math.abs(delta)) % existing.length];
    }
    const n = s.activeWorkspace + delta;
    return Math.min(WORKSPACE_COUNT, Math.max(1, n));
}

function reducer(s: State, a: Action): State {
    switch (a.type) {
        case "open": {
            const recent = [a.id, ...s.recent.filter((r) => r !== a.id)];
            const existing = s.windows.find((w) => w.id === a.id);
            if (existing) {
                // Una instancia por app: ir a su workspace y enfocarla (como focuswindow)
                const next: State =
                    existing.workspace === "special"
                        ? { ...s, specialOpen: true }
                        : { ...s, activeWorkspace: existing.workspace, specialOpen: false };
                return withFocus({ ...next, recent, launcherOpen: false }, a.id);
            }
            const win: WindowState = { id: a.id, workspace: currentWs(s), floating: false, fullscreen: false };
            return withFocus({ ...s, windows: [...s.windows, win], recent, launcherOpen: false }, a.id);
        }

        case "close": {
            const closing = s.windows.find((w) => w.id === a.id);
            if (!closing) return s;
            const windows = s.windows.filter((w) => w.id !== a.id);
            const next = { ...s, windows };
            if (s.focused !== a.id) return next;
            return withFocus(next, pickFocus(next, currentWs(next), windows));
        }

        case "focus":
            return s.focused === a.id ? s : withFocus(s, a.id);

        case "killactive":
            return s.focused ? reducer(s, { type: "close", id: s.focused }) : s;

        case "workspace": {
            const ws = resolveWorkspace(s, a.target);
            if (ws === null || (ws === s.activeWorkspace && !s.specialOpen)) return s;
            const next = { ...s, activeWorkspace: ws, specialOpen: false };
            return withFocus(next, pickFocus(next, ws));
        }

        case "movetoworkspace": {
            if (!s.focused) return s;
            const special = /^special/.test(String(a.target));
            const ws: WorkspaceId | null = special ? "special" : resolveWorkspace(s, a.target);
            if (ws === null) return s;
            const id = s.focused;
            const windows = s.windows.map((w) => (w.id === id ? { ...w, workspace: ws, fullscreen: false } : w));
            let next: State = { ...s, windows };

            if (a.silent) {
                // La ventana se va, el foco queda en el workspace actual
                return withFocus(next, pickFocus(next, currentWs(next), windows.filter((w) => w.id !== id)));
            }
            next = ws === "special" ? { ...next, specialOpen: true } : { ...next, activeWorkspace: ws, specialOpen: false };
            return withFocus(next, id);
        }

        case "togglespecial": {
            const next = { ...s, specialOpen: !s.specialOpen };
            return withFocus(next, pickFocus(next, currentWs(next)));
        }

        case "togglefloating":
        case "fullscreen": {
            if (!s.focused) return s;
            const prop = a.type === "togglefloating" ? "floating" : "fullscreen";
            return {
                ...s,
                windows: s.windows.map((w) => (w.id === s.focused ? { ...w, [prop]: !w[prop] } : w)),
            };
        }

        case "launcher":
            return { ...s, launcherOpen: a.open };
    }
}

const initialState: State = {
    windows: [{ id: "about", workspace: 1, floating: false, fullscreen: false }],
    activeWorkspace: 1,
    specialOpen: false,
    focused: "about",
    lastFocus: { "1": "about" },
    recent: ["about"],
    launcherOpen: false,
};

type WindowManagerContextType = State & {
    open: (id: WindowType) => void;
    close: (id: WindowType) => void;
    focus: (id: WindowType) => void;
    killActive: () => void;
    switchWorkspace: (target: string | number) => void;
    moveToWorkspace: (target: string | number, silent?: boolean) => void;
    toggleSpecial: () => void;
    toggleFloating: () => void;
    toggleFullscreen: () => void;
    setLauncherOpen: (open: boolean) => void;
};

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const open = useCallback((id: WindowType) => dispatch({ type: "open", id }), []);
    const close = useCallback((id: WindowType) => dispatch({ type: "close", id }), []);
    const focus = useCallback((id: WindowType) => dispatch({ type: "focus", id }), []);
    const killActive = useCallback(() => dispatch({ type: "killactive" }), []);
    const switchWorkspace = useCallback((target: string | number) => dispatch({ type: "workspace", target }), []);
    const moveToWorkspace = useCallback(
        (target: string | number, silent = false) => dispatch({ type: "movetoworkspace", target, silent }),
        []
    );
    const toggleSpecial = useCallback(() => dispatch({ type: "togglespecial" }), []);
    const toggleFloating = useCallback(() => dispatch({ type: "togglefloating" }), []);
    const toggleFullscreen = useCallback(() => dispatch({ type: "fullscreen" }), []);
    const setLauncherOpen = useCallback((open: boolean) => dispatch({ type: "launcher", open }), []);

    const value = useMemo(
        () => ({
            ...state,
            open,
            close,
            focus,
            killActive,
            switchWorkspace,
            moveToWorkspace,
            toggleSpecial,
            toggleFloating,
            toggleFullscreen,
            setLauncherOpen,
        }),
        [state, open, close, focus, killActive, switchWorkspace, moveToWorkspace, toggleSpecial, toggleFloating, toggleFullscreen, setLauncherOpen]
    );

    return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>;
}

export function useWindowManager() {
    const ctx = useContext(WindowManagerContext);
    if (!ctx) throw new Error("useWindowManager must be used inside provider");
    return ctx;
}
