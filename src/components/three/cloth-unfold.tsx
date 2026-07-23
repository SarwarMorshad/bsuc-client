"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Authentic block-printed kantha palette (soft cotton tones).
const GROUND = "#f7f4ec";
const BAND_BG = "#f6e3dc";
const CORAL = "#e0836f";
const ROSE = "#cf6f66";
const SAGE = "#9cb98f";
const SAGE_DEEP = "#7d9c74";

const W = 2048;
const H = 1280;
const B = 210; // border band depth
const E = 52; // outer striped edging
const S = 96; // lattice cell

/** How many viewport-heights of scroll the stitching spans (matches hero height). */
export const STITCH_SPAN = 1.8;

type Op = { d: number; draw: (ctx: CanvasRenderingContext2D) => void };

/**
 * Builds the bare cloth plus an ordered list of embroidery operations.
 * Ops are sorted by distance from the centre so the kantha "blooms" outward
 * as it is stitched.
 */
function buildKantha() {
  const cx0 = W / 2;
  const cy0 = H / 2;
  const dist = (x: number, y: number) => Math.hypot(x - cx0, y - cy0);

  /** The woven cloth itself — always present; only the embroidery is stitched. */
  const drawBase = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = BAND_BG;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = GROUND;
    ctx.fillRect(B, B, W - B * 2, H - B * 2);
    ctx.fillRect(0, 0, W, E);
    ctx.fillRect(0, H - E, W, E);
    ctx.fillRect(0, 0, E, H);
    ctx.fillRect(W - E, 0, E, H);
  };

  const ops: Op[] = [];

  // ── Field: one op per lattice cell (diamond + rosette) ──
  for (let cy = B; cy < H - B; cy += S) {
    for (let cx = B; cx < W - B; cx += S) {
      const mx = cx + S / 2;
      const my = cy + S / 2;
      if (mx > W - B || my > H - B) continue;
      ops.push({
        d: dist(mx, my),
        draw: (ctx) => {
          ctx.save();
          ctx.beginPath();
          ctx.rect(B, B, W - B * 2, H - B * 2);
          ctx.clip();

          ctx.strokeStyle = CORAL;
          ctx.lineWidth = 4;
          ctx.setLineDash([7, 5]);
          ctx.beginPath();
          ctx.moveTo(mx, cy);
          ctx.lineTo(cx + S, my);
          ctx.lineTo(mx, cy + S);
          ctx.lineTo(cx, my);
          ctx.closePath();
          ctx.stroke();
          ctx.setLineDash([]);

          for (let p = 0; p < 4; p++) {
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate((p * Math.PI) / 2);
            ctx.beginPath();
            ctx.ellipse(0, -9, 6, 10, 0, 0, Math.PI * 2);
            ctx.fillStyle = SAGE;
            ctx.fill();
            ctx.restore();
          }
          for (let p = 0; p < 4; p++) {
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate((p * Math.PI) / 2 + Math.PI / 4);
            ctx.beginPath();
            ctx.ellipse(0, -7, 4, 7, 0, 0, Math.PI * 2);
            ctx.fillStyle = SAGE_DEEP;
            ctx.fill();
            ctx.restore();
          }
          ctx.beginPath();
          ctx.arc(mx, my, 4, 0, Math.PI * 2);
          ctx.fillStyle = GROUND;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(mx, cy, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = ROSE;
          ctx.fill();
          ctx.restore();
        },
      });
    }
  }

  // ── Border: floral vine units along the ring ──
  const mid = (E + B) / 2;
  const vineUnit =
    (px: number, py: number, rot: number) => (ctx: CanvasRenderingContext2D) => {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);
      // stem
      ctx.strokeStyle = SAGE_DEEP;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-52, 14);
      ctx.quadraticCurveTo(0, -22, 52, 14);
      ctx.stroke();
      // leaves
      for (const dir of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(dir * 34, 6, 19, 9.5, dir * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = SAGE;
        ctx.fill();
      }
      // five-petal rose
      for (let p = 0; p < 5; p++) {
        ctx.save();
        ctx.rotate((p * 2 * Math.PI) / 5);
        ctx.beginPath();
        ctx.ellipse(0, -17, 11, 17, 0, 0, Math.PI * 2);
        ctx.fillStyle = p % 2 ? ROSE : CORAL;
        ctx.fill();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = GROUND;
      ctx.fill();
      ctx.restore();
    };

  for (let x = 60; x < W; x += 104) {
    ops.push({ d: dist(x, mid), draw: vineUnit(x, mid, 0) });
    ops.push({ d: dist(x, H - mid), draw: vineUnit(x, H - mid, Math.PI) });
  }
  for (let y = 60; y < H; y += 104) {
    ops.push({ d: dist(mid, y), draw: vineUnit(mid, y, Math.PI / 2) });
    ops.push({ d: dist(W - mid, y), draw: vineUnit(W - mid, y, -Math.PI / 2) });
  }

  // ── Separator seams ──
  ops.push({
    d: dist(B, B) * 0.98,
    draw: (ctx) => {
      ctx.strokeStyle = ROSE;
      ctx.lineWidth = 5;
      ctx.strokeRect(B - 14, B - 14, W - (B - 14) * 2, H - (B - 14) * 2);
      ctx.strokeStyle = SAGE_DEEP;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(B - 26, B - 26, W - (B - 26) * 2, H - (B - 26) * 2);
    },
  });

  // ── Outer chevron edging, in small batches ──
  for (let bx = 0; bx < W; bx += 260) {
    ops.push({
      d: dist(bx, 0) * 1.02,
      draw: (ctx) => {
        ctx.strokeStyle = SAGE_DEEP;
        ctx.lineWidth = 5;
        for (let x = bx; x < bx + 260 && x < W; x += 26) {
          ctx.beginPath();
          ctx.moveTo(x, 8);
          ctx.lineTo(x + 14, E - 8);
          ctx.moveTo(x, H - E + 8);
          ctx.lineTo(x + 14, H - 8);
          ctx.stroke();
        }
      },
    });
  }
  for (let by = 0; by < H; by += 260) {
    ops.push({
      d: dist(0, by) * 1.02,
      draw: (ctx) => {
        ctx.strokeStyle = SAGE_DEEP;
        ctx.lineWidth = 5;
        for (let y = by; y < by + 260 && y < H; y += 26) {
          ctx.beginPath();
          ctx.moveTo(8, y);
          ctx.lineTo(E - 8, y + 14);
          ctx.moveTo(W - E + 8, y);
          ctx.lineTo(W - 8, y + 14);
          ctx.stroke();
        }
      },
    });
  }

  ops.sort((a, b) => a.d - b.d);
  return { drawBase, ops };
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

function Cloth({ reduced }: { reduced: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(5.6, 3.4, 72, 46), []);
  const base = useMemo(
    () => Float32Array.from(geo.attributes.position.array as Float32Array),
    [geo],
  );

  const { canvas, ctx, texture, ops, drawBase } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    const { drawBase, ops } = buildKantha();
    drawBase(ctx);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return { canvas, ctx, texture, ops, drawBase };
  }, []);

  const stitched = useRef(0);
  const eased = useRef(reduced ? 1 : 0);

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;

    // Scroll progress across the pinned stitching section.
    const target =
      typeof window !== "undefined"
        ? clamp(window.scrollY / (window.innerHeight * STITCH_SPAN), 0, 1)
        : 0;
    eased.current += (target - eased.current) * (reduced ? 1 : 0.12);
    const p = reduced ? 1 : eased.current;

    // ── Stitch in (or unpick) embroidery to match progress ──
    const want = Math.floor(p * ops.length);
    if (want > stitched.current) {
      for (let i = stitched.current; i < want; i++) ops[i].draw(ctx);
      stitched.current = want;
      texture.needsUpdate = true;
    } else if (want < stitched.current) {
      ctx.clearRect(0, 0, W, H);
      drawBase(ctx);
      for (let i = 0; i < want; i++) ops[i].draw(ctx);
      stitched.current = want;
      texture.needsUpdate = true;
    }

    // ── Cloth motion: settles flat as it is completed ──
    const fold = 1 - p;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const crease = Math.sin(x * 2.6) * 0.22 * fold;
      const ripple =
        Math.sin(x * 1.3 + t * 1.0) * 0.038 + Math.sin(y * 1.9 + t * 1.2) * 0.032;
      pos.setZ(i, crease + ripple);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    if (mesh.current) {
      mesh.current.rotation.x = -0.16 * fold + Math.sin(t * 0.3) * 0.02;
      mesh.current.rotation.y = Math.sin(t * 0.22) * 0.04;
    }
  });

  return (
    <mesh ref={mesh} geometry={geo} position={[0, 0.42, 0]}>
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.95}
        metalness={0}
      />
    </mesh>
  );
}

export default function ClothUnfold() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.25} color="#fffaf2" />
      <directionalLight position={[3, 4, 5]} intensity={0.42} color="#fff6e6" />
      <directionalLight position={[-4, -2, 2]} intensity={0.16} color="#ffe3bb" />
      <Cloth reduced={!!reduced} />
    </Canvas>
  );
}
