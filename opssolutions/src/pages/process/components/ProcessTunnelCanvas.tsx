import { useRef, useEffect } from "react";
import * as THREE from "three";

/**
 * ProcessTunnelCanvas
 *
 * A fixed full-screen Three.js canvas that renders a 3D depth tunnel.
 * The camera advances through the tunnel as the user scrolls down the page,
 * giving a cinematic "flying through a corridor" feeling behind the step cards.
 *
 * Five brighter "waypoint" rings correspond to the five process phases.
 */
export default function ProcessTunnelCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    // ── Renderer ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(72, W / H, 0.1, 300);
    camera.position.set(0, 0, 5);

    // ── Lights ────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.05));
    const frontLight = new THREE.PointLight(0xb9ff4b, 2, 30);
    scene.add(frontLight);

    // ── Tunnel rings ──────────────────────────────────────────────────
    const RING_COUNT = 80;
    const RING_SPACING = 4.5;
    // Waypoints at the 5 process phase positions (rings 8, 22, 36, 50, 64)
    const waypointIndices = new Set([8, 22, 36, 50, 64]);

    type RingEntry = { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; z: number; isWaypoint: boolean };
    const rings: RingEntry[] = [];

    for (let i = 0; i < RING_COUNT; i++) {
      const isWaypoint = waypointIndices.has(i);
      const radius = isWaypoint ? 4.2 : 3.2 + Math.sin(i * 0.45) * 0.5;
      const tube   = isWaypoint ? 0.07 : 0.035;

      const mat = new THREE.MeshBasicMaterial({
        color: 0xb9ff4b,
        transparent: true,
        opacity: isWaypoint ? 0.45 : 0.1,
      });
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 48), mat);
      const z = -i * RING_SPACING;
      mesh.position.z = z;
      // Slight random tilt for organic feel
      mesh.rotation.x = (Math.random() - 0.5) * 0.12;
      mesh.rotation.y = (Math.random() - 0.5) * 0.12;
      scene.add(mesh);
      rings.push({ mesh, mat, z, isWaypoint });
    }

    // ── Spine (dashed line through tunnel centre) ─────────────────────
    const spinePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= RING_COUNT; i++) {
      spinePoints.push(new THREE.Vector3(0, 0, -i * RING_SPACING));
    }
    const spineGeo = new THREE.BufferGeometry().setFromPoints(spinePoints);
    const spine = new THREE.Line(
      spineGeo,
      new THREE.LineBasicMaterial({ color: 0xb9ff4b, transparent: true, opacity: 0.06 })
    );
    scene.add(spine);

    // ── Star field ────────────────────────────────────────────────────
    const STAR_COUNT = 2000;
    const starPos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist  = 6 + Math.random() * 10; // outside the tunnel
      starPos[i * 3]     = Math.cos(angle) * dist;
      starPos[i * 3 + 1] = Math.sin(angle) * dist;
      starPos[i * 3 + 2] = -Math.random() * RING_COUNT * RING_SPACING;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.45, sizeAttenuation: true })
    );
    scene.add(stars);

    // ── Floating accent particles inside tunnel ───────────────────────
    const FLOAT_COUNT = 300;
    const floatPos = new Float32Array(FLOAT_COUNT * 3);
    for (let i = 0; i < FLOAT_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r     = Math.random() * 2.5;
      floatPos[i * 3]     = Math.cos(angle) * r;
      floatPos[i * 3 + 1] = Math.sin(angle) * r;
      floatPos[i * 3 + 2] = -Math.random() * RING_COUNT * RING_SPACING;
    }
    const floatGeo = new THREE.BufferGeometry();
    floatGeo.setAttribute("position", new THREE.BufferAttribute(floatPos, 3));
    const floatParticles = new THREE.Points(
      floatGeo,
      new THREE.PointsMaterial({ color: 0xb9ff4b, size: 0.05, transparent: true, opacity: 0.3, sizeAttenuation: true })
    );
    scene.add(floatParticles);

    // ── Scroll tracking ───────────────────────────────────────────────
    let scrollProgress = 0;
    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = window.scrollY / maxScroll;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Resize ────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation ─────────────────────────────────────────────────────
    let animId = 0;
    const clock = new THREE.Clock();
    let camZ = 5;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Scroll-driven camera travel
      const targetZ = 5 - scrollProgress * (RING_COUNT - 5) * RING_SPACING * 0.92;
      camZ += (targetZ - camZ) * 0.06;
      camera.position.z = camZ;

      // Subtle sway
      camera.position.x = Math.sin(t * 0.18) * 0.22;
      camera.position.y = Math.cos(t * 0.13) * 0.15;
      camera.lookAt(camera.position.x * 0.2, camera.position.y * 0.2, camZ - 12);

      // Ring pulse + slow spin
      rings.forEach(({ mesh, mat, z, isWaypoint }, i) => {
        const distToCamera = Math.abs(z - camZ);
        const proximity = Math.max(0, 1 - distToCamera / 14);
        const baseOpacity = isWaypoint ? 0.42 : 0.08;
        mat.opacity = baseOpacity + proximity * (isWaypoint ? 0.4 : 0.22) + Math.sin(t * 0.6 + i * 0.25) * 0.03;
        mesh.rotation.z += (isWaypoint ? 0.004 : 0.002) * (i % 2 === 0 ? 1 : -1);
      });

      // Move front light with camera
      frontLight.position.z = camZ + 5;
      frontLight.intensity = 2 + Math.sin(t * 0.9) * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}