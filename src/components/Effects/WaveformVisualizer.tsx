'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import * as Tone from 'tone';

// VOXEL GRID CONFIG
const GRID_SIZE = 32; // 32x32 Grid
const SPACING = 0.6; // Space between voxels

function PixelTerrain() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const count = GRID_SIZE * GRID_SIZE;

    // We use a "Waveform" or "FFT" history buffer
    // Tone Generic Analyser doesn't give history, so we simulate scrolling
    const analyser = useMemo(() => {
        const a = new Tone.Analyser('fft', 32);
        a.smoothing = 0.6;
        Tone.Destination.connect(a);
        return a;
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    // History buffer: [row][col_freq]
    // We store height values for the grid
    // Row 0 is newest (front), Row 31 is oldest (back)
    const historyRef = useRef<number[][]>(
        Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0))
    );

    useFrame(() => {
        if (!meshRef.current) return;

        const values = analyser.getValue(); // Float32Array of dB values size 32

        // 1. Shift History Back
        // Move row 0 -> 1, 1 -> 2 ...
        for (let r = GRID_SIZE - 1; r > 0; r--) {
            for (let c = 0; c < GRID_SIZE; c++) {
                historyRef.current[r][c] = historyRef.current[r - 1][c];
            }
        }

        // 2. Update Row 0 with new Data
        if (values instanceof Float32Array) {
            for (let c = 0; c < GRID_SIZE; c++) {
                // Map frequency data to columns
                // We mirror it for symmetry? Or just spread.
                // Let's just map 0-32 directly since grid is 32 wide.
                const db = values[c];
                // Convert dB to height (0 to 10)
                // dB range -100 to -10
                let h = Math.max(0, (db + 80) / 8);
                // Add some noise/randomness for "glitch" feel if silent
                if (h < 0.1) h = 0.1;
                historyRef.current[0][c] = h;
            }
        }

        // 3. Render Instanced Mesh
        let i = 0;
        for (let r = 0; r < GRID_SIZE; r++) { // Z axis
            for (let c = 0; c < GRID_SIZE; c++) { // X axis
                const height = historyRef.current[r][c];

                // Position centered
                // X: centered
                const x = (c - GRID_SIZE / 2) * SPACING;
                // Z: from front (0) to back (-dist)
                const z = r * SPACING - (GRID_SIZE * SPACING) / 2;

                // Y: height based. Base is at -5
                dummy.position.set(x, (height * 0.5) - 4, z); // Scale from center
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
                color="#CCFF00"
                emissive="#CCFF00"
                emissiveIntensity={1.5}
                roughness={0.1}
                metalness={0.8}
            />
        </instancedMesh>
    );
}

function GridFloor() {
    return (
        <gridHelper
            args={[50, 50, '#333', '#111']}
            position={[0, -4, 0]}
        />
    );
}

export default function WaveformVisualizer() {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 8, 15], fov: 60, rotation: [-0.4, 0, 0] }}>
                <color attach="background" args={['#000']} />

                {/* Retro lighting setup */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#FFF" />
                <pointLight position={[-10, 5, 0]} intensity={2} color="#CCFF00" distance={20} />

                <PixelTerrain />
                <GridFloor />

                {/* Fog for depth fading */}
                <fog attach="fog" args={['#000', 10, 30]} />
            </Canvas>
        </div>
    );
}
