// Canvas network backgrounds ported from MinimalR.dc.html and NeuralFX.dc.html
// Exports factories for Constellation (N1), Reactive web (N2), and Growing graph (N5).

export interface NetworkEffect {
  step(dt: number, pointer: { x: number; y: number } | null): void;
  draw(): void;
  resize(w: number, h: number): void;
}

const COLOR_TEAL = "#0d7a6e";
const COLOR_AMBER = "#f2b544";
const RGB_LINE = "31,35,38";
const RGB_NODE = "13,122,110";

function createRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function dot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  col: string
): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = col;
  ctx.fill();
}

interface Drifter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  a?: boolean;
}

/**
 * Constellation (N1): nodes drift slowly; links form and fade by distance.
 */
export function constellation(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
): NetworkEffect {
  let width = w;
  let height = h;

  const rng = createRng(7);
  const nodes: Drifter[] = Array.from({ length: 90 }, (_, i) => ({
    x: rng(),
    y: rng(),
    vx: (rng() - 0.5) * 0.025,
    vy: (rng() - 0.5) * 0.025,
    a: i % 7 === 0,
  }));

  return {
    step(dt: number, _pointer: { x: number; y: number } | null) {
      nodes.forEach((n) => {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < 0) {
          n.x = 0;
          n.vx = Math.abs(n.vx);
        } else if (n.x > 1) {
          n.x = 1;
          n.vx = -Math.abs(n.vx);
        }
        if (n.y < 0) {
          n.y = 0;
          n.vy = Math.abs(n.vy);
        } else if (n.y > 1) {
          n.y = 1;
          n.vy = -Math.abs(n.vy);
        }
      });
    },

    draw() {
      ctx.clearRect(0, 0, width, height);

      const max = Math.min(width, height) * 0.26;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot((a.x - b.x) * width, (a.y - b.y) * height);
          if (d < max) {
            ctx.strokeStyle = `rgba(${RGB_LINE},${(0.32 * (1 - d / max)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x * width, a.y * height);
            ctx.lineTo(b.x * width, b.y * height);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        dot(
          ctx,
          n.x * width,
          n.y * height,
          n.a ? 3 : 2.2,
          n.a ? COLOR_AMBER : COLOR_TEAL
        );
      });
    },

    resize(newW: number, newH: number) {
      width = newW;
      height = newH;
    },
  };
}

/**
 * Reactive web (N2): nodes lean toward pointer and wire to it; orbits when idle.
 */
export function reactiveWeb(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
): NetworkEffect {
  let width = w;
  let height = h;
  let time = 3;

  const rng = createRng(11);
  const nodes: Drifter[] = Array.from({ length: 100 }, () => ({
    x: rng(),
    y: rng(),
    vx: (rng() - 0.5) * 0.025,
    vy: (rng() - 0.5) * 0.025,
  }));

  let currentPointer: { x: number; y: number } = {
    x: 0.5 + 0.32 * Math.cos(time * 0.45),
    y: 0.5 + 0.3 * Math.sin(time * 0.6),
  };

  return {
    step(dt: number, pointer: { x: number; y: number } | null) {
      time += dt;
      const p = pointer || {
        x: 0.5 + 0.32 * Math.cos(time * 0.45),
        y: 0.5 + 0.3 * Math.sin(time * 0.6),
      };
      currentPointer = p;

      const reach = Math.min(width, height) * 0.4;
      nodes.forEach((n) => {
        const dx = (p.x - n.x) * width;
        const dy = (p.y - n.y) * height;
        const d = Math.hypot(dx, dy);
        if (d < reach && d > 1) {
          n.vx += (dx / d) * 0.02 * dt;
          n.vy += (dy / d) * 0.02 * dt;
        }
        n.vx *= 0.99;
        n.vy *= 0.99;
        n.x = Math.max(0, Math.min(1, n.x + n.vx * dt));
        n.y = Math.max(0, Math.min(1, n.y + n.vy * dt));
        if (n.x <= 0 || n.x >= 1) n.vx *= -1;
        if (n.y <= 0 || n.y >= 1) n.vy *= -1;
      });
    },

    draw() {
      ctx.clearRect(0, 0, width, height);

      const reach = Math.min(width, height) * 0.4;
      const p = currentPointer;

      nodes.forEach((n) => {
        const dx = (p.x - n.x) * width;
        const dy = (p.y - n.y) * height;
        const d = Math.hypot(dx, dy);
        if (d < reach) {
          ctx.strokeStyle = `rgba(${RGB_NODE},${(0.5 * (1 - d / reach)).toFixed(3)})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(n.x * width, n.y * height);
          ctx.lineTo(p.x * width, p.y * height);
          ctx.stroke();
        }
      });

      const max = Math.min(width, height) * 0.14;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot((a.x - b.x) * width, (a.y - b.y) * height);
          if (d < max) {
            ctx.strokeStyle = `rgba(${RGB_LINE},${(0.22 * (1 - d / max)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x * width, a.y * height);
            ctx.lineTo(b.x * width, b.y * height);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        dot(ctx, n.x * width, n.y * height, 2.1, COLOR_TEAL);
      });
      dot(ctx, p.x * width, p.y * height, 4.5, COLOR_AMBER);
    },

    resize(newW: number, newH: number) {
      width = newW;
      height = newH;
    },
  };
}

interface GraphData {
  pts: [number, number][];
  edges: [number, number][];
}

function buildGrowingGraph(k: number): GraphData {
  const rng = createRng(100 + k * 7);
  const n = 60;
  const pts: [number, number][] = Array.from({ length: n }, () => [
    0.04 + rng() * 0.92,
    0.06 + rng() * 0.88,
  ]);
  const edges: [number, number][] = [];
  pts.forEach((p, i) => {
    if (!i) return;
    pts
      .slice(0, i)
      .map(
        (q, j) =>
          [j, (q[0] - p[0]) ** 2 + ((q[1] - p[1]) * 0.45) ** 2] as [
            number,
            number,
          ]
      )
      .sort((a, b) => a[1] - b[1])
      .slice(0, 2)
      .forEach(([j]) => edges.push([i, j]));
  });
  return { pts, edges };
}

/**
 * Growing graph (N5): network builds itself node by node over a cycle, then rebuilds.
 */
export function growingGraph(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
): NetworkEffect {
  let width = w;
  let height = h;
  const cycle = 10;
  let time = 3;

  let currentK = Math.floor(time / cycle);
  let graph = buildGrowingGraph(currentK);

  return {
    step(dt: number, _pointer: { x: number; y: number } | null) {
      time += dt;
      const k = Math.floor(time / cycle);
      if (currentK !== k) {
        currentK = k;
        graph = buildGrowingGraph(k);
      }
    },

    draw() {
      ctx.clearRect(0, 0, width, height);

      const local = time - currentK * cycle;
      const shown = Math.min(
        graph.pts.length,
        Math.floor((local / 7) * graph.pts.length)
      );
      const fade = local > 8.5 ? Math.max(0, 1 - (local - 8.5) / 1.5) : 1;

      graph.edges.forEach(([a, b]) => {
        if (a >= shown) return;
        ctx.strokeStyle = `rgba(${RGB_NODE},${(0.35 * fade).toFixed(3)})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(graph.pts[a][0] * width, graph.pts[a][1] * height);
        ctx.lineTo(graph.pts[b][0] * width, graph.pts[b][1] * height);
        ctx.stroke();
      });

      ctx.globalAlpha = fade;
      for (let i = 0; i < shown; i++) {
        const fresh = i >= shown - 2;
        dot(
          ctx,
          graph.pts[i][0] * width,
          graph.pts[i][1] * height,
          fresh ? 4.5 : 2.4,
          fresh ? COLOR_AMBER : COLOR_TEAL
        );
      }
      ctx.globalAlpha = 1;
    },

    resize(newW: number, newH: number) {
      width = newW;
      height = newH;
    },
  };
}
