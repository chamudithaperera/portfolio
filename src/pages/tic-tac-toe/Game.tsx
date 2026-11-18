import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {Bloom, EffectComposer} from '@react-three/postprocessing';
import React, {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import * as THREE from 'three';
import {getConfig} from './constants';
import {BoardState, CellPlayer, MatchStats} from './types';
import {GameState} from './utils/helper';

interface GameProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  exitChat: (payload: Record<string, unknown>) => Promise<void>;
  gameStateRef: React.MutableRefObject<GameState>;
  board: BoardState;
  onTileClick: (index: number) => void;
  hoveredCell: number | null;
  setHoveredCell: (index: number | null) => void;
  winningLine: number[] | null;
  currentTurn: 'X' | 'O';
  isAITurn: boolean;
  camAngle: number;
  setCamAngle: React.Dispatch<React.SetStateAction<number>>;
  boardKey: number;
  stats: MatchStats;
}

// Module-level recyclable Three.js objects
const tempTarget = new THREE.Vector3(0, 0.4, 0);

// Winning combinations for 3x3
const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkWinner(board: BoardState): {
  winner: 'X' | 'O' | 'draw' | null;
  line: number[] | null;
} {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {winner: board[a], line: combo};
    }
  }
  if (board.every((cell) => cell !== null)) {
    return {winner: 'draw', line: null};
  }
  return {winner: null, line: null};
}

