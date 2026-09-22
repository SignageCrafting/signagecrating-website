import { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';

/* ──────────────────────────────────────────────
   Stage 0 — "The Shell" (Hero Icosahedron)
   ────────────────────────────────────────────── */
function TheShell() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    if (innerRef.current) {
      const s = Math.sin(state.clock.elapsedTime * 0.8) * 0.075 + 1.0;
      innerRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={groupRef} position={[4, 0, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.8, 0]} />
        <meshPhysicalMaterial
          transmission={0.95}
          thickness={1.0}
          roughness={0.15}
          ior={1.5}
          clearcoat={1.0}
          color="#ffffff"
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────
   Stage 1 — "The Rings" (Three Intersecting Tori)
   ────────────────────────────────────────────── */
function TheRings() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00f3ff',
        emissive: '#00f3ff',
        emissiveIntensity: 2.0,
        toneMapped: false,
      }),
    []
  );

  useFrame((_, delta) => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.8;
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.6;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 1.0;
  });

  return (
    <group ref={groupRef} position={[4, 0, 0]}>
      <mesh ref={ring1Ref} material={material} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.2, 0.04, 64, 200]} />
      </mesh>
      <mesh ref={ring2Ref} material={material} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.04, 64, 200]} />
      </mesh>
      <mesh ref={ring3Ref} material={material} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.2, 0.04, 64, 200]} />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────
   Stage 2 — "The Monolith" (Box + Grid Floor)
   ────────────────────────────────────────────── */
function TheMonolith() {
  const groupRef = useRef<THREE.Group>(null);
  const boxRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (boxRef.current) {
      boxRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[4, 0, 0]}>
      <RoundedBox
        ref={boxRef}
        args={[1.0, 3.0, 0.6]}
        radius={0.02}
        smoothness={4}
      >
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={1.5}
        />
      </RoundedBox>
      <Grid
        position={[0, -2, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#00f3ff"
        sectionSize={2.0}
        sectionThickness={1.0}
        sectionColor="#00f3ff"
        fadeDistance={15}
        fadeStrength={1}
        infiniteGrid
      />
    </group>
  );
}

/* ──────────────────────────────────────────────
   Stage 3 — "The Tiers" (Stacked Floating Plates)
   ────────────────────────────────────────────── */
function TheTiers() {
  const groupRef = useRef<THREE.Group>(null);
  const tier1Ref = useRef<THREE.Mesh>(null);
  const tier2Ref = useRef<THREE.Mesh>(null);
  const tier3Ref = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0a0a',
        metalness: 0.7,
        roughness: 0.3,
        emissive: '#00f3ff',
        emissiveIntensity: 0.3,
      }),
    []
  );

  useFrame((state) => {
    if (tier1Ref.current) {
      tier1Ref.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 0.7) * 0.06;
    }
    if (tier2Ref.current) {
      tier2Ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + 1.0) * 0.06;
    }
    if (tier3Ref.current) {
      tier3Ref.current.position.y = -0.8 + Math.sin(state.clock.elapsedTime * 0.3 + 2.0) * 0.06;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef} position={[4, 0, 0]}>
      <mesh ref={tier1Ref} material={material} position={[0, 0.8, 0]}>
        <boxGeometry args={[1.0, 0.1, 1.0]} />
      </mesh>
      <mesh ref={tier2Ref} material={material} position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.1, 1.8]} />
      </mesh>
      <mesh ref={tier3Ref} material={material} position={[0, -0.8, 0]}>
        <boxGeometry args={[2.6, 0.1, 2.6]} />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────
   HomeStageScene — Switches between 4 stages
   ────────────────────────────────────────────── */
