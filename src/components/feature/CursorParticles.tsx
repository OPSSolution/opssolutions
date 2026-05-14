import { useRef, useEffect } from "react";

/**
 * CursorParticles
 *
 * A full-screen canvas that renders a glowing particle trail following the
 * cursor. Each particle is a radial-gradient circle that fades out and drifts
 * slightly upward. Particles are spawned proportionally to cursor velocity so
 * fast sweeps produce dense trails, gentle movements leave delicate dots.
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

export default function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip on touch-only devices
    if (window.matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

      // Spawn count scales with speed (1 … 6)
      const count = Math.min(Math.floor(speed * 0.45) + 1, 6);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 6,
          y: mouse.y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.4 + dx * 0.12,
          vy: (Math.random() - 0.5) * 1.4 + dy * 0.12 - 0.4,
          life: 1,
          decay: 0.022 + Math.random() * 0.025,
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
        const radius = p.size * Math.pow(p.life, 0.5);

        // Radial glow gradient
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2.5);
        g.addColorStop(0, `rgba(185,255,75,${alpha})`);
        g.addColorStop(0.45, `rgba(185,255,75,${alpha * 0.4})`);
        g.addColorStop(1, `rgba(185,255,75,0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Bright core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,255,160,${alpha * 0.9})`;
        ctx.fill();
      }
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