/** 3D Cross token for Player X */
function CrossPiece({
  position,
  isWinning,
}: {
  position: [number, number, number];
  isWinning: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const animProgress = useRef(0);

  useFrame(({clock}, delta) => {
    if (!groupRef.current) return;
    if (animProgress.current < 1) {
      // Instant snappy drop in ~0.08s
      animProgress.current = Math.min(1, animProgress.current + delta * 14);
      const t = animProgress.current;
      const dropY = (1 - t) * (1 - t) * 1.5;
      groupRef.current.position.y = position[1] + dropY;
      groupRef.current.scale.set(t, t, t);
    } else {
      groupRef.current.position.y = position[1];
      if (isWinning) {
        const pulse = Math.sin(clock.getElapsedTime() * 10) * 0.15;
        groupRef.current.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
        groupRef.current.rotation.y = clock.getElapsedTime() * 3;
      } else {
        groupRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Primary diagonal beam */}
      <mesh rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.28, 0.32]} />
        <meshStandardMaterial
          color={isWinning ? '#67e8f9' : '#00d2ff'}
          emissive={isWinning ? '#00f0ff' : '#0077b6'}
          emissiveIntensity={isWinning ? 1.6 : 0.6}
          roughness={0.15}
          metalness={0.7}
        />
      </mesh>
      {/* Secondary diagonal beam */}
      <mesh rotation={[0, -Math.PI / 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.28, 0.32]} />
        <meshStandardMaterial
          color={isWinning ? '#67e8f9' : '#00d2ff'}
          emissive={isWinning ? '#00f0ff' : '#0077b6'}
          emissiveIntensity={isWinning ? 1.6 : 0.6}
          roughness={0.15}
          metalness={0.7}
        />
      </mesh>
      {/* Center energy core gem */}
      <mesh position={[0, 0.05, 0]}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#38bdf8"
          emissiveIntensity={2.0}
        />
      </mesh>
    </group>
  );
}

/** 3D Ring token for AI Opponent O */
function RingPiece({
  position,
  isWinning,
}: {
  position: [number, number, number];
  isWinning: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const animProgress = useRef(0);

  useFrame(({clock}, delta) => {
    if (!groupRef.current) return;
    if (animProgress.current < 1) {
      // Instant snappy drop in ~0.08s
      animProgress.current = Math.min(1, animProgress.current + delta * 14);
      const t = animProgress.current;
      const dropY = (1 - t) * (1 - t) * 1.5;
      groupRef.current.position.y = position[1] + dropY;
      groupRef.current.scale.set(t, t, t);
    } else {
      groupRef.current.position.y = position[1];
      if (isWinning) {
        const pulse = Math.sin(clock.getElapsedTime() * 10) * 0.15;
        groupRef.current.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
        groupRef.current.rotation.y = -clock.getElapsedTime() * 3;
      } else {
        groupRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Torus ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.48, 0.15, 24, 36]} />
        <meshStandardMaterial
          color={isWinning ? '#fde047' : '#f59e0b'}
          emissive={isWinning ? '#f59e0b' : '#b45309'}
          emissiveIntensity={isWinning ? 1.6 : 0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Inner orb */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial
          color="#ffedd5"
          emissive="#fbbf24"
          emissiveIntensity={1.8}
        />
      </mesh>
    </group>
  );
}

/** Animated Robotic AI floating avatar above the board */
function FloatingAIAvatar({
  isThinking,
  currentTurn,
  winningLine,
}: {
  isThinking: boolean;
  currentTurn: 'X' | 'O';
  winningLine: number[] | null;
}) {
  const coreRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame(({clock}) => {
    if (!coreRef.current) return;
    const t = clock.getElapsedTime();
    // Bobbing hover animation
    const bob = Math.sin(t * 2.5) * 0.15;
    coreRef.current.position.y = 3.2 + bob;

    if (ringRef1.current) {
      ringRef1.current.rotation.x = t * (isThinking ? 4 : 1.2);
      ringRef1.current.rotation.y = t * 0.8;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -t * (isThinking ? 4.5 : 1.5);
      ringRef2.current.rotation.x = t * 0.6;
    }
  });

  const coreColor = isThinking ? '#f59e0b' : currentTurn === 'O' ? '#fbbf24' : '#38bdf8';

  return (
    <group ref={coreRef} position={[0, 3.2, -3.8]}>
      {/* AI Eye / Core */}
      <mesh castShadow>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={isThinking ? 2.5 : 1.2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      {/* Gyroscopic protective orbital rings */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[0.62, 0.03, 16, 32]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh ref={ringRef2}>
        <torusGeometry args={[0.78, 0.03, 16, 32]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* AI Beacon light */}
      <pointLight
        color={coreColor}
        intensity={isThinking ? 25 : 12}
        distance={6}
        decay={1.5}
      />
    </group>
  );
}

/** Individual 3D Board Cell Tile */
function BoardCell({
  index,
  position,
  cellValue,
  isHovered,
  isWinning,
  onClick,
  onPointerOver,
  onPointerOut,
  currentTurn,
  isAITurn,
}: {
  index: number;
  position: [number, number, number];
  cellValue: CellPlayer;
  isHovered: boolean;
  isWinning: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
  currentTurn: 'X' | 'O';
  isAITurn: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointerDownCoord = useRef<{x: number; y: number} | null>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const targetY = isHovered && !cellValue && !isAITurn ? position[1] + 0.12 : position[1];
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      0.25,
    );
  });

  return (
    <group position={position}>
      {/* Interactive Tile Mesh */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        receiveShadow
        castShadow
        onPointerDown={(e) => {
          e.stopPropagation();
          pointerDownCoord.current = {x: e.clientX, y: e.clientY};
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          if (pointerDownCoord.current) {
            const dist = Math.hypot(
              e.clientX - pointerDownCoord.current.x,
              e.clientY - pointerDownCoord.current.y,
            );
            // If it was a clean tap/click without dragging camera, trigger immediately
            if (dist < 8) {
              onClick();
            }
          }
          pointerDownCoord.current = null;
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onPointerOver();
          document.body.style.cursor = !cellValue && !isAITurn ? 'pointer' : 'default';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onPointerOut();
          document.body.style.cursor = 'default';
        }}>
        <boxGeometry args={[1.68, 0.35, 1.68]} />
        <meshStandardMaterial
          color={
            isWinning
              ? '#1e293b'
              : isHovered && !cellValue && !isAITurn
              ? '#1e293b'
              : '#0f172a'
          }
          emissive={
            isWinning
              ? '#38bdf8'
              : isHovered && !cellValue && !isAITurn
              ? '#0284c7'
              : '#0f172a'
          }
          emissiveIntensity={isWinning ? 1.0 : isHovered ? 0.6 : 0.1}
          roughness={0.25}
          metalness={0.65}
        />
      </mesh>

      {/* Glass border rim */}
      <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.74, 0.78, 4]} />
        <meshBasicMaterial
          color={isWinning ? '#38bdf8' : isHovered ? '#00e5ff' : '#334155'}
          wireframe
        />
      </mesh>

      {/* Hologram Hover Preview */}
      {isHovered && !cellValue && !isAITurn && (
        <group position={[0, 0.28, 0]}>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[1.2, 0.1, 0.2]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.35}
              wireframe
            />
          </mesh>
          <mesh rotation={[0, -Math.PI / 4, 0]}>
            <boxGeometry args={[1.2, 0.1, 0.2]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.35}
              wireframe
            />
          </mesh>
        </group>
      )}

      {/* Placed Token */}
      {cellValue === 'X' && (
        <CrossPiece
          position={[0, 0.24, 0]}
          isWinning={isWinning}
        />
      )}
      {cellValue === 'O' && (
        <RingPiece
          position={[0, 0.24, 0]}
          isWinning={isWinning}
        />
      )}
    </group>
  );
}

/** Laser strike beam connecting winning tokens */
function WinningLaserLine({
  line,
  spacing,
}: {
  line: number[];
  spacing: number;
}) {
  const lineRef = useRef<THREE.Group>(null);

  // Compute start and end coordinates based on grid cell indices
  const getCellPos = (idx: number): [number, number, number] => {
    const row = Math.floor(idx / 3) - 1;
    const col = (idx % 3) - 1;
    return [col * spacing, 0.42, row * spacing];
  };

  const p1 = getCellPos(line[0]);
  const p2 = getCellPos(line[2]);

  const mid: [number, number, number] = [
    (p1[0] + p2[0]) / 2,
    (p1[1] + p2[1]) / 2,
    (p1[2] + p2[2]) / 2,
  ];

  const dx = p2[0] - p1[0];
  const dz = p2[2] - p1[2];
  const length = Math.hypot(dx, dz) + 0.9;
  const angle = Math.atan2(dx, dz);

  useFrame(({clock}) => {
    if (!lineRef.current) return;
    const pulse = 1 + Math.sin(clock.getElapsedTime() * 12) * 0.2;
    lineRef.current.scale.set(pulse, 1, 1);
  });

  return (
    <group ref={lineRef} position={mid} rotation={[0, angle + Math.PI / 2, 0]}>
      {/* Outer energy beam */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, length, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#00f0ff"
          emissiveIntensity={3.0}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Inner core line */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, length, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

/** Ambient floating arena dust motes */
function ArenaDustMotes({count = 45}: {count?: number}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    return Array.from({length: count}, () => ({
      x: (Math.random() - 0.5) * 16,
      y: 0.5 + Math.random() * 5,
      z: (Math.random() - 0.5) * 16,
      speed: 0.3 + Math.random() * 0.6,
      size: 0.04 + Math.random() * 0.05,
    }));
  }, [count]);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    particles.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(p.size, p.size, p.size);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [particles]);

  useFrame(({clock}) => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + i) * 0.4,
        p.y + Math.cos(t * p.speed * 0.8 + i) * 0.3,
        p.z + Math.cos(t * p.speed + i) * 0.4,
      );
      dummy.scale.set(p.size, p.size, p.size);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
    </instancedMesh>
  );
}

