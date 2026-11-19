export type Rect = { x: number; y: number; w: number; h: number };

/**
 * Layout "dwindle" de Hyprland: cada ventana nueva divide a la mitad el
 * espacio restante, alternando el eje según la proporción del área.
 */
export function computeDwindle(count: number, area: Rect, gap: number, ratio = 0.5): Rect[] {
    const rects: Rect[] = [];
    let r = { ...area };

    for (let i = 0; i < count; i++) {
        if (i === count - 1) {
            rects.push(r);
            break;
        }
        if (r.w >= r.h) {
            const w1 = Math.round((r.w - gap) * ratio);
            rects.push({ x: r.x, y: r.y, w: w1, h: r.h });
            r = { x: r.x + w1 + gap, y: r.y, w: r.w - w1 - gap, h: r.h };
        } else {
            const h1 = Math.round((r.h - gap) * ratio);
            rects.push({ x: r.x, y: r.y, w: r.w, h: h1 });
            r = { x: r.x, y: r.y + h1 + gap, w: r.w, h: r.h - h1 - gap };
        }
    }

    return rects;
}
