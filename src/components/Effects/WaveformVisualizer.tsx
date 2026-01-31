'use client';

import { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import * as Tone from 'tone';

const GRID_SIZE = 32;
const SPACING = 0.6;

const PixelTerrain = memo(function PixelTerrain() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = GRID_SIZE * GRID_SIZE;

  const analyser = useMemo(() => {
    const a = new Tone.Analyser('fft', 32);
    a.smoothing = 0.6;
    Tone.Destination.connect(a);
    return a;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const historyRef = useRef<number[][]>(
    Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0))
  );

  useFrame(() => {
    if (!meshRef.current) return;

    const values = analyser.getValue();

    for (let r = GRID_SIZE - 1; r > 0; r--) {
      for (let c = 0; c < GRID_SIZE; c++) {
        historyRef.current[r][c] = historyRef.current[r - 1][c];
      }
    }

    if (values instanceof Float32Array) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const db = values[c];
        let h = Math.max(0, (db + 80) / 8);
        if (h < 0.1) h = 0.1;
        historyRef.current[0][c] = h;
      }
    }

    let i = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const height = historyRef.current[r][c];
        const x = (c - GRID_SIZE / 2) * SPACING;
        const z = r * SPACING - (GRID_SIZE * SPACING) / 2;

        dummy.position.set(x, (height * 0.5) - 4, z);
        dummy.scale.set(SPACING * 0.8, Math.max(0.1, height), SPACING * 0.8);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i++, dummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#1db954"
        emissive="#1db954"
        emissiveIntensity={1.2}
        roughness={0.2}
        metalness={0.7}
      />
    </instancedMesh>
  );
});

const GridFloor = memo(function GridFloor() {
  return (
    <gridHelper
      args={[50, 50, '#27272a', '#18181b']}
      position={[0, -4, 0]}
    />
  );
});

const WaveformVisualizer = memo(function WaveformVisualizer() {
  return (
    <div className="w-full h-full bg-black">
      <Canvas camera={{ position: [0, 8, 15], fov: 60, rotation: [-0.4, 0, 0] }}>
        <color attach="background" args={['#09090b']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-10, 5, 0]} intensity={1.5} color="#1db954" distance={20} />
        <PixelTerrain />
        <GridFloor />
        <fog attach="fog" args={['#09090b', 10, 30]} />
      </Canvas>
    </div>
  );
});

export default WaveformVisualizer;
