'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import * as Tone from 'tone';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Float, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

type VisualizerMode = 'wave' | 'void' | 'matrix';

// --- VISUALIZATION COMPONENTS ---

function VoidVisualizer({ analyser }: { analyser: Tone.Analyser }) {
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const count = 64;
    const radius = 4;

    // Setup temp objects for matrix calculation
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const colors = useMemo(() => new Float32Array(count * 3), [count]);
    const color1 = new THREE.Color("#22d3ee"); // Cyan
    const color2 = new THREE.Color("#a855f7"); // Purple

    useFrame(() => {
        if (!meshRef.current || !analyser) return;
        const values = analyser.getValue();
        if (!values || values.length === 0) return;

        // Type guard for Float32Array (FFT data)
        const data = values instanceof Float32Array ? values : new Float32Array(count).fill(0);

        // Animate instances
        for (let i = 0; i < count; i++) {
            const val = data[i % data.length]; // DB value approx -100 to 0
            const normalized = Math.max(0, (val + 100) / 100); // 0 to 1

            // Circular arrangement
            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            // Height based on audio
            const h = 0.5 + Math.pow(normalized, 2) * 8;

            dummy.position.set(x, 0, z);
            dummy.rotation.y = -angle;
            dummy.scale.set(1, h, 1);
            dummy.updateMatrix();

            meshRef.current.setMatrixAt(i, dummy.matrix);

            // Dynamic color mixing based on height
            const mixedColor = color1.clone().lerp(color2, normalized);
            mixedColor.toArray(colors, i * 3);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

        // Slow rotation of entire ring
        meshRef.current.rotation.y += 0.002;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[0.2, 1, 0.2]} />
            <meshStandardMaterial
                color="#ffffff"
                emissive="#4f46e5"
                emissiveIntensity={0.5}
                toneMapped={false}
            />
        </instancedMesh>
    );
}

function WaveVisualizer({ analyser }: { analyser: Tone.Analyser }) {
    const ref = useRef<THREE.Points>(null!);
    const count = 128;

    // Positions
    const positions = useMemo(() => new Float32Array(count * 3), [count]);

    useFrame((state) => {
        if (!ref.current || !analyser) return;
        const values = analyser.getValue();
        const data = values instanceof Float32Array ? values : new Float32Array(count).fill(0);

        const width = 16;
        const step = width / count;

        // FFT data is mostly low freq at start, spread spread it out
        for (let i = 0; i < count; i++) {
            const val = data[i % data.length];
            const normalized = Math.max(0, (val + 100) / 100);

            const x = (i * step) - (width / 2);
            // Waveform movement
            const time = state.clock.getElapsedTime();
            const y = Math.sin(i * 0.2 + time) * 0.5 + (normalized * 3);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = 0;
        }

        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    useEffect(() => {
        if (ref.current) {
            ref.current.geometry.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, 3)
            );
        }
    }, [count, positions]);

    return (
        <points ref={ref}>
            <bufferGeometry />
            <pointsMaterial
                size={0.15}
                color="#06b6d4"
                transparent
                opacity={0.8}
                sizeAttenuation={true}
            />
        </points>
    )
}

function MatrixVisualizer({ analyser }: { analyser: Tone.Analyser }) {
    // 3D Grid of particles that pulse
    const count = 10;
    // We will render count*count instances
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!meshRef.current || !analyser) return;
        const values = analyser.getValue();
        const data = values instanceof Float32Array ? values : new Float32Array(count).fill(0);

        let idx = 0;
        const spacing = 1.5;
        const offset = (count * spacing) / 2;

        // Usually FFT array is small (e.g. 64), we map it to grid
        const time = state.clock.getElapsedTime();

        for (let x = 0; x < count; x++) {
            for (let z = 0; z < count; z++) {
                // Map grid position to frequency index
                const freqIdx = Math.floor((x * z) / (count * count) * data.length);
                const val = data[freqIdx] || -100;
                const normalized = Math.max(0, (val + 100) / 100);

                const posX = x * spacing - offset;
                const posZ = z * spacing - offset;
                const posY = Math.sin(x * 0.5 + time) * Math.cos(z * 0.5 + time) + (normalized * 2);

                dummy.position.set(posX, posY, posZ);

                // Scale based on energy
                const s = 0.2 + (normalized * 0.8);
                dummy.scale.set(s, s, s);

                dummy.updateMatrix();
                meshRef.current.setMatrixAt(idx++, dummy.matrix);
            }
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count * count]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshNormalMaterial wireframe={true} />
        </instancedMesh>
    )
}

function Scene({ mode, analyser }: { mode: VisualizerMode, analyser: Tone.Analyser | null }) {
    if (!analyser) return null;

    return (
        <>
            {/* Dynamic Lights */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
            <pointLight position={[-10, 5, -10]} intensity={1} color="#22d3ee" />

            <group position={[0, -1, 0]}>
                {mode === 'void' && <VoidVisualizer analyser={analyser} />}
                {mode === 'wave' && <WaveVisualizer analyser={analyser} />}
                {mode === 'matrix' && <MatrixVisualizer analyser={analyser} />}
            </group>

            {/* Auto-rotate camera slightly for effect */}
            <OrbitControls
                autoRotate
                autoRotateSpeed={0.5}
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 2}
            />
        </>
    )
}

// --- MAIN COMPONENT ---

export const Visualizer = () => {
    const [mode, setMode] = useState<VisualizerMode>('void');
    const analyserRef = useRef<Tone.Analyser | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Init analyser - Ensure Tone is running or ready
        // We defer this slightly to ensure Context is ready
        const init = () => {
            try {
                if (analyserRef.current) return;
                analyserRef.current = new Tone.Analyser('fft', 64);
                // Connect Master (destination) to analyser
                Tone.Destination.connect(analyserRef.current);
                setIsReady(true);
            } catch (e) {
                console.warn("Visualizer init failed (likely AudioContext not started):", e);
            }
        };

        // Try init immediately
        init();

        // Also try on click/interaction implicitly if failed (handled by parent usually via start button)
        return () => {
            if (analyserRef.current) {
                // Don't dispose immediately if we want to persist, but for component cleanup:
                try {
                    // analyserRef.current.dispose(); 
                    // Actually Tone.js nodes should be managed carefully. 
                    // Disposing here breaks if we re-mount. 
                } catch (e) { }
            }
        }
    }, []);

    return (
        <div className="relative w-full h-full bg-black/50 group overflow-hidden">
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 2, 8], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
            >
                <Scene mode={mode} analyser={analyserRef.current} />
                <fog attach="fog" args={['#000000', 5, 20]} />
            </Canvas>

            {/* Controls Overlay */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                {(['wave', 'void', 'matrix'] as VisualizerMode[]).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`text-[9px] uppercase font-bold tracking-widest px-2 py-1 rounded backdrop-blur-sm border transition-all ${mode === m
                            ? 'bg-white/10 text-cyan-400 border-cyan-400/50'
                            : 'text-zinc-500 border-transparent hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            {/* Metadata Label */}
            <div className="absolute bottom-2 left-2 text-[9px] font-mono text-white/20 select-none pointer-events-none z-10">
                VISUAL_ENGINE_V3_GL :: MODE_{mode.toUpperCase()}
            </div>
        </div>
    );
};
