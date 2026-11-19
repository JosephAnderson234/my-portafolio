export type Rect = { x: number; y: number; w: number; h: number };

/**
 * Layout "dwindle": cada ventana nueva divide el espacio restante,
 * alternando el eje según la proporción del área.
 * `splitRatio` sigue a dwindle:default_split_ratio (1.0 = mitades iguales).
 */
export function computeDwindle(count: number, area: Rect, gap: number, splitRatio = 1): Rect[] {
    const ratio = splitRatio / 2;
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

/**
 * Layout "master": la primera ventana ocupa master:mfact del ancho
 * y el resto se apila en una columna a la derecha.
 */
export function computeMaster(count: number, area: Rect, gap: number, mfact = 0.55): Rect[] {
    if (count <= 0) return [];
    if (count === 1) return [{ ...area }];

    const masterW = Math.round((area.w - gap) * mfact);
    const stackX = area.x + masterW + gap;
    const stackW = area.w - masterW - gap;
    const stackCount = count - 1;
    const stackH = (area.h - gap * (stackCount - 1)) / stackCount;

    return [
        { x: area.x, y: area.y, w: masterW, h: area.h },
        ...Array.from({ length: stackCount }, (_, i) => ({
            x: stackX,
            y: Math.round(area.y + i * (stackH + gap)),
            w: stackW,
            h: Math.round(stackH),
        })),
    ];
}
