import { useRef, useEffect } from "react";
import * as THREE from "three";

/**
 * FeatureCrystalCanvas
 *
 * A Three.js scene showing a glowing rotating torus-knot crystal as the
 * centrepiece of the Features section. Orbiting icosahedra and a particle
 * ring add depth. Mouse position subtly tilts the camera.
 */
export default function FeatureCrystalCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth || 800;
    const H = el.clientHeight || 420;

    // ── Renderer ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.z = 7;

    // ── Lights ────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const glow = new THREE.PointLight(0xb9ff4b, 5, 25);
    glow.position.set(0, 0, 3);
    scene.add(glow);
    const fill = new THREE.PointLight(0xffffff, 0.4, 20);
    fill.position.set(-5, 5, 2);
    scene.add(fill);
    const rim = new THREE.PointLight(0xb9ff4b, 1.5, 18);
    rim.position.set(4, -3, -2);
    scene.add(rim);

    // ── Main torus-knot crystal (wireframe) ───────────────────────────
    const knotGeo = new THREE.TorusKnotGeometry(1.6, 0.48, 128, 16);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0xb9ff4b,
      wireframe: true,
      transparent: true,
      opacity: 0.52,
      emissive: new THREE.Color(0xb9ff4b),
      emissiveIntensity: 0.65,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);

    // Solid ghost layer (barely visible volume)
    const ghostMat = new THREE.MeshStandardMaterial({
      color: 0xb9ff4b,
      transparent: true,
      opacity: 0.06,
      emissive: new THREE.Color(0xb9ff4b),
      emissiveIntensity: 0.25,
    });
    const ghost = new THREE.Mesh(knotGeo, ghostMat);
    ghost.scale.setScalar(0.97);
    scene.add(ghost);

    // ── Orbiting icosahedra ───────────────────────────────────────────
    type Orbiter = {
      mesh: THREE.Mesh;
      angle: number;
      radius: number;
      speed: number;
      yBase: number;
      yAmp: number;
      yPhase: number;
    };
    const orbiters: Orbiter[] = [];

    for (let i = 0; i < 6; i++) {
      const size = 0.1 + Math.random() * 0.14;
      const mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(size, 0),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          wireframe: true,
          transparent: true,
          opacity: 0.35 + Math.random() * 0.2,
          emissive: new THREE.Color(0xb9ff4b),
          emissiveIntensity: 0.5,
        })
      );
      scene.add(mesh);
      orbiters.push({
        mesh,
        angle: (i / 6) * Math.PI * 2,
        radius: 2.9 + Math.random() * 0.6,
        speed: 0.38 + Math.random() * 0.32,
        yBase: (Math.random() - 0.5) * 1.8,
        yAmp: 0.25 + Math.random() * 0.35,
        yPhase: Math.random() * Math.PI * 2,
      });
    }

    // ── Particle ring ─────────────────────────────────────────────────
    const PARTICLE_COUNT = 600;
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const r = 3.2 + (Math.random() - 0.5) * 1.8;
      pPos[i * 3]     = Math.cos(angle) * r;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      pPos[i * 3 + 2] = Math.sin(angle) * r;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0xb9ff4b,
        size: 0.045,
        transparent: true,
        opacity: 0.38,
        sizeAttenuation: true,
      })
    );
    scene.add(particles);

    // ── Mouse tracking ────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      if (e.clientX < rect.left - 100 || e.clientX > rect.right + 100) return;
      mouse.x = ((e.clientX - rect.left) / W - 0.5) * 2;
      mouse.y = -((e.clientY - rect.top) / H - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── Resize ────────────────────────────────────────────────────────
    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────────────
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotate crystal
      knot.rotation.x = t * 0.17;
      knot.rotation.y = t * 0.24 + mouse.x * 0.25;
      ghost.rotation.x = knot.rotation.x;
      ghost.rotation.y = knot.rotation.y;

      // Pulse opacity + glow
      knotMat.opacity = 0.42 + Math.sin(t * 1.1) * 0.1;
      glow.intensity = 4.5 + Math.sin(t * 1.4) * 1.0;

      // Orbit icosahedra
      orbiters.forEach((o) => {
        o.angle += 0.007 * o.speed;
        o.mesh.position.set(
          Math.cos(o.angle) * o.radius,
          o.yBase + Math.sin(t * 0.5 + o.yPhase) * o.yAmp,
          Math.sin(o.angle) * o.radius
        );
        o.mesh.rotation.x += 0.022;
        o.mesh.rotation.y += 0.018;
      });

      // Spin particle ring
      particles.rotation.y = t * 0.055;
      particles.rotation.x = Math.sin(t * 0.12) * 0.18;

      // Mouse-driven camera tilt
      camera.position.x += (mouse.x * 1.8 - camera.position.x) * 0.032;
      camera.position.y += (mouse.y * 0.9 - camera.position.y) * 0.032;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="w-full"
      style={{ height: 400 }}
    />
  );
}