/** The main 3D Arena & Board Scene */
function BoardScene({
  board,
  onTileClick,
  hoveredCell,
  setHoveredCell,
  winningLine,
  currentTurn,
  isAITurn,
  camAngle,
  setCamAngle,
}: {
  board: BoardState;
  onTileClick: (index: number) => void;
  hoveredCell: number | null;
  setHoveredCell: (index: number | null) => void;
  winningLine: number[] | null;
  currentTurn: 'X' | 'O';
  isAITurn: boolean;
  camAngle: number;
  setCamAngle: React.Dispatch<React.SetStateAction<number>>;
}) {
  const {camera} = useThree();
  const spacing = getConfig('gridSpacing');

  // Smooth, fast camera orbit around board
  useFrame((_, delta) => {
    const camDist = 9.2;
    const camY = 7.8;
    const targetX = Math.sin(camAngle) * camDist;
    const targetZ = Math.cos(camAngle) * camDist;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 16 * delta);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, camY, 16 * delta);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 16 * delta);
    camera.lookAt(tempTarget);
  });

  return (
    <group>
      {/* Metallic pedestal base underneath board */}
      <mesh position={[0, -0.22, 0]} receiveShadow>
        <cylinderGeometry args={[4.4, 4.8, 0.44, 48]} />
        <meshStandardMaterial
          color="#0b0f19"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Glowing arena ring border */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.4, 4.48, 64]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>

      {/* 3x3 Board Grid Lines divider accents */}
      {[-spacing / 2, spacing / 2].map((coord, i) => (
        <group key={`divider-${i}`}>
          {/* Vertical divider */}
          <mesh position={[coord, 0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.22, spacing * 2.8]} />
            <meshStandardMaterial
              color="#334155"
              emissive="#1e293b"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          {/* Horizontal divider */}
          <mesh position={[0, 0.05, coord]} castShadow receiveShadow>
            <boxGeometry args={[spacing * 2.8, 0.22, 0.08]} />
            <meshStandardMaterial
              color="#334155"
              emissive="#1e293b"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* 9 Board Cells */}
      {board.map((cellValue, idx) => {
        const row = Math.floor(idx / 3) - 1;
        const col = (idx % 3) - 1;
        const posX = col * spacing;
        const posZ = row * spacing;

        const isWinning = winningLine ? winningLine.includes(idx) : false;

        return (
          <BoardCell
            key={`cell-${idx}`}
            index={idx}
            position={[posX, 0, posZ]}
            cellValue={cellValue}
            isHovered={hoveredCell === idx}
            isWinning={isWinning}
            onClick={() => onTileClick(idx)}
            onPointerOver={() => setHoveredCell(idx)}
            onPointerOut={() => {
              if (hoveredCell === idx) setHoveredCell(null);
            }}
            currentTurn={currentTurn}
            isAITurn={isAITurn}
          />
        );
      })}

      {/* Winning Laser Beam Strike */}
      {winningLine && (
        <WinningLaserLine line={winningLine} spacing={spacing} />
      )}

      {/* Emotive AI Robot Avatar hovering above opposite side */}
      <FloatingAIAvatar
        isThinking={isAITurn}
        currentTurn={currentTurn}
        winningLine={winningLine}
      />

      {/* Atmospheric dust motes */}
      <ArenaDustMotes count={50} />

      {/* Deep stadium dark floor */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[60, 0.5, 60]} />
        <meshStandardMaterial color="#05070d" roughness={0.7} metalness={0.3} />
      </mesh>
    </group>
  );
}

/** Error boundary component for WebGL safety */
class CanvasErrorBoundary extends Component<
  {children: React.ReactNode},
  {hasError: boolean}
> {
  state = {hasError: false};
  static getDerivedStateFromError() {
    return {hasError: true};
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-300 p-6 text-center text-sm">
          3D graphics context unavailable on this device.
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Main Game component rendering Canvas, 3-point lighting rig, and game elements.
 */
export function Game({
  gameState,
  setGameState,
  board,
  onTileClick,
  hoveredCell,
  setHoveredCell,
  winningLine,
  currentTurn,
  isAITurn,
  camAngle,
  setCamAngle,
  boardKey,
  stats,
}: GameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);

  // Pointer drag controls to orbit camera smoothly across mobile touch & PC mouse
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    setCamAngle((prev) => prev - deltaX * 0.012);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="w-full h-full canvas-wrapper relative touch-none select-none">
      <CanvasErrorBoundary>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{
            fov: getConfig('fov'),
            near: 0.1,
            far: 100,
            position: [0, 8, 8],
          }}
          scene={{
            background: new THREE.Color(getConfig('backgroundColor')),
          }}>
          <Suspense fallback={null}>
            {/* 3-Point Lighting Rig */}
            <ambientLight
              color={getConfig('ambientColor')}
              intensity={getConfig('ambientIntensity')}
            />
            <directionalLight
              position={[8, 16, 10]}
              intensity={getConfig('sunIntensity')}
              color={getConfig('sunColor')}
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-camera-near={0.5}
              shadow-camera-far={40}
              shadow-camera-left={-8}
              shadow-camera-right={8}
              shadow-camera-top={8}
              shadow-camera-bottom={-8}
            />
            <hemisphereLight
              color={getConfig('hemiSkyColor')}
              groundColor={getConfig('hemiGroundColor')}
              intensity={getConfig('hemiIntensity')}
            />

            {/* Board 3D Scene */}
            <BoardScene
              key={boardKey}
              board={board}
              onTileClick={onTileClick}
              hoveredCell={hoveredCell}
              setHoveredCell={setHoveredCell}
              winningLine={winningLine}
              currentTurn={currentTurn}
              isAITurn={isAITurn}
              camAngle={camAngle}
              setCamAngle={setCamAngle}
            />

            {/* Post-Processing Bloom for Neon Markers */}
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.8}
                luminanceSmoothing={0.9}
                intensity={0.65}
                mipmapBlur
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
