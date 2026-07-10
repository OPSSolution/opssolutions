import { useRef, useEffect } from "react";
import * as THREE from "three";

/**
 * HeroCanvas — imperatively-managed Three.js WebGL scene.
 * Renders floating wireframe geometries, a star-field, and
 * a mouse-driven camera tilt. Sits behind the hero content (z-index 1).
 */
export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth || window.innerWidth;
    const H = el.clientHeight || window.innerHeight;

    // ── Renderer ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 300);
    camera.position.z = 9;

    // ── Lighting ──────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const green = new THREE.PointLight(0xb9ff4b, 3.5, 60);
    green.position.set(8, 8, 6);
    scene.add(green);
    const white = new THREE.PointLight(0xffffff, 0.6, 60);
    white.position.set(-8, -4, 4);
    scene.add(white);

    // ── Star-field ────────────────────────────────────────────────────
    const starCount = 2800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 120;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.07,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
      })
    );
    scene.add(stars);

    // ── Helpers ───────────────────────────────────────────────────────
    type ShapeEntry = {
      mesh: THREE.Mesh;
      speed: number;
      rotX: number;
      rotY: number;
      originY: number;
      floatAmp: number;
      floatPhase: number;
    };
    const shapes: ShapeEntry[] = [];

    const makeAccentMat = (opacity = 0.28) =>
      new THREE.MeshStandardMaterial({
        color: 0xb9ff4b,
        wireframe: true,
        transparent: true,
        opacity,
        emissive: new THREE.Color(0xb9ff4b),
        emissiveIntensity: 0.55,
      });

    const addShape = (
      geo: THREE.BufferGeometry,
      pos: [number, number, number],
      speed: number,
      rotX: number,
      rotY: number,
      opacity = 0.28,
      floatAmp = 0.4,
      floatPhase = 0
    ) => {
      const mesh = new THREE.Mesh(geo, makeAccentMat(opacity));
      mesh.position.set(...pos);
      scene.add(mesh);
      shapes.push({ mesh, speed, rotX, rotY, originY: pos[1], floatAmp, floatPhase });
    };

    // Large icosahedron — right side, deep back
    addShape(new THREE.IcosahedronGeometry(2.2, 1), [5.5, 1.5, -5], 0.65, 1, 1, 0.22, 0.5, 0);
    // Torus — left side
    addShape(new THREE.TorusGeometry(1.6, 0.38, 8, 22), [-6, -0.8, -6], 0.45, -1, 1, 0.19, 0.35, 1.2);
    // Octahedron — lower-right
    addShape(new THREE.OctahedronGeometry(1.1, 0), [3.2, -3.8, -3.5], 0.95, 1, -1, 0.32, 0.55, 2.4);
    // Box — upper-left back
    addShape(new THREE.BoxGeometry(1.6, 1.6, 1.6), [-3.8, 3.2, -7], 0.38, -1, -1, 0.16, 0.3, 0.7);
    // Central torus knot — middle depth
    addShape(new THREE.TorusKnotGeometry(1.3, 0.32, 64, 8), [0.5, 0.2, -6], 0.5, 1, 1, 0.17, 0.6, 1.8);
    // Small dodecahedron — accent point
    addShape(new THREE.DodecahedronGeometry(0.8, 0), [-1.5, -2.5, -2.5], 1.1, -1, 1, 0.35, 0.3, 3.1);

    // ── Subtle grid plane (depth floor) ─────────────────────────────
    const gridHelper = new THREE.GridHelper(40, 20, 0xb9ff4b, 0xb9ff4b);
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.04;
    gridHelper.position.set(0, -6, -4);
    gridHelper.rotation.x = Math.PI * 0.08;
    scene.add(gridHelper);

    // ── Mouse tracking ────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 3.2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 1.6;
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

      // Rotate star-field slowly
      stars.rotation.y = t * 0.018;
      stars.rotation.x = t * 0.006;

      // Float & rotate each shape
      shapes.forEach(({ mesh, speed, rotX, rotY, originY, floatAmp, floatPhase }) => {
        mesh.rotation.x += 0.0035 * speed * rotX;
        mesh.rotation.y += 0.005 * speed * rotY;
        mesh.position.y = originY + Math.sin(t * 0.38 * speed + floatPhase) * floatAmp;
      });

      // Subtle grid pulse
      const gMat = gridHelper.material as THREE.Material;
      gMat.opacity = 0.03 + Math.sin(t * 0.4) * 0.01;

      // Smooth camera drift towards mouse
      camera.position.x += (mouse.x - camera.position.x) * 0.038;
      camera.position.y += (mouse.y - camera.position.y) * 0.038;
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
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}