function HomeStageScene({ stage }: { stage: number }) {
  const [currentStage, setCurrentStage] = useState(stage);
  const [displayStage, setDisplayStage] = useState(stage);

  useEffect(() => {
    if (stage !== currentStage) {
      setCurrentStage(stage);
      // Small delay to allow state to settle, then update displayed stage
      const timeout = setTimeout(() => {
        setDisplayStage(stage);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [stage, currentStage]);

  return (
    <group>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} />
      <fog attach="fog" args={['#0a0a0a', 5, 15]} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={false}
      />
      <group key={displayStage}>
        {displayStage === 0 && <TheShell />}
        {displayStage === 1 && <TheRings />}
        {displayStage === 2 && <TheMonolith />}
        {displayStage === 3 && <TheTiers />}
      </group>
    </group>
  );
}

/* ──────────────────────────────────────────────
   ServiceNodesScene — /services page
   ────────────────────────────────────────────── */
function ServiceNodesScene() {
  const node1Ref = useRef<THREE.Mesh>(null);
  const node2Ref = useRef<THREE.Mesh>(null);
  const node3GroupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  useFrame((state) => {
    const refs = [node1Ref, node2Ref];
    refs.forEach((ref, i) => {
      if (ref.current) {
        ref.current.rotation.y += 0.005 * (i + 1);
        ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.1;
        const targetScale = hoveredNode === i ? 1.15 : 1.0;
        ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      }
    });
    if (node3GroupRef.current) {
      node3GroupRef.current.rotation.y += 0.015;
      node3GroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2 + 2) * 0.1;
      const targetScale = hoveredNode === 2 ? 1.15 : 1.0;
      node3GroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} />
      <fog attach="fog" args={['#0a0a0a', 5, 15]} />
      <OrbitControls enableZoom={false} enablePan={false} />

      {/* Node 1: TorusKnot — Neon Systems */}
      <mesh
        ref={node1Ref}
        position={[-3, 0, 0]}
        onPointerOver={() => setHoveredNode(0)}
        onPointerOut={() => setHoveredNode(null)}
      >
        <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />
        <meshStandardMaterial
          color="#00f3ff"
          emissive="#00f3ff"
          emissiveIntensity={hoveredNode === 0 ? 3.0 : 1.5}
          toneMapped={false}
        />
      </mesh>

      {/* Node 2: RoundedBox — Signboards */}
      <mesh
        ref={node2Ref}
        position={[0, 0, 0]}
        onPointerOver={() => setHoveredNode(1)}
        onPointerOut={() => setHoveredNode(null)}
      >
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.15}
          emissive={hoveredNode === 1 ? '#00f3ff' : '#000000'}
          emissiveIntensity={hoveredNode === 1 ? 0.5 : 0}
        />
      </mesh>

      {/* Node 3: Stacked Boxes — Logistics */}
      <group
        ref={node3GroupRef}
        position={[3, 0, 0]}
        onPointerOver={() => setHoveredNode(2)}
        onPointerOut={() => setHoveredNode(null)}
      >
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.0, 0.15, 1.0]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.7}
            roughness={0.3}
            emissive="#00f3ff"
            emissiveIntensity={hoveredNode === 2 ? 0.8 : 0.3}
          />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.4, 0.15, 1.4]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.7}
            roughness={0.3}
            emissive="#00f3ff"
            emissiveIntensity={hoveredNode === 2 ? 0.8 : 0.3}
          />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[1.8, 0.15, 1.8]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.7}
            roughness={0.3}
            emissive="#00f3ff"
            emissiveIntensity={hoveredNode === 2 ? 0.8 : 0.3}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ──────────────────────────────────────────────
   WorkScene — /work page (subtle ambient)
   ────────────────────────────────────────────── */
function WorkScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <fog attach="fog" args={['#0a0a0a', 5, 15]} />
      <mesh ref={meshRef} position={[0, 0, -3]}>
        <icosahedronGeometry args={[2, 0]} />
        <meshBasicMaterial
          color="#00f3ff"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────
   DefaultScene — Fallback ambient
   ────────────────────────────────────────────── */
function DefaultScene() {
  return (
    <group>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
      <fog attach="fog" args={['#0a0a0a', 5, 15]} />
    </group>
  );
}

/* ──────────────────────────────────────────────
   Main Controller
   ────────────────────────────────────────────── */
export default function Scene3DController() {
  const currentRoute = useAppStore((s) => s.currentRoute);
  const activeStage = useAppStore((s) => s.activeStage);

  return (
    <>
      {currentRoute === '/' && <HomeStageScene stage={activeStage} />}
      {currentRoute === '/services' && <ServiceNodesScene />}
      {currentRoute === '/work' && <WorkScene />}
      {currentRoute !== '/' && currentRoute !== '/services' && currentRoute !== '/work' && <DefaultScene />}
    </>
  );
}
