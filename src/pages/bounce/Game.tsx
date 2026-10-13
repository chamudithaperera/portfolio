import React, {useMemo, useRef, useEffect, useState} from 'react';
import * as THREE from 'three';
import {useFrame, useThree} from '@react-three/fiber';
import {
  RigidBody,
  CuboidCollider,
  BallCollider,
  RapierRigidBody,
} from '@react-three/rapier';
import {getConfig} from './constants';
import {
  Particle,
  LevelData,
  Position3D,
  GoldenEgg,
  GoldenKey,
  CheckpointData,
  BombHazard,
  SpikeHazard,
  LadderItem,
  SpringItem,
  RopeBridge,
  LiftElevator,
  GrassPlatform,
  SeasonTheme,
} from './types';
import {SEASONS, ALL_LEVELS} from './levels';
import {gameAudio} from './utils/helper';

const _targetCamPos = new THREE.Vector3();
const _camLookAt = new THREE.Vector3();

// Create canvas-baked circular repeating pattern texture matching the reference image's dark green patterned blocks
function createPatternTexture(baseColor = '#0e331b', patternColor = '#082513') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 128, 128);

  ctx.strokeStyle = patternColor;
  ctx.lineWidth = 4;

  const step = 32;
  for (let x = 0; x <= 128; x += step) {
    for (let y = 0; y <= 128; y += step) {
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

interface GameSceneProps {
  currentLevelIndex: number;
  inputRef: any;
  isPaused: boolean;
  keysCollectedCount: number;
  totalKeysRequired: number;
  onKeyCollected: (keyId: number, keysCollectedCount: number, totalKeys: number) => void;
  onEggCollected: (eggId: number, eggsCollectedCount: number, totalEggs: number) => void;
  onCheckpointReached: (checkpointId: number) => void;
  onPlayerDamaged: (cause: 'bomb' | 'spike' | 'liquid') => void;
  onDoorLockedAttempt: (remainingKeys: number) => void;
  onLevelComplete: () => void;
  onScoreAdd: (pts: number) => void;
  respawnTrigger: number;
}

export function GameScene({
  currentLevelIndex,
  inputRef,
  isPaused,
  keysCollectedCount,
  totalKeysRequired,
  onKeyCollected,
  onEggCollected,
  onCheckpointReached,
  onPlayerDamaged,
  onDoorLockedAttempt,
  onLevelComplete,
  onScoreAdd,
  respawnTrigger,
}: GameSceneProps) {
  const {camera} = useThree();
  const currentLevel: LevelData = ALL_LEVELS[currentLevelIndex] || ALL_LEVELS[0];
  const seasonTheme: SeasonTheme =
    SEASONS.find((s) => s.id === currentLevel.seasonId) || SEASONS[0];

  // Dynamic Level Item States
  const [eggs, setEggs] = useState<GoldenEgg[]>([]);
  const [keys, setKeys] = useState<GoldenKey[]>([]);
  const [checkpoints, setCheckpoints] = useState<CheckpointData[]>([]);
  const [bombs, setBombs] = useState<BombHazard[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  const orbBodyRef = useRef<RapierRigidBody>(null);
  const orbMeshRef = useRef<THREE.Group>(null);
  const squashRef = useRef(1.0);
  const prevJumpInputRef = useRef(false);
  const damageCooldownRef = useRef(0);
  const doorAttemptCooldownRef = useRef(0);
  const prevYVelRef = useRef(0);
  const activeCheckpointPosRef = useRef<Position3D>(currentLevel.spawnPoint);

  // Shared Pattern Texture
  const patternTexture = useMemo(
    () => createPatternTexture(seasonTheme.platformColor, seasonTheme.patternColor),
    [seasonTheme.platformColor, seasonTheme.patternColor]
  );

  // Initialize or Switch Level
  useEffect(() => {
    setEggs(currentLevel.eggs.map((e) => ({...e, collected: false})));
    setKeys(currentLevel.keys.map((k) => ({...k, collected: false})));
    setCheckpoints(
      currentLevel.checkpoints.map((cp, idx) => ({
        ...cp,
        activated: idx === 0,
      }))
    );
    setBombs(currentLevel.bombs.map((b) => ({...b, exploded: false})));
    setParticles([]);
    activeCheckpointPosRef.current = currentLevel.spawnPoint;
    damageCooldownRef.current = 0;
    prevJumpInputRef.current = false;

    if (orbBodyRef.current) {
      const sp = currentLevel.spawnPoint;
      orbBodyRef.current.setTranslation({x: sp[0], y: sp[1], z: sp[2]}, true);
      orbBodyRef.current.setLinvel({x: 0, y: 0, z: 0}, true);
      orbBodyRef.current.setAngvel({x: 0, y: 0, z: 0}, true);
    }
  }, [
    currentLevel.bombs,
    currentLevel.checkpoints,
    currentLevel.eggs,
    currentLevel.keys,
    currentLevel.spawnPoint,
    currentLevelIndex,
  ]);

  // Respawn at last checkpoint when damaged
  useEffect(() => {
    if (orbBodyRef.current) {
      const cp = activeCheckpointPosRef.current;
      orbBodyRef.current.setTranslation({x: cp[0], y: cp[1] + 0.6, z: 0}, true);
      orbBodyRef.current.setLinvel({x: 0, y: 0, z: 0}, true);
      squashRef.current = 1.0;
    }
  }, [respawnTrigger]);

  // Particle Spawner Helper
  const spawnSparkles = (x: number, y: number, z: number, color = '#fcd34d', count = 12, speedMult = 1) => {
    const newP: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = (2.2 + Math.random() * 3.5) * speedMult;
      newP.push({
        id: `${Date.now()}-${i}-${Math.random()}`,
        position: [x, y, z],
        velocity: [
          Math.cos(angle) * speed + (Math.random() - 0.5),
          Math.sin(angle) * speed + Math.random() * 2,
          (Math.random() - 0.5) * 2,
        ],
        life: 0.5 + Math.random() * 0.35,
        maxLife: 0.85,
        color,
        size: 0.14 + Math.random() * 0.1,
      });
    }
    setParticles((prev) => [...prev.slice(-40), ...newP]);
  };

  useFrame(({clock}, delta) => {
    if (isPaused) return;
    const dt = Math.min(delta, 0.033);
    const elapsedTime = clock.getElapsedTime();

    if (damageCooldownRef.current > 0) damageCooldownRef.current -= dt;
    if (doorAttemptCooldownRef.current > 0) doorAttemptCooldownRef.current -= dt;

    const orb = orbBodyRef.current;
    if (orb) {
      const trans = orb.translation();
      const linvel = orb.linvel();

      // Check Bottom Pit Hazard
      const pitY = -7.0;
      if (trans.y < pitY && damageCooldownRef.current <= 0) {
        damageCooldownRef.current = 0.8;
        gameAudio.playGeneralDamage();
        spawnSparkles(trans.x, pitY, 0, '#ef4444', 18, 1.4);
        onPlayerDamaged('liquid');
        return;
      }

      // Input read
      const actions = inputRef.current ? inputRef.current.actions : null;
      let moveX = 0;
      let moveYClimb = 0;
      const speed = getConfig('playerSpeed');

      if (actions) {
        if (actions.left) moveX -= 1;
        if (actions.right) moveX += 1;
        if (actions.up) moveYClimb += 1;
        if (actions.down) moveYClimb -= 1;
      }

      // Check Ladder Climbing interaction
      let isOnLadder = false;
      currentLevel.ladders.forEach((ladder) => {
        const dx = Math.abs(trans.x - ladder.position[0]);
        const dy = trans.y - ladder.position[1];
        if (dx < 0.9 && dy >= -0.5 && dy <= ladder.height) {
          isOnLadder = true;
        }
      });

      // Calculate instantaneous positions and velocities for moving lifts
      const activeLifts = currentLevel.lifts.map((lift) => {
        const t = elapsedTime * lift.speed;
        const progress = (Math.sin(t) + 1) / 2;
        const offset = progress * lift.travelDistance;
        const curX = lift.axis === 'x' ? lift.startPosition[0] + offset : lift.startPosition[0];
        const curY = lift.axis === 'y' ? lift.startPosition[1] + offset : lift.startPosition[1];
        const vy =
          lift.axis === 'y'
            ? (Math.cos(t) * lift.speed * lift.travelDistance) / 2
            : 0;
        return {
          ...lift,
          curX,
          curY,
          vy,
          platWidth: lift.platformWidth || 3.4,
        };
      });

      // Ground Detection Check
      const orbBottom = trans.y - 0.45;
      let isStrictlyGrounded = false;
      let onLiftVerticalSpeed = 0;

      // 1. Platforms
      for (const plat of currentLevel.platforms) {
        const platHalfW = plat.size[0] / 2 + 0.35;
        const platTop = plat.position[1] + plat.size[1] / 2;
        const dx = Math.abs(trans.x - plat.position[0]);
        if (dx <= platHalfW) {
          const dy = orbBottom - platTop;
          if (dy >= -0.3 && dy <= 0.35) {
            isStrictlyGrounded = true;
            break;
          }
        }
      }

      // 2. Bridges
      if (!isStrictlyGrounded && currentLevel.bridges) {
        for (const bridge of currentLevel.bridges) {
          const bHalfW = bridge.length / 2 + 0.35;
          const bTop = bridge.position[1];
          const dx = Math.abs(trans.x - bridge.position[0]);
          if (dx <= bHalfW) {
            const dy = orbBottom - bTop;
            if (dy >= -0.35 && dy <= 0.35) {
              isStrictlyGrounded = true;
              break;
            }
          }
        }
      }

      // 3. Lifts
      if (!isStrictlyGrounded && activeLifts.length > 0) {
        for (const lift of activeLifts) {
          const liftHalfW = lift.platWidth / 2 + 0.3;
          const liftTop = lift.curY + 0.18;
          const dx = Math.abs(trans.x - lift.curX);
          if (dx <= liftHalfW) {
            const dy = orbBottom - liftTop;
            if (dy >= -0.4 && dy <= 0.45) {
              isStrictlyGrounded = true;
              onLiftVerticalSpeed = Math.max(0, lift.vy);
              break;
            }
          }
        }
      }

      // Jump Trigger
      const currentJumpInput = Boolean(actions && (actions.confirm || actions.tap));
      const isNewJumpPress = currentJumpInput && !prevJumpInputRef.current;
      prevJumpInputRef.current = currentJumpInput;

      let targetVx = moveX * speed;
      let lerpedVx = THREE.MathUtils.lerp(linvel.x, targetVx, Math.min(1.0, dt * 18));
      let newVy = linvel.y;

      if (isOnLadder) {
        if (moveYClimb !== 0) {
          newVy = moveYClimb * 6.5;
        } else if (isNewJumpPress) {
          newVy = 8.5;
        } else {
          newVy = THREE.MathUtils.lerp(linvel.y, 0, dt * 8);
        }
      } else {
        if (prevYVelRef.current < -5 && linvel.y >= -0.5) {
          squashRef.current = 0.7;
          gameAudio.playJumpLandingThud();
        }
        prevYVelRef.current = linvel.y;
        squashRef.current = THREE.MathUtils.lerp(squashRef.current, 1.0, dt * 12);

        if (isNewJumpPress && (isStrictlyGrounded || Math.abs(linvel.y) < 0.6)) {
          newVy = getConfig('jumpVelocity') + onLiftVerticalSpeed;
          squashRef.current = 1.35;
          gameAudio.playRetroJump();
        }
      }

      // Keep orb on 2.5D plane (Z = 0)
      orb.setLinvel({x: lerpedVx, y: newVy, z: -trans.z * 10}, true);

      // Visual transformation
      if (orbMeshRef.current) {
        orbMeshRef.current.position.set(trans.x, trans.y, 0);
        orbMeshRef.current.rotation.z -= linvel.x * dt * 2.5;
        const sY = squashRef.current;
        const sXZ = 1 / Math.sqrt(sY);
        orbMeshRef.current.scale.set(sXZ, sY, sXZ);
      }

      // Spring Launch Triggers
      currentLevel.springs.forEach((spring) => {
        const dx = Math.abs(trans.x - spring.position[0]);
        const dy = trans.y - spring.position[1];
        if (dx < 1.3 && dy >= -0.4 && dy <= 1.6 && linvel.y <= 3.0) {
          const baseJump = getConfig('jumpVelocity');
          const bounceForce = baseJump * (spring.powerMultiplier || 2.2);
          const forwardBoost =
            spring.type === 'mushroom' ? 4.5 : spring.type === 'super' ? 3.6 : 2.4;
          const boostX = moveX > 0 ? forwardBoost : moveX < 0 ? -forwardBoost : forwardBoost * 0.4;

          orb.setLinvel({x: THREE.MathUtils.clamp(lerpedVx + boostX, -16, 16), y: bounceForce, z: 0}, true);
          squashRef.current = 1.7;
          gameAudio.playPowerupChime();
          const pColor =
            spring.type === 'mushroom' ? '#c084fc' : spring.type === 'super' ? '#fde047' : '#4ade80';
          spawnSparkles(spring.position[0], spring.position[1] + 0.4, 0, pColor, 24, 1.5);
        }
      });

      // Golden Egg Pickups
      eggs.forEach((egg) => {
        if (egg.collected) return;
        const dist = Math.hypot(trans.x - egg.position[0], trans.y - egg.position[1]);
        if (dist < 0.95) {
          egg.collected = true;
          setEggs([...eggs]);
          gameAudio.playCoinPickup();
          spawnSparkles(egg.position[0], egg.position[1], 0, '#fcd34d', 16);
          const collectedCount = eggs.filter((e) => e.collected).length;
          onEggCollected(egg.id, collectedCount, eggs.length);
          onScoreAdd(egg.score);
        }
      });

      // 3 Golden Keys Pickup Handling
      keys.forEach((key) => {
        if (key.collected) return;
        const dist = Math.hypot(trans.x - key.position[0], trans.y - key.position[1]);
        if (dist < 1.1) {
          key.collected = true;
          setKeys([...keys]);
          gameAudio.playPowerupChime();
          spawnSparkles(key.position[0], key.position[1], 0, '#fbbf24', 24, 1.8);
          const currentCount = keys.filter((k) => k.collected).length;
          onKeyCollected(key.id, currentCount, keys.length);
        }
      });

      // Checkpoints
      checkpoints.forEach((cp) => {
        const dist = Math.hypot(trans.x - cp.position[0], trans.y - cp.position[1]);
        if (dist < 1.3 && !cp.activated) {
          checkpoints.forEach((c) => (c.activated = c.id === cp.id));
          setCheckpoints([...checkpoints]);
          activeCheckpointPosRef.current = cp.position;
          gameAudio.playConfirmSelect();
          spawnSparkles(cp.position[0], cp.position[1] + 0.8, 0, '#38bdf8', 16);
          onCheckpointReached(cp.id);
        }
      });

      // Bombs
      if (damageCooldownRef.current <= 0) {
        bombs.forEach((bomb) => {
          if (bomb.exploded) return;
          const dist = Math.hypot(trans.x - bomb.position[0], trans.y - bomb.position[1]);
          if (dist < 0.95) {
            bomb.exploded = true;
            setBombs([...bombs]);
            damageCooldownRef.current = 0.8;
            gameAudio.playChiptuneExplosion();
            spawnSparkles(bomb.position[0], bomb.position[1], 0, '#f97316', 28, 2.0);
            onPlayerDamaged('bomb');
          }
        });
      }

      // Spikes
      if (damageCooldownRef.current <= 0) {
        currentLevel.spikes.forEach((spike) => {
          const dx = Math.abs(trans.x - spike.position[0]);
          const dy = Math.abs(trans.y - spike.position[1]);
          if (dx < spike.size[0] / 2 + 0.35 && dy < spike.size[1] / 2 + 0.35) {
            damageCooldownRef.current = 0.8;
            gameAudio.playGeneralDamage();
            spawnSparkles(spike.position[0], spike.position[1] + 0.3, 0, '#ef4444', 16);
            onPlayerDamaged('spike');
          }
        });
      }

      // Exit Goal Check
      const exitPos = currentLevel.exitDoorPosition;
      const distToDoor = Math.hypot(trans.x - exitPos[0], trans.y - exitPos[1]);
      if (distToDoor < 1.45) {
        const isDoorFullyUnlocked = keysCollectedCount >= totalKeysRequired;
        if (!isDoorFullyUnlocked) {
          if (doorAttemptCooldownRef.current <= 0) {
            doorAttemptCooldownRef.current = 1.5;
            gameAudio.playShieldBlock();
            const remaining = totalKeysRequired - keysCollectedCount;
            onDoorLockedAttempt(remaining);
          }
        } else {
          gameAudio.playVictoryFanfare();
          spawnSparkles(exitPos[0], exitPos[1], 0, '#fcd34d', 32, 2.2);
          onLevelComplete();
        }
      }

      // Camera Tracking
      _targetCamPos.set(
        trans.x + getConfig('cameraX'),
        trans.y + getConfig('cameraY'),
        getConfig('cameraZ')
      );
      camera.position.lerp(_targetCamPos, 1 - Math.exp(-8 * dt));
      _camLookAt.set(trans.x, trans.y + 0.3, 0);
      camera.lookAt(_camLookAt);
    }

    // Particle updates
    if (particles.length > 0) {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            position: [
              p.position[0] + p.velocity[0] * dt,
              p.position[1] + p.velocity[1] * dt - 9.8 * 0.4 * dt * dt,
              p.position[2] + p.velocity[2] * dt,
            ] as Position3D,
            life: p.life - dt,
          }))
          .filter((p) => p.life > 0)
      );
    }
  });

  const isUnlockedAllKeys = keysCollectedCount >= totalKeysRequired;

  return (
    <group>
      {/* Lighting Setup */}
      <hemisphereLight args={[seasonTheme.skyColor, seasonTheme.platformColor, getConfig('hemiIntensity')]} />
      <directionalLight
        position={[15, 25, 20]}
        intensity={getConfig('sunIntensity')}
        color="#ffffff"
      />
      <ambientLight color="#ffffff" intensity={1.5} />

      {/* Atmospheric Theme Backdrop */}
      <VibrantMeadowBackdrop theme={seasonTheme} />

      {/* Physics Body for Red Orb */}
      <RigidBody
        ref={orbBodyRef}
        colliders={false}
        position={currentLevel.spawnPoint}
        enabledRotations={[false, false, true]}
        linearDamping={0.4}
        restitution={0.3}
        friction={0.8}>
        <BallCollider args={[0.45]} />
      </RigidBody>

      {/* Glossy Red Orb Mascot */}
      <group ref={orbMeshRef} position={currentLevel.spawnPoint}>
        {/* Dark Outline Shell */}
        <mesh>
          <sphereGeometry args={[0.48, 20, 20]} />
          <meshBasicMaterial color="#111827" side={THREE.BackSide} />
        </mesh>
        {/* Vibrant Glossy Red Body */}
        <mesh>
          <sphereGeometry args={[0.45, 20, 20]} />
          <meshStandardMaterial
            color="#ef233c"
            roughness={0.12}
            metalness={0.08}
            emissive="#b91c1c"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Specular White Shine Glint */}
        <mesh position={[0.16, 0.22, 0.36]} rotation={[0.2, -0.3, 0.4]}>
          <circleGeometry args={[0.13, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.92} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.26, 0.30, 0.32]}>
          <circleGeometry args={[0.045, 10]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.95} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Platforms */}
      {currentLevel.platforms.map((plat) => (
        <ReferencePlatformCliff
          key={`platform-${plat.id}`}
          platform={plat}
          theme={seasonTheme}
          texture={patternTexture}
        />
      ))}

      {/* Rope Bridges */}
      {currentLevel.bridges?.map((bridge) => (
        <RopeBridgeMesh key={`bridge-${bridge.id}`} bridge={bridge} />
      ))}

      {/* Elevator Lifts */}
      {currentLevel.lifts?.map((lift) => (
        <LiftElevatorMesh key={`lift-${lift.id}`} lift={lift} theme={seasonTheme} />
      ))}

      {/* Multi-Type Springs */}
      {currentLevel.springs.map((spring) => (
        <MultiTypeSpringMesh key={`spring-${spring.id}`} spring={spring} />
      ))}

      {/* Golden Eggs */}
      {eggs.map((egg) => (
        <GoldenEggMesh key={`egg-${egg.id}`} egg={egg} />
      ))}

      {/* 3 Golden Keys */}
      {keys.map((key) => (
        <GoldenKeyMesh key={`key-${key.id}`} goldenKey={key} />
      ))}

      {/* Checkpoints */}
      {checkpoints.map((cp) => (
        <CheckpointPole key={`checkpoint-${cp.id}`} checkpoint={cp} />
      ))}

      {/* Bombs */}
      {bombs.map((bomb) => (
        <BombHazardMesh key={`bomb-${bomb.id}`} bomb={bomb} />
      ))}

      {/* Spikes */}
      {currentLevel.spikes.map((spike) => (
        <SpikeHazardMesh key={`spike-${spike.id}`} spike={spike} theme={seasonTheme} />
      ))}

      {/* Ladders */}
      {currentLevel.ladders.map((ladder) => (
        <ClimbLadder key={`ladder-${ladder.id}`} ladder={ladder} />
      ))}

      {/* Exit Door (Requires all 3 Keys to Unlock) */}
      <ExitGoalArchway
        position={currentLevel.exitDoorPosition}
        isUnlocked={isUnlockedAllKeys}
        keysCollected={keysCollectedCount}
        totalKeys={totalKeysRequired}
      />

      {/* Particle Effects */}
      {particles.map((p) => (
        <mesh key={`particle-${p.id}`} position={p.position}>
          <sphereGeometry args={[p.size || 0.12, 10, 10]} />
          <meshBasicMaterial color={p.color || '#fcd34d'} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------- REFERENCE PLATFORM WITH DRIPPING LIME GRASS & PATTERN BODY ----------------
function ReferencePlatformCliff({
  platform,
  theme,
  texture,
}: {
  platform: GrassPlatform;
  theme: SeasonTheme;
  texture: THREE.CanvasTexture | null;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<RapierRigidBody>(null);
  const initialPos = platform.position;

  useFrame(({clock}) => {
    if (platform.moving && meshRef.current && bodyRef.current) {
      const t = clock.getElapsedTime() * (platform.moveSpeed || 1.4);
      const offset = Math.sin(t) * (platform.moveRange || 1.5);
      const nx = platform.moveAxis === 'x' ? initialPos[0] + offset : initialPos[0];
      const ny = platform.moveAxis === 'y' ? initialPos[1] + offset : initialPos[1];

      bodyRef.current.setNextKinematicTranslation({x: nx, y: ny, z: 0});
      meshRef.current.position.set(nx, ny, 0);
    }
  });

  const width = platform.size[0];
  const height = platform.size[1];
  const depth = platform.size[2];
  const tuftsCount = Math.min(8, Math.max(2, Math.floor(width * 1.15)));

  return (
    <>
      <RigidBody
        ref={bodyRef}
        type={platform.moving ? 'kinematicPosition' : 'fixed'}
        position={platform.position}
        colliders={false}>
        <CuboidCollider args={[width / 2, height / 2, depth / 2]} />
      </RigidBody>

      <group ref={meshRef} position={platform.position}>
        {/* Main Body Block */}
        <mesh>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial
            color={theme.platformColor}
            map={texture || undefined}
            roughness={0.7}
          />
        </mesh>

        {/* Grass Top Slab */}
        <mesh position={[0, height / 2 + 0.05, 0]}>
          <boxGeometry args={[width + 0.08, 0.14, depth + 0.1]} />
          <meshStandardMaterial color={theme.platformGrassColor} roughness={0.3} />
        </mesh>

        {/* Wavy Dripping Grass Overhang */}
        {Array.from({length: tuftsCount}).map((_, i) => {
          const tx = -width / 2 + (width / tuftsCount) * (i + 0.5);
          const dropHeight = 0.22 + (i % 3) * 0.08;
          return (
            <group key={i} position={[tx, height / 2 - dropHeight / 2 + 0.02, depth / 2 + 0.02]}>
              <mesh>
                <boxGeometry args={[(width / tuftsCount) * 0.95, dropHeight, 0.04]} />
                <meshStandardMaterial color={theme.platformGrassColor} roughness={0.3} />
              </mesh>
            </group>
          );
        })}

        {/* Sprout Fern Plant */}
        {platform.hasSproutFern && (
          <group
            position={[
              platform.fernPosition ? platform.fernPosition[0] - platform.position[0] : -width / 2 + 0.4,
              height / 2 + 0.1,
              0.2,
            ]}>
            <SproutFernMesh />
          </group>
        )}
      </group>
    </>
  );
}

// ---------------- ROPE BRIDGE COMPONENT ----------------
function RopeBridgeMesh({bridge}: {bridge: RopeBridge}) {
  const plankCount = Math.min(12, Math.max(3, Math.floor(bridge.length / 0.7)));
  const plankWidth = bridge.length / plankCount;

  return (
    <>
      <RigidBody type="fixed" position={bridge.position} colliders={false}>
        <CuboidCollider args={[bridge.length / 2, 0.15, 1.6]} />
      </RigidBody>

      <group position={bridge.position}>
        {[-bridge.length / 2, bridge.length / 2].map((endX, idx) => (
          <group key={idx} position={[endX, 0.4, 0]}>
            <mesh position={[0, 0, 1.2]}>
              <cylinderGeometry args={[0.08, 0.08, 1.0, 8]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0, -1.2]}>
              <cylinderGeometry args={[0.08, 0.08, 1.0, 8]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>
          </group>
        ))}

        <mesh position={[0, 0.8, 1.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, bridge.length, 8]} />
          <meshStandardMaterial color="#d97706" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.8, -1.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, bridge.length, 8]} />
          <meshStandardMaterial color="#d97706" roughness={0.9} />
        </mesh>

        {Array.from({length: plankCount}).map((_, i) => {
          const px = -bridge.length / 2 + plankWidth * (i + 0.5);
          const sag = -Math.sin((i / plankCount) * Math.PI) * 0.12;
          return (
            <group key={i} position={[px, sag, 0]}>
              <mesh>
                <boxGeometry args={[plankWidth * 0.88, 0.14, 2.6]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#b45309' : '#92400e'} roughness={0.7} />
              </mesh>
            </group>
          );
        })}
      </group>
    </>
  );
}

// ---------------- LIFT ELEVATOR COMPONENT ----------------
function LiftElevatorMesh({lift, theme}: {lift: LiftElevator; theme: SeasonTheme}) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Group>(null);
  const platWidth = lift.platformWidth || 3.4;

  useFrame(({clock}) => {
    if (bodyRef.current && meshRef.current) {
      const t = clock.getElapsedTime() * lift.speed;
      const progress = (Math.sin(t) + 1) / 2;
      const offset = progress * lift.travelDistance;

      const nx = lift.axis === 'x' ? lift.startPosition[0] + offset : lift.startPosition[0];
      const ny = lift.axis === 'y' ? lift.startPosition[1] + offset : lift.startPosition[1];

      bodyRef.current.setNextKinematicTranslation({x: nx, y: ny, z: 0});
      meshRef.current.position.set(nx, ny, 0);
    }
  });

  return (
    <>
      <RigidBody ref={bodyRef} type="kinematicPosition" position={lift.startPosition} colliders={false}>
        <CuboidCollider args={[platWidth / 2, 0.22, 1.8]} />
      </RigidBody>

      <group ref={meshRef} position={lift.startPosition}>
        <mesh>
          <boxGeometry args={[platWidth, 0.35, 3.4]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
        </mesh>

        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[platWidth + 0.05, 0.06, 3.45]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {[-1.5, 1.5].map((rz, idx) => (
          <group key={idx} position={[0, 0.4, rz]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, platWidth * 0.95, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.7} />
            </mesh>
            <mesh position={[-platWidth / 3, -0.2, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.45, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.7} />
            </mesh>
            <mesh position={[platWidth / 3, -0.2, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.45, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.7} />
            </mesh>
          </group>
        ))}

        <mesh position={[-platWidth / 3, 2.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 5.0, 6]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        <mesh position={[platWidth / 3, 2.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 5.0, 6]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
      </group>
    </>
  );
}

// ---------------- MULTI-TYPE SPRING MESH (LEAF, SUPER GOLDEN, MEGA MUSHROOM) ----------------
function MultiTypeSpringMesh({spring}: {spring: SpringItem}) {
  const springRef = useRef<THREE.Group>(null);

  useFrame(({clock}) => {
    if (springRef.current) {
      const rate = spring.type === 'mushroom' ? 2.5 : spring.type === 'super' ? 4.5 : 3.5;
      const t = clock.getElapsedTime() * rate;
      springRef.current.scale.y = 1.0 + Math.sin(t) * 0.09;
    }
  });

  return (
    <group ref={springRef} position={spring.position}>
      {spring.type === 'leaf' && (
        <>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.15, 0.25, 0.4, 12]} />
            <meshStandardMaterial color="#15803d" roughness={0.6} />
          </mesh>
          <group position={[0, 0.18, 0]}>
            <mesh scale={[1.8, 0.4, 1.2]}>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial
                color="#22c55e"
                emissive="#16a34a"
                emissiveIntensity={0.3}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[1.8, 0.04, 0.08]} />
              <meshBasicMaterial color="#86efac" />
            </mesh>
          </group>
        </>
      )}

      {spring.type === 'super' && (
        <>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.4, 0.45, 0.2, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>
          {[0, 0.15, 0.3].map((sy, idx) => (
            <mesh key={idx} position={[0, sy - 0.05, 0]} rotation={[Math.PI / 2 + 0.1, 0, 0]}>
              <torusGeometry args={[0.25, 0.07, 12, 24]} />
              <meshStandardMaterial
                color="#facc15"
                metalness={0.85}
                roughness={0.15}
                emissive="#ca8a04"
                emissiveIntensity={0.4}
              />
            </mesh>
          ))}
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.48, 0.48, 0.1, 20]} />
            <meshStandardMaterial
              color="#eab308"
              metalness={0.7}
              roughness={0.2}
              emissive="#eab308"
              emissiveIntensity={0.5}
            />
          </mesh>
        </>
      )}

      {spring.type === 'mushroom' && (
        <>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.22, 0.32, 0.6, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.38, 0]} scale={[1.3, 0.8, 1.3]}>
            <sphereGeometry args={[0.65, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#7e22ce"
              emissiveIntensity={0.5}
              roughness={0.2}
            />
          </mesh>
          {[
            {x: 0, y: 0.58, z: 0.35, s: 0.14},
            {x: -0.38, y: 0.48, z: 0.2, s: 0.12},
            {x: 0.38, y: 0.48, z: 0.2, s: 0.12},
            {x: 0, y: 0.68, z: 0, s: 0.18},
          ].map((spot, idx) => (
            <mesh key={idx} position={[spot.x, spot.y, spot.z]}>
              <sphereGeometry args={[spot.s, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}

// ---------------- SPROUT FERN ----------------
function SproutFernMesh() {
  const fernRef = useRef<THREE.Group>(null);

  useFrame(({clock}) => {
    if (fernRef.current) {
      const t = clock.getElapsedTime() * 2.0;
      fernRef.current.rotation.z = Math.sin(t) * 0.08;
    }
  });

  return (
    <group ref={fernRef}>
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.35, 0.08, 12, 24, Math.PI * 1.3]} />
        <meshBasicMaterial color="#052e16" />
      </mesh>
      <mesh position={[0, 0.5, 0.02]}>
        <torusGeometry args={[0.35, 0.055, 12, 24, Math.PI * 1.3]} />
        <meshStandardMaterial color="#4ade80" emissive="#16a34a" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.28, 0.72, 0.04]} rotation={[0, 0, 0.8]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#86efac" />
      </mesh>
    </group>
  );
}

// ---------------- GOLDEN / BEIGE EGG COLLECTIBLE ----------------
function GoldenEggMesh({egg}: {egg: GoldenEgg}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(({clock}) => {
    if (meshRef.current && !egg.collected) {
      const t = clock.getElapsedTime() * 2.5;
      meshRef.current.position.y = egg.position[1] + Math.sin(t + egg.id) * 0.12;
      meshRef.current.rotation.y = t * 1.2;
    }
  });

  if (egg.collected) return null;

  return (
    <group ref={meshRef} position={egg.position}>
      <mesh scale={[0.78, 1.05, 0.78]}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshBasicMaterial color="#1e293b" side={THREE.BackSide} />
      </mesh>
      <mesh scale={[0.75, 1.0, 0.75]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color="#fed7aa"
          roughness={0.2}
          metalness={0.15}
          emissive="#f59e0b"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh position={[-0.1, 0.14, 0.22]} rotation={[0.2, 0.3, 0]}>
        <circleGeometry args={[0.07, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ---------------- GOLDEN KEY COLLECTIBLE ----------------
function GoldenKeyMesh({goldenKey}: {goldenKey: GoldenKey}) {
  const keyRef = useRef<THREE.Group>(null);

  useFrame(({clock}) => {
    if (keyRef.current && !goldenKey.collected) {
      const t = clock.getElapsedTime() * 3.0;
      keyRef.current.position.y = goldenKey.position[1] + Math.sin(t + goldenKey.id * 1.5) * 0.15;
      keyRef.current.rotation.y = t * 1.8 + goldenKey.id;
    }
  });

  if (goldenKey.collected) return null;

  return (
    <group ref={keyRef} position={goldenKey.position}>
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.2, 0.06, 12, 24]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={0.8}
          roughness={0.2}
          emissive="#d97706"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.5, 12]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={0.8}
          roughness={0.2}
          emissive="#d97706"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0.1, -0.08, 0]}>
        <boxGeometry args={[0.14, 0.06, 0.04]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.08, 0.02, 0]}>
        <boxGeometry args={[0.1, 0.06, 0.04]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ---------------- CHECKPOINT POLE & FLAG ----------------
function CheckpointPole({checkpoint}: {checkpoint: CheckpointData}) {
  const flagRef = useRef<THREE.Mesh>(null);

  useFrame(({clock}) => {
    if (flagRef.current) {
      const t = clock.getElapsedTime() * 4.0;
      flagRef.current.rotation.y = Math.sin(t) * 0.25;
    }
  });

  return (
    <group position={checkpoint.position}>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.3, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh ref={flagRef} position={[0.3, 0.9, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.03]} />
        <meshStandardMaterial
          color={checkpoint.activated ? '#22c55e' : '#94a3b8'}
          emissive={checkpoint.activated ? '#16a34a' : '#1e293b'}
          emissiveIntensity={checkpoint.activated ? 0.6 : 0.1}
        />
      </mesh>
    </group>
  );
}

// ---------------- BOMB HAZARD ----------------
function BombHazardMesh({bomb}: {bomb: BombHazard}) {
  const bombRef = useRef<THREE.Group>(null);

  useFrame(({clock}) => {
    if (bombRef.current && !bomb.exploded) {
      const t = clock.getElapsedTime() * 5.0;
      const s = 1.0 + Math.sin(t) * 0.08;
      bombRef.current.scale.set(s, s, s);
    }
  });

  if (bomb.exploded) return null;

  return (
    <group ref={bombRef} position={bomb.position}>
      <mesh>
        <sphereGeometry args={[0.36, 24, 24]} />
        <meshStandardMaterial color="#18181b" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.1, 10]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0.06, 0.48, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.16, 8]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>
    </group>
  );
}

// ---------------- SPIKE HAZARD ----------------
function SpikeHazardMesh({spike}: {spike: SpikeHazard; theme: SeasonTheme}) {
  return (
    <group position={spike.position}>
      {[-0.35, 0, 0.35].map((sx, idx) => (
        <mesh key={idx} position={[sx, spike.size[1] / 2, 0]}>
          <coneGeometry args={[0.18, 0.45, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------- CLIMBABLE LADDER ----------------
function ClimbLadder({ladder}: {ladder: LadderItem}) {
  const numRungs = Math.floor(ladder.height / 0.5);

  return (
    <group position={ladder.position}>
      <mesh position={[-0.35, ladder.height / 2, 0]}>
        <cylinderGeometry args={[0.035, 0.035, ladder.height, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      <mesh position={[0.35, ladder.height / 2, 0]}>
        <cylinderGeometry args={[0.035, 0.035, ladder.height, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      {Array.from({length: numRungs}).map((_, i) => (
        <mesh key={i} position={[0, i * 0.5 + 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------- EXIT DOOR WITH 3-KEY LOCK MECHANISM ----------------
function ExitGoalArchway({
  position,
  isUnlocked,
  keysCollected,
  totalKeys,
}: {
  position: Position3D;
  isUnlocked: boolean;
  keysCollected: number;
  totalKeys: number;
}) {
  const swirlRef = useRef<THREE.Mesh>(null);
  const lockRef = useRef<THREE.Group>(null);

  useFrame(({clock}) => {
    if (swirlRef.current && isUnlocked) {
      swirlRef.current.rotation.z = clock.getElapsedTime() * 2.5;
    }
    if (lockRef.current && !isUnlocked) {
      const t = clock.getElapsedTime() * 2.5;
      lockRef.current.rotation.y = Math.sin(t) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Stone Pillars */}
      <mesh position={[-0.8, 0, 0]}>
        <boxGeometry args={[0.25, 2.2, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[0.8, 0, 0]}>
        <boxGeometry args={[0.25, 2.2, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[1.85, 0.3, 0.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {isUnlocked ? (
        <>
          <mesh ref={swirlRef} position={[0, 0, 0]}>
            <torusGeometry args={[0.65, 0.08, 12, 32]} />
            <meshBasicMaterial color="#5cd600" />
          </mesh>
        </>
      ) : (
        <group ref={lockRef}>
          {[-0.4, 0, 0.4].map((bx, idx) => (
            <mesh key={idx} position={[bx, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 2.0, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.7} />
            </mesh>
          ))}
          
          {/* Triple Keyhole Lock Indicator */}
          {[-0.3, 0, 0.3].map((kx, idx) => {
            const hasSlotKey = idx < keysCollected;
            return (
              <group key={idx} position={[kx, -0.1, 0.12]}>
                <mesh>
                  <boxGeometry args={[0.24, 0.3, 0.1]} />
                  <meshStandardMaterial
                    color={hasSlotKey ? '#eab308' : '#334155'}
                    metalness={0.8}
                    roughness={0.2}
                    emissive={hasSlotKey ? '#ca8a04' : '#000000'}
                    emissiveIntensity={hasSlotKey ? 0.6 : 0}
                  />
                </mesh>
                <mesh position={[0, 0.02, 0.06]}>
                  <circleGeometry args={[0.035, 12]} />
                  <meshBasicMaterial color={hasSlotKey ? '#facc15' : '#0f172a'} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
}

// ---------------- VIBRANT MEADOW BACKDROP ----------------
function VibrantMeadowBackdrop({theme}: {theme: SeasonTheme}) {
  return (
    <group>
      <mesh position={[0, 20, -30]}>
        <planeGeometry args={[260, 140]} />
        <meshBasicMaterial color={theme.skyColor} />
      </mesh>

      {[
        {x: -24, y: 22, s: 2.8},
        {x: 10, y: 16, s: 3.2},
        {x: 40, y: 24, s: 3.6},
        {x: 70, y: 20, s: 2.9},
      ].map((c, i) => (
        <group key={i} position={[c.x, c.y, -22]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[c.s * 2.2, c.s * 0.9, 0.2]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-c.s * 0.4, c.s * 0.45, 0.01]}>
            <boxGeometry args={[c.s * 1.2, c.s * 0.7, 0.2]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[c.s * 0.4, c.s * 0.35, 0.01]}>
            <boxGeometry args={[c.s * 1.0, c.s * 0.6, 0.2]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      {[
        {x: -24, y: 8, s: 1.2},
        {x: -10, y: 6, s: 0.9},
        {x: 14, y: 14, s: 1.1},
        {x: 32, y: 18, s: 1.3},
        {x: 52, y: 12, s: 1.2},
        {x: 74, y: 22, s: 1.4},
      ].map((island, idx) => (
        <group key={idx} position={[island.x, island.y, -16]}>
          <mesh position={[0, -0.6, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[2.0 * island.s, 1.6 * island.s, 16]} />
            <meshStandardMaterial color="#1e4e56" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[2.1 * island.s, 2.1 * island.s, 0.3 * island.s, 16]} />
            <meshStandardMaterial color="#2dd4bf" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.8 * island.s, 0]}>
            <cylinderGeometry args={[0.35 * island.s, 0.45 * island.s, 3.2 * island.s, 14]} />
            <meshStandardMaterial color="#2f636b" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
