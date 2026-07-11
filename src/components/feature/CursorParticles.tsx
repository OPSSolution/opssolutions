import { useRef, useEffect } from "react";

/**
 * CursorParticles
 *
 * A full-screen canvas that renders a glowing particle trail following the
 * cursor. Each particle is drawn from a pre-rendered glow sprite (baked once
 * on an offscreen canvas) instead of constructing a radial gradient per
 * particle per frame — gradient construction is the expensive part of canvas
 * particle systems, so this keeps the per-frame draw loop to a single cheap
 * drawImage call per particle.
 *
 * Only active on non-touch (pointer) devices.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1 → 0
  decay: number; // life units per frame
  size: number;
}

const MAX_PARTICLES = 60;
const SPRITE_SIZE = 128; // px, offscreen sprite resolution

function makeGlowSprite(): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;
  const sctx = sprite.getContext("2d")!;
  const c = SPRITE_SIZE / 2;

  const g = sctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0, "rgba(41,171,226,1)");
  g.addColorStop(0.45, "rgba(41,171,226,0.4)");
  g.addColorStop(1, "rgba(41,171,226,0)");
  sctx.fillStyle = g;
  sctx.beginPath();
  sctx.arc(c, c, c, 0, Math.PI * 2);
  sctx.fill();

  // Bright core dot
  sctx.beginPath();
  sctx.arc(c, c, c * 0.14, 0, Math.PI * 2);
  sctx.fillStyle = "rgba(230,255,160,0.9)";
  sctx.fill();

  return sprite;
}

export default function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip on touch-only devices
    if (window.matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sprite = makeGlowSprite();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999, lastX: 0, lastY: 0 };

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - mouse.lastX;
      const dy = e.clientY - mouse.lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (particles.length >= MAX_PARTICLES) return;

      // Spawn count scales with speed (1 … 3)
      const count = Math.min(Math.floor(speed * 0.25) + 1, 3);
      for (let i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 6,
          y: mouse.y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.4 + dx * 0.12,
          vy: (Math.random() - 0.5) * 1.4 + dy * 0.12 - 0.4,
          life: 1,
          decay: 0.035 + Math.random() * 0.035,
          size: 2.5 + Math.random() * 4,
        });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    let animId = 0;

    const draw = () => {
      animId = requestAnimationFrame(draw);

      // Clear — fully transparent each frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (particles.length === 0) return;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.vy -= 0.028; // float upward
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Eased alpha
        const alpha = Math.pow(p.life, 1.4) * 0.8;
        const radius = p.size * Math.pow(p.life, 0.5) * 2.5;

        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, p.x - radius, p.y - radius, radius * 2, radius * 2);
      }
      ctx.globalAlpha = 1;
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none hidden md:block"
      style={{ zIndex: 9997 }}
    />
  );
}
