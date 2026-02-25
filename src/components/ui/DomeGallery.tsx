import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';

type ImageItem = string | { src: string; alt?: string; name?: string; role?: string; description?: string };

type DomeGalleryProps = {
    images?: ImageItem[];
    fit?: number;
    fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height';
    minRadius?: number;
    maxRadius?: number;
    padFactor?: number;
    overlayBlurColor?: string;
    maxVerticalRotationDeg?: number;
    dragSensitivity?: number;
    enlargeTransitionMs?: number;
    segments?: number;
    imageBorderRadius?: string;
    openedImageBorderRadius?: string;
    grayscale?: boolean;
};

type ItemDef = {
    src: string;
    alt: string;
    name: string;
    role: string;
    description: string;
    x: number;
    y: number;
    sizeX: number;
    sizeY: number;
};

const DEFAULTS = {
    maxVerticalRotationDeg: 15,
    dragSensitivity: 20,
    enlargeTransitionMs: 300,
    segments: 35
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg: number) => {
    const a = (((deg + 180) % 360) + 360) % 360;
    return a - 180;
};
const getDataNumber = (el: HTMLElement, name: string, fallback: number) => {
    const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
    const n = attr == null ? NaN : parseFloat(attr);
    return Number.isFinite(n) ? n : fallback;
};

function buildItems(pool: ImageItem[], seg: number): ItemDef[] {
    const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
    const evenYs = [-4, -2, 0, 2, 4];
    const oddYs = [-3, -1, 1, 3, 5];

    const coords = xCols.flatMap((x, c) => {
        const ys = c % 2 === 0 ? evenYs : oddYs;
        return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
    });

    const totalSlots = coords.length;
    if (pool.length === 0) return [];

    const normalizedImages = pool.map(image => {
        if (typeof image === 'string') return { src: image, alt: '', name: '', role: '', description: '' };
        return {
            src: image.src || '',
            alt: image.alt || '',
            name: image.name || '',
            role: image.role || '',
            description: image.description || ''
        };
    });

    const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

    return coords.map((c, i) => ({
        ...c,
        src: usedImages[i].src,
        alt: usedImages[i].alt,
        name: usedImages[i].name,
        role: usedImages[i].role,
        description: usedImages[i].description
    }));
}

function computeItemBaseRotation(offsetX: number, offsetY: number, sizeX: number, sizeY: number, segments: number) {
    const unit = 360 / segments / 2;
    const rotateY = unit * (offsetX + (sizeX - 1) / 2);
    const rotateX = unit * (offsetY - (sizeY - 1) / 2);
    return { rotateX, rotateY };
}

export const DomeGallery = ({
    images = [],
    fit = 0.45,
    fitBasis = 'auto',
    minRadius = 400,
    maxRadius = 800,
    padFactor = 0.15,
    overlayBlurColor = '#ffffff',
    maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
    dragSensitivity = DEFAULTS.dragSensitivity,
    enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
    segments = DEFAULTS.segments,
    imageBorderRadius = '24px',
    openedImageBorderRadius = '32px',
    grayscale = false
}: DomeGalleryProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLElement>(null);
    const sphereRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<HTMLDivElement>(null);
    const scrimRef = useRef<HTMLDivElement>(null);
    const focusedElRef = useRef<HTMLElement | null>(null);
    const originalTilePositionRef = useRef<{
        left: number;
        top: number;
        width: number;
        height: number;
    } | null>(null);

    const rotationRef = useRef({ x: 0, y: 0 });
    const startRotRef = useRef({ x: 0, y: 0 });
    const startPosRef = useRef<{ x: number; y: number } | null>(null);
    const draggingRef = useRef(false);
    const movedRef = useRef(false);
    const inertiaRAF = useRef<number | null>(null);
    const pointerTypeRef = useRef<'mouse' | 'pen' | 'touch'>('mouse');
    const tapTargetRef = useRef<HTMLElement | null>(null);
    const openingRef = useRef(false);
    const openStartedAtRef = useRef(0);
    const lastDragEndAt = useRef(0);
    const scrollLockedRef = useRef(false);

    const lockScroll = useCallback(() => {
        if (scrollLockedRef.current) return;
        scrollLockedRef.current = true;
        document.body.style.overflow = 'hidden';
    }, []);

    const unlockScroll = useCallback(() => {
        if (!scrollLockedRef.current) return;
        if (rootRef.current?.getAttribute('data-enlarging') === 'true') return;
        scrollLockedRef.current = false;
        document.body.style.overflow = '';
    }, []);

    const items = useMemo(() => buildItems(images, segments), [images, segments]);

    const applyTransform = useCallback((xDeg: number, yDeg: number) => {
        const el = sphereRef.current;
        if (el) {
            el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
        }
    }, []);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const ro = new ResizeObserver(entries => {
            const cr = entries[0].contentRect;
            const w = Math.max(1, cr.width),
                h = Math.max(1, cr.height);
            const minDim = Math.min(w, h);
            const aspect = w / h;
            let basis: number;

            switch (fitBasis) {
                case 'min': basis = minDim; break;
                case 'max': basis = Math.max(w, h); break;
                case 'width': basis = w; break;
                case 'height': basis = h; break;
                default: basis = aspect >= 1.3 ? w : minDim;
            }

            let radius = basis * fit;
            radius = Math.min(radius, h * 1.35);
            radius = clamp(radius, minRadius, maxRadius);
            const lockedRadius = Math.round(radius);

            const viewerPad = Math.max(8, Math.round(minDim * padFactor));
            root.style.setProperty('--radius', `${lockedRadius}px`);
            root.style.setProperty('--viewer-pad', `${viewerPad}px`);
            root.style.setProperty('--overlay-blur-color', overlayBlurColor);
            root.style.setProperty('--tile-radius', imageBorderRadius);
            root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
            root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
            applyTransform(rotationRef.current.x, rotationRef.current.y);
        });
        ro.observe(root);
        return () => ro.disconnect();
    }, [fit, fitBasis, minRadius, maxRadius, padFactor, overlayBlurColor, grayscale, imageBorderRadius, openedImageBorderRadius, applyTransform]);

    const stopInertia = useCallback(() => {
        if (inertiaRAF.current) {
            cancelAnimationFrame(inertiaRAF.current);
            inertiaRAF.current = null;
        }
    }, []);

    const startInertia = useCallback((vx: number, vy: number) => {
        const MAX_V = 1.4;
        let vX = clamp(vx, -MAX_V, MAX_V) * 80;
        let vY = clamp(vy, -MAX_V, MAX_V) * 80;
        let frames = 0;
        const frictionMul = 0.95;
        const stopThreshold = 0.01;
        const maxFrames = 300;

        const step = () => {
            vX *= frictionMul;
            vY *= frictionMul;
            if ((Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) || ++frames > maxFrames) {
                inertiaRAF.current = null;
                return;
            }
            const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
            const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
            rotationRef.current = { x: nextX, y: nextY };
            applyTransform(nextX, nextY);
            inertiaRAF.current = requestAnimationFrame(step);
        };
        stopInertia();
        inertiaRAF.current = requestAnimationFrame(step);
    }, [maxVerticalRotationDeg, applyTransform, stopInertia]);

    const openItemFromElement = useCallback((el: HTMLElement) => {
        if (openingRef.current) return;
        openingRef.current = true;
        openStartedAtRef.current = performance.now();
        lockScroll();
        const parent = el.parentElement as HTMLElement;
        focusedElRef.current = el;

        const offsetX = getDataNumber(parent, 'offsetX', 0);
        const offsetY = getDataNumber(parent, 'offsetY', 0);
        const sizeX = getDataNumber(parent, 'sizeX', 2);
        const sizeY = getDataNumber(parent, 'sizeY', 2);
        const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments);

        const parentY = normalizeAngle(parentRot.rotateY);
        const globalY = normalizeAngle(rotationRef.current.y);
        let rotY = -(parentY + globalY) % 360;
        if (rotY < -180) rotY += 360;
        const rotX = -parentRot.rotateX - rotationRef.current.x;

        parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
        parent.style.setProperty('--rot-x-delta', `${rotX}deg`);

        const refDiv = document.createElement('div');
        refDiv.className = 'item__image item__image--reference opacity-0';
        refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
        parent.appendChild(refDiv);

        const tileR = refDiv.getBoundingClientRect();
        const mainR = mainRef.current?.getBoundingClientRect();
        const frameR = frameRef.current?.getBoundingClientRect();

        if (!mainR || !frameR || tileR.width <= 0 || tileR.height <= 0) {
            openingRef.current = false;
            focusedElRef.current = null;
            parent.removeChild(refDiv);
            unlockScroll();
            return;
        }

        originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
        el.style.visibility = 'hidden';

        const overlay = document.createElement('div');
        overlay.className = 'enlarge';
        overlay.style.cssText = `position:absolute; left:${frameR.left - mainR.left}px; top:${frameR.top - mainR.top}px; width:${frameR.width}px; height:${frameR.height}px; opacity:0; z-index:30; transform-origin:top left; transition:transform ${enlargeTransitionMs}ms ease, opacity ${enlargeTransitionMs}ms ease; border-radius:${openedImageBorderRadius}; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,.35);`;

        const rawSrc = parent.dataset.src || (el.querySelector('img') as HTMLImageElement)?.src || '';
        const name = parent.dataset.name || '';
        const role = parent.dataset.role || '';
        const description = parent.dataset.description || '';

        const img = document.createElement('img');
        img.src = rawSrc;
        img.style.cssText = `width:100%; height:100%; object-fit:cover; filter:${grayscale ? 'grayscale(1)' : 'none'};`;
        overlay.appendChild(img);

        // Content Overlay
        if (name || role || description) {
            const content = document.createElement('div');
            content.style.cssText = `position:absolute; bottom:0; left:0; right:0; padding:2.5rem 2rem 2rem; background:linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%); color:white; transform:translateY(100%); transition:transform ${enlargeTransitionMs}ms ease ${enlargeTransitionMs / 2}ms; display:flex; flex-direction:column; gap:0.25rem;`;

            if (name) {
                const n = document.createElement('h3');
                n.innerText = name;
                n.style.cssText = 'margin:0; font-size:1.8rem; font-weight:700; color:white; line-height:1.2;';
                content.appendChild(n);
            }
            if (role) {
                const r = document.createElement('p');
                r.innerText = role;
                r.style.cssText = 'margin:0; font-size:1.1rem; color:rgba(255,255,255,0.9); font-weight:500; text-transform:uppercase; letter-spacing:0.05em;';
                content.appendChild(r);
            }
            if (description) {
                const d = document.createElement('p');
                d.innerText = description;
                d.style.cssText = 'margin:1rem 0 0; font-size:1rem; color:rgba(255,255,255,0.8); line-height:1.6; max-width:90%;';
                content.appendChild(d);
            }

            overlay.appendChild(content);
            setTimeout(() => {
                content.style.transform = 'translateY(0)';
            }, 50);
        }

        viewerRef.current?.appendChild(overlay);

        const tx0 = tileR.left - frameR.left;
        const ty0 = tileR.top - frameR.top;
        const sx0 = tileR.width / frameR.width;
        const sy0 = tileR.height / frameR.height;

        overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${sx0}, ${sy0})`;
        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
            rootRef.current?.setAttribute('data-enlarging', 'true');
        }, 16);
    }, [segments, lockScroll, unlockScroll, enlargeTransitionMs, openedImageBorderRadius, grayscale]);

    useGesture({
        onDragStart: ({ event }) => {
            if (focusedElRef.current) return;
            stopInertia();
            const evt = event as PointerEvent;
            pointerTypeRef.current = (evt.pointerType as 'mouse' | 'pen' | 'touch') || 'mouse';
            if (pointerTypeRef.current === 'touch') lockScroll();
            draggingRef.current = true;
            movedRef.current = false;
            startRotRef.current = { ...rotationRef.current };
            startPosRef.current = { x: evt.clientX, y: evt.clientY };
            tapTargetRef.current = (evt.target as Element).closest?.('.item__image') as HTMLElement | null;
        },
        onDrag: ({ event, last, velocity: [vMagX, vMagY], direction: [dirX, dirY], movement }) => {
            if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;
            const evt = event as PointerEvent;
            const dxTotal = evt.clientX - startPosRef.current.x;
            const dyTotal = evt.clientY - startPosRef.current.y;

            if (!movedRef.current && (dxTotal * dxTotal + dyTotal * dyTotal > 16)) movedRef.current = true;

            const nextX = clamp(startRotRef.current.x - dyTotal / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg);
            const nextY = startRotRef.current.y + dxTotal / dragSensitivity;

            if (rotationRef.current.x !== nextX || rotationRef.current.y !== nextY) {
                rotationRef.current = { x: nextX, y: nextY };
                applyTransform(nextX, nextY);
            }

            if (last) {
                draggingRef.current = false;
                let isTap = false;
                const dx = evt.clientX - startPosRef.current.x;
                const dy = evt.clientY - startPosRef.current.y;
                const dist2 = dx * dx + dy * dy;
                const TAP_THRESH = pointerTypeRef.current === 'touch' ? 10 : 6;
                if (dist2 <= TAP_THRESH * TAP_THRESH) isTap = true;

                let vx = vMagX * dirX;
                let vy = vMagY * dirY;

                if (!isTap && Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
                    vx = (movement[0] / dragSensitivity) * 0.02;
                    vy = (movement[1] / dragSensitivity) * 0.02;
                }

                if (!isTap && (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005)) startInertia(vx, vy);
                if (isTap && tapTargetRef.current && !focusedElRef.current) openItemFromElement(tapTargetRef.current);

                startPosRef.current = null;
                tapTargetRef.current = null;
                if (pointerTypeRef.current === 'touch') unlockScroll();
                if (movedRef.current) lastDragEndAt.current = performance.now();
                movedRef.current = false;
            }
        }
    }, { target: mainRef, eventOptions: { passive: false } });

    useEffect(() => {
        const scrim = scrimRef.current;
        if (!scrim) return;
        const close = () => {
            if (performance.now() - openStartedAtRef.current < 250) return;
            const el = focusedElRef.current;
            if (!el) return;

            const overlay = viewerRef.current?.querySelector('.enlarge') as HTMLElement | null;
            if (overlay) overlay.remove();

            const parent = el.parentElement as HTMLElement;
            parent.style.setProperty('--rot-y-delta', `0deg`);
            parent.style.setProperty('--rot-x-delta', `0deg`);
            el.style.visibility = '';
            focusedElRef.current = null;
            rootRef.current?.removeAttribute('data-enlarging');
            openingRef.current = false;
            unlockScroll();
        };
        scrim.addEventListener('click', close);
        return () => scrim.removeEventListener('click', close);
    }, [unlockScroll]);

    return (
        <div ref={rootRef} className="sphere-root relative w-full h-full overflow-hidden bg-transparent"
            style={{
                ['--segments-x' as string]: segments,
                ['--segments-y' as string]: segments,
            } as React.CSSProperties}
        >
            <style>{`
        .sphere-root {
          --radius: 520px;
          --circ: calc(var(--radius) * 3.14159);
          --rot-y: calc((360deg / var(--segments-x)) / 2);
          --rot-x: calc((360deg / var(--segments-y)) / 2);
          --item-width: calc(var(--circ) / var(--segments-x));
          --item-height: calc(var(--circ) / var(--segments-y));
        }
        .sphere { transform-style: preserve-3d; will-change: transform; position: absolute; }
        .sphere-item {
          width: calc(var(--item-width) * var(--item-size-x));
          height: calc(var(--item-height) * var(--item-size-y));
          position: absolute;
          margin: auto;
          transform-origin: 50% 50%;
          backface-visibility: hidden;
          transform: rotateY(calc(var(--rot-y) * (var(--offset-x) + ((var(--item-size-x) - 1) / 2)) + var(--rot-y-delta, 0deg))) 
                     rotateX(calc(var(--rot-x) * (var(--offset-y) - ((var(--item-size-y) - 1) / 2)) + var(--rot-x-delta, 0deg))) 
                     translateZ(var(--radius));
        }
        .item__image {
          position: absolute; inset: 4px;
          border-radius: var(--tile-radius);
          overflow: hidden; cursor: pointer;
          backface-visibility: hidden;
          transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateZ(0);
        }
        .item__image:hover { transform: scale(1.05) translateZ(20px); }
        .sphere-root[data-enlarging="true"] .scrim { opacity: 1 !important; pointer-events: all !important; }
        .stage { width: 100%; height: 100%; display: grid; place-items: center; perspective: calc(var(--radius) * 2); }
      `}</style>
            <main ref={mainRef} className="absolute inset-0 grid place-items-center touch-none select-none">
                <div className="stage">
                    <div ref={sphereRef} className="sphere">
                        {items.map((it, i) => (
                            <div key={i} className="sphere-item"
                                data-offset-x={it.x} data-offset-y={it.y} data-size-x={it.sizeX} data-size-y={it.sizeY}
                                data-src={it.src} data-name={it.name} data-role={it.role} data-description={it.description}
                                style={{
                                    '--offset-x': it.x,
                                    '--offset-y': it.y,
                                    '--item-size-x': it.sizeX,
                                    '--item-size-y': it.sizeY,
                                    top: '-999px', bottom: '-999px', left: '-999px', right: '-999px'
                                } as React.CSSProperties}
                            >
                                <div className="item__image shadow-lg">
                                    <img src={it.src} draggable={false} alt={it.alt} className="w-full h-full object-cover" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute inset-0 z-[3] pointer-events-none"
                    style={{ backgroundImage: `radial-gradient(rgba(255, 255, 255, 0) 60%, ${overlayBlurColor} 100%)` }}
                />
                <div ref={viewerRef} className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                    <div ref={scrimRef} className="scrim absolute inset-0 z-10 pointer-events-none opacity-0 transition-opacity duration-500 bg-black/40 backdrop-blur-sm" />
                    <div ref={frameRef} className="h-[80%] aspect-square" />
                </div>
            </main>
        </div>
    );
};
