import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import characterRide from '../assets/game/character-ride.png';
import characterCrouch from '../assets/game/character-crouch.png';
import characterPush from '../assets/game/character-push.png';
import characterJump from '../assets/game/character-jump.png';
import characterHighAir from '../assets/game/character-high-air.png';
import characterBackflip from '../assets/game/character-backflip.png';
import characterGrab from '../assets/game/character-grab.png';
import characterLanding from '../assets/game/character-landing.png';
import characterManual from '../assets/game/character-manual.png';
import characterCelebrate from '../assets/game/character-celebrate.png';
import balloonA from '../assets/game/balloon-a.png';
import balloonB from '../assets/game/balloon-b.png';
import starSprite from '../assets/game/star.png';
import treeA from '../assets/game/tree-a.png';
import treeB from '../assets/game/tree-b.png';
import rockSprite from '../assets/game/rock.png';
import deerSprite from '../assets/game/deer.png';
import peacockSprite from '../assets/game/peacock.png';
import backgroundSigiriya from '../assets/game/background-sigiriya.png';
import backgroundTemple from '../assets/game/background-temple.png';
import backgroundElla from '../assets/game/background-ella.png';
import backgroundColombo from '../assets/game/background-colombo.png';
import backgroundSriPada from '../assets/game/background-sri-pada.png';

const CHARACTER = {
  ride: characterRide,
  crouch: characterCrouch,
  push: characterPush,
  jump: characterJump,
  highAir: characterHighAir,
  backflip: characterBackflip,
  grab: characterGrab,
  landing: characterLanding,
  manual: characterManual,
  celebrate: characterCelebrate,
};

const SPRITES = {
  balloonA,
  balloonB,
  star: starSprite,
  treeA,
  treeB,
  rock: rockSprite,
  deer: deerSprite,
  peacock: peacockSprite,
};

const BACKGROUNDS = [
  backgroundSigiriya,
  backgroundTemple,
  backgroundElla,
  backgroundColombo,
  backgroundSriPada,
];

const PLAYER_X_RATIO = 0.28;
const PLAYER_WHEEL_ANCHOR_Y = 0.9;
const PLAYER_WHEEL_ANCHOR_X = 0.5;
const FEEDBACK_DURATION = 1.35;
const TERRAIN_POINT_SPACING = 360;
const GRAVITY = 1420;
const TAKEOFF_DURATION = 0.1;
const LANDING_DURATION = 0.14;
const CRASH_DURATION = 0.68;
const BACKFLIP_SPEED = Math.PI * 2.35;

const INITIAL_HUD = {
  score: 0,
  distance: 0,
  stars: 0,
  combo: 1,
  best:
    typeof window === 'undefined'
      ? 0
      : Number(window.localStorage?.getItem('endless-skating-best') || 0),
};

const smoothstep = (value) => value * value * (3 - 2 * value);

const terrainControlY = (index, height) => {
  const base = height * 0.74;
  const longWave = Math.sin(index * 0.72) * height * 0.065;
  const rollingWave = Math.sin(index * 1.47 + 0.8) * height * 0.034;
  const plannedFeature = [0, -height * 0.045, height * 0.085, -height * 0.07, height * 0.035][Math.abs(index) % 5];
  return base + longWave + rollingWave + plannedFeature;
};

const catmullRom = (p0, p1, p2, p3, t) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    2 * p1
    + (-p0 + p2) * t
    + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
    + (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
};

const terrainY = (worldX, height) => {
  const point = worldX / TERRAIN_POINT_SPACING;
  const index = Math.floor(point);
  const t = smoothstep(point - index);
  return catmullRom(
    terrainControlY(index - 1, height),
    terrainControlY(index, height),
    terrainControlY(index + 1, height),
    terrainControlY(index + 2, height),
    t
  );
};

const terrainAngle = (worldX, height) => {
  const y1 = terrainY(worldX - 12, height);
  const y2 = terrainY(worldX + 12, height);
  return Math.atan2(y2 - y1, 24);
};

function useGameAssets() {
  const [loaded, setLoaded] = useState(false);
  const imagesRef = useRef({});

  useEffect(() => {
    let active = true;
    const entries = [
      ...Object.entries(CHARACTER),
      ...Object.entries(SPRITES),
      ...BACKGROUNDS.map((src, index) => [`background${index}`, src]),
    ];

    Promise.all(
      entries.map(([key, src]) => new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve([key, image]);
        image.onerror = () => resolve([key, null]);
        image.src = src;
      }))
    ).then((loadedEntries) => {
      if (!active) {
        return;
      }
      imagesRef.current = loadedEntries.reduce((collection, [key, image]) => {
        collection[key] = image;
        return collection;
      }, {});
      setLoaded(true);
    });

    return () => {
      active = false;
    };
  }, []);

  return { loaded, imagesRef };
}

function createGameState(best = 0) {
  return {
    best,
    status: 'menu',
    message: '',
    worldX: 0,
    speed: 260,
    player: {
      xRatio: PLAYER_X_RATIO,
      y: 0,
      velocityY: 0,
      grounded: true,
      rotation: 0,
      groundAngle: 0,
      wheelSpin: 0,
      completedFlips: 0,
      state: 'push',
      previousState: 'push',
      stateBlend: 1,
      movementPhase: 'ride',
      phaseTimer: 0,
      crashTimer: 0,
    },
    inputHeld: false,
    stars: [],
    obstacles: [],
    decor: [],
    nextChunkX: 650,
    score: 0,
    distance: 0,
    starCount: 0,
    combo: 1,
    trickScore: 0,
    lastTime: 0,
    sceneMood: 0,
    feedback: null,
    dust: [],
    hasSeenInstructions:
      typeof window === 'undefined'
        ? false
        : window.localStorage?.getItem('endless-skating-seen-instructions') === 'true',
  };
}

function setPlayerState(player, state) {
  if (player.state === state) {
    return;
  }
  player.previousState = player.state;
  player.state = state;
  player.stateBlend = 0;
}

const normalizeRotation = (rotation) => {
  const fullTurn = Math.PI * 2;
  const wrapped = ((rotation % fullTurn) + fullTurn) % fullTurn;
  return Math.min(wrapped, fullTurn - wrapped);
};

function startFeedback(game, text, score = '') {
  game.message = text;
  game.feedback = { text, score, age: 0 };
}

function addChunk(game, startX) {
  const chunkWidth = 860;
  const pattern = Math.floor(startX / chunkWidth) % 4;

  const starPatterns = [
    [0, 0, 0, 0, 0, 0],
    [0, 36, 86, 116, 86, 36],
    [0, 58, 128, 190, 128, 58],
    [58, 108, 128, 128, 108, 58],
  ];
  const offsets = starPatterns[pattern];
  offsets.forEach((arc, index) => {
    const x = startX + 160 + index * 96;
    game.stars.push({
      x,
      yOffset: 112 + arc,
      collected: false,
      pulse: (index * 0.37) % 1,
    });
  });

  if (pattern !== 3) {
    game.obstacles.push({
      x: startX + 520,
      size: 42 + (pattern % 2) * 14,
      hit: false,
    });
  }

  game.decor.push(
    { type: pattern % 2 ? 'treeA' : 'treeB', x: startX + 210, layer: 'mid', scale: 0.44 },
    { type: pattern === 2 ? 'peacock' : 'deer', x: startX + 640, layer: 'wildlife', scale: pattern === 2 ? 0.18 : 0.25 },
    { type: pattern % 2 ? 'balloonA' : 'balloonB', x: startX + 360, layer: 'sky', scale: 0.075 }
  );

  game.nextChunkX = startX + chunkWidth;
}

function drawCoverImage(ctx, image, x, y, width, height) {
  if (!image) {
    return;
  }

  const scale = Math.max(width / image.width, height / image.height);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.width - sourceWidth) / 2;
  const sourceY = (image.height - sourceHeight) / 2;
  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function drawSprite(ctx, image, x, y, width, height, rotation = 0, alpha = 1, filter = 'none') {
  if (!image) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.filter = filter;
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(rotation);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function drawAnchoredSprite(
  ctx,
  image,
  anchorX,
  anchorY,
  width,
  height,
  anchorRatioX = 0.5,
  anchorRatioY = 0.9,
  rotation = 0,
  alpha = 1,
  filter = 'none'
) {
  if (!image) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.filter = filter;
  ctx.translate(anchorX, anchorY);
  ctx.rotate(rotation);
  ctx.drawImage(image, -width * anchorRatioX, -height * anchorRatioY, width, height);
  ctx.restore();
}

function drawTerrain(ctx, game, width, height, playerWorldX) {
  const points = [];
  for (let x = -32; x <= width + 48; x += 10) {
    const world = playerWorldX + x - width * game.player.xRatio;
    points.push([x, terrainY(world, height)]);
  }

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  points.forEach(([x, y]) => ctx.lineTo(x, y));
  [...points].reverse().forEach(([x, y]) => ctx.lineTo(x, y + 64));
  ctx.closePath();
  const pathGradient = ctx.createLinearGradient(0, height * 0.58, 0, height);
  pathGradient.addColorStop(0, 'rgba(169, 111, 50, 0.98)');
  pathGradient.addColorStop(0.46, 'rgba(95, 71, 39, 0.96)');
  pathGradient.addColorStop(1, 'rgba(38, 56, 37, 0.9)');
  ctx.fillStyle = pathGradient;
  ctx.shadowColor = 'rgba(43, 23, 8, 0.28)';
  ctx.shadowBlur = 18;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  points.forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.strokeStyle = 'rgba(250, 209, 122, 0.95)';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1] + 18);
  points.forEach(([x, y]) => ctx.lineTo(x, y + 18));
  ctx.strokeStyle = 'rgba(99, 56, 24, 0.65)';
  ctx.lineWidth = 12;
  ctx.stroke();

  ctx.beginPath();
  points.forEach(([x, y], index) => {
    const pebbleY = y + 28 + Math.sin((game.worldX + x) / 28) * 5;
    if (index % 4 === 0) {
      ctx.moveTo(x, pebbleY);
      ctx.arc(x, pebbleY, 1.7, 0, Math.PI * 2);
    }
  });
  ctx.fillStyle = 'rgba(248, 218, 143, 0.26)';
  ctx.fill();

  const fade = ctx.createLinearGradient(0, height * 0.7, 0, height);
  fade.addColorStop(0, 'rgba(9, 34, 23, 0)');
  fade.addColorStop(1, 'rgba(7, 25, 18, 0.38)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, height * 0.72, width, height * 0.28);
  ctx.restore();
}

function drawBackground(ctx, images, game, width, height) {
  const sceneProgress = Math.floor(game.distance / 850) % BACKGROUNDS.length;
  const nextScene = (sceneProgress + 1) % BACKGROUNDS.length;
  const blend = (game.distance % 850) / 850;
  const imageA = images[`background${sceneProgress}`];
  const imageB = images[`background${nextScene}`];

  drawCoverImage(ctx, imageA, 0, 0, width, height);
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, (blend - 0.72) / 0.28));
  drawCoverImage(ctx, imageB, 0, 0, width, height);
  ctx.restore();

  const dayCycle = (Math.sin(game.distance / 1100) + 1) / 2;
  const nightAlpha = 0.42 * (1 - dayCycle);
  ctx.fillStyle = `rgba(7, 13, 31, ${nightAlpha})`;
  ctx.fillRect(0, 0, width, height);

  const sunX = width * (0.14 + dayCycle * 0.72);
  const sunY = height * (0.22 + Math.sin(game.distance / 800) * 0.05);
  const glow = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, width * 0.35);
  glow.addColorStop(0, 'rgba(255, 209, 102, 0.28)');
  glow.addColorStop(1, 'rgba(255, 209, 102, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
}

function updateGame(game, dt, width, height) {
  if (game.status !== 'playing' && game.status !== 'crashed') {
    return;
  }

  const player = game.player;
  const playerWorldX = game.worldX + width * player.xRatio;
  const groundY = terrainY(playerWorldX, height);
  const targetGroundAngle = terrainAngle(playerWorldX, height);

  player.stateBlend = Math.min(1, player.stateBlend + dt / 0.08);
  if (game.feedback) {
    game.feedback.age += dt;
    if (game.feedback.age > FEEDBACK_DURATION) {
      game.feedback = null;
      game.message = '';
    }
  }

  if (game.status === 'crashed') {
    player.crashTimer += dt;
    game.worldX += game.speed * dt * 0.34;
    game.speed = Math.max(0, game.speed - 620 * dt);
    player.y = groundY;
    player.groundAngle += (targetGroundAngle - player.groundAngle) * 0.16;
    player.rotation += dt * 5.4;
    setPlayerState(player, 'landing');
    if (player.crashTimer > CRASH_DURATION) {
      game.status = 'gameover';
      game.message = 'Game Over';
      game.best = Math.max(game.best, Math.floor(game.score));
      window.localStorage?.setItem('endless-skating-best', String(game.best));
    }
    return;
  }

  game.speed = Math.min(500, game.speed + dt * 5.4);
  game.worldX += game.speed * dt;
  game.distance = game.worldX / 52;
  game.score = game.distance * 2 + game.starCount * 100 + game.trickScore;

  player.wheelSpin += game.speed * dt * 0.09;

  if (player.movementPhase === 'takeoff') {
    player.y = groundY;
    player.groundAngle += (targetGroundAngle - player.groundAngle) * 0.16;
    player.rotation = player.groundAngle;
    player.phaseTimer += dt;
    setPlayerState(player, 'crouch');
    if (player.phaseTimer >= TAKEOFF_DURATION) {
      player.movementPhase = 'air';
      player.phaseTimer = 0;
      player.grounded = false;
      player.velocityY = player.takeoffVelocity || -600;
      setPlayerState(player, 'jump');
    }
  } else if (!player.grounded) {
    player.velocityY += GRAVITY * dt;
    player.y += player.velocityY * dt;
    if (game.inputHeld) {
      player.rotation -= BACKFLIP_SPEED * dt;
      setPlayerState(player, 'backflip');
    } else if (player.velocityY < -190) {
      setPlayerState(player, 'highAir');
    } else if (player.velocityY < 130) {
      setPlayerState(player, 'grab');
    } else {
      setPlayerState(player, 'landing');
    }

    const fullFlips = Math.floor(Math.abs(player.rotation) / (Math.PI * 2));
    player.completedFlips = Math.max(player.completedFlips, fullFlips);

    if (player.y >= groundY) {
      player.y = groundY;
      player.velocityY = 0;
      const normalizedRotation = normalizeRotation(player.rotation);
      const landedCleanly = normalizedRotation < 0.72;
      if (!landedCleanly) {
        game.status = 'crashed';
        startFeedback(game, 'BAD LANDING');
        player.grounded = true;
        player.movementPhase = 'crash';
        player.crashTimer = 0;
        return;
      }
      if (player.completedFlips > 0) {
        game.combo = Math.min(8, game.combo + player.completedFlips);
        game.trickScore += 450 * player.completedFlips * game.combo;
        startFeedback(
          game,
          player.completedFlips > 1 ? 'DOUBLE BACKFLIP' : 'BACKFLIP',
          `+${450 * player.completedFlips * game.combo}`
        );
      }
      player.grounded = true;
      player.movementPhase = 'landing';
      player.phaseTimer = 0;
      player.groundAngle = targetGroundAngle;
      player.rotation = targetGroundAngle;
      player.completedFlips = 0;
      setPlayerState(player, 'landing');
    }
  } else if (player.movementPhase === 'landing') {
    player.y = groundY;
    player.groundAngle += (targetGroundAngle - player.groundAngle) * 0.18;
    player.rotation = player.groundAngle;
    player.phaseTimer += dt;
    setPlayerState(player, 'landing');
    if (player.phaseTimer >= LANDING_DURATION) {
      player.movementPhase = 'ride';
      player.phaseTimer = 0;
    }
  } else {
    player.y = groundY;
    player.groundAngle += (targetGroundAngle - player.groundAngle) * 0.14;
    player.rotation = player.groundAngle;
    setPlayerState(player, Math.abs(targetGroundAngle) > 0.12 ? 'crouch' : game.speed < 300 ? 'push' : 'ride');
    if (game.speed > 275 && Math.random() < dt * 18) {
      game.dust.push({
        x: playerWorldX - 42,
        y: groundY + 2,
        age: 0,
        life: 0.55 + Math.random() * 0.28,
        drift: -22 - Math.random() * 28,
        size: 2 + Math.random() * 2.8,
      });
    }
  }

  if (player.y > groundY) {
    player.y = groundY;
    player.velocityY = Math.min(0, player.velocityY);
  }

  game.dust.forEach((particle) => {
    particle.age += dt;
    particle.x += particle.drift * dt;
    particle.y -= 8 * dt;
  });
  game.dust = game.dust.filter((particle) => particle.age < particle.life);

  while (game.nextChunkX < game.worldX + width * 2.2) {
    addChunk(game, game.nextChunkX);
  }

  game.stars.forEach((star) => {
    if (star.collected) {
      return;
    }
    const starScreenX = star.x - game.worldX;
    const starY = terrainY(star.x, height) - star.yOffset;
    const dx = starScreenX - width * player.xRatio;
    const dy = starY - player.y;
    if (Math.hypot(dx, dy) < 54) {
      star.collected = true;
      game.starCount += 1;
      game.score += 100 * game.combo;
      if (game.starCount % 8 === 0) {
        game.combo = Math.min(8, game.combo + 1);
        startFeedback(game, 'STAR LINE', `x${game.combo}`);
      }
    }
  });

  game.obstacles.forEach((obstacle) => {
    if (obstacle.hit) {
      return;
    }
    const obstacleScreenX = obstacle.x - game.worldX;
    const dx = obstacleScreenX - width * player.xRatio;
    const playerNearGround = player.y > terrainY(playerWorldX, height) - 34;
    if (Math.abs(dx) < obstacle.size * 0.62 && playerNearGround) {
      obstacle.hit = true;
      game.status = 'crashed';
      startFeedback(game, 'ROCK HIT');
      player.y = groundY;
      player.velocityY = 0;
      player.grounded = true;
      player.movementPhase = 'crash';
      player.crashTimer = 0;
    }
  });

  const pruneBefore = game.worldX - width;
  game.stars = game.stars.filter((star) => star.x > pruneBefore && !star.collected);
  game.obstacles = game.obstacles.filter((obstacle) => obstacle.x > pruneBefore);
  game.decor = game.decor.filter((item) => item.x > pruneBefore);
  game.dust = game.dust.filter((particle) => particle.x > pruneBefore);
}

function renderGame(ctx, images, game, width, height) {
  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, images, game, width, height);

  game.decor.forEach((item) => {
    const image = images[item.type];
    if (!image) {
      return;
    }
    const parallax = item.layer === 'sky' ? 0.08 : item.layer === 'mid' ? 0.48 : 0.78;
    const screenX = item.x - game.worldX * parallax + (item.layer === 'sky' ? width * 0.12 : 0);
    const size = Math.min(width, height) * item.scale;
    const spriteWidth = size * (image.width / image.height);
    const pathY = terrainY(item.x, height);
    const top =
      item.layer === 'sky'
        ? height * 0.16
        : item.layer === 'mid'
          ? pathY - size * 0.82
          : pathY - size * 0.7;
    const alpha = item.layer === 'sky' ? 0.48 : item.layer === 'mid' ? 0.74 : 0.82;
    const filter = item.layer === 'sky'
      ? 'saturate(0.62) contrast(0.9)'
      : 'saturate(0.78) contrast(0.92)';
    drawSprite(ctx, image, screenX, top, spriteWidth, size, 0, alpha, filter);
  });

  drawTerrain(ctx, game, width, height, game.worldX + width * game.player.xRatio);

  game.stars.forEach((star) => {
    const screenX = star.x - game.worldX;
    if (screenX < -80 || screenX > width + 80) {
      return;
    }
    const pulse = 1 + Math.sin((game.distance / 18) + star.pulse * Math.PI * 2) * 0.08;
    const size = 28 * pulse;
    const starY = terrainY(star.x, height) - star.yOffset;
    drawSprite(ctx, images.star, screenX - size / 2, starY - size / 2, size, size, 0, 0.84, 'saturate(0.82) contrast(0.95)');
  });

  game.obstacles.forEach((obstacle) => {
    const screenX = obstacle.x - game.worldX;
    if (screenX < -120 || screenX > width + 120) {
      return;
    }
    const size = obstacle.size;
    drawSprite(ctx, images.rock, screenX - size / 2, terrainY(obstacle.x, height) - size * 0.78, size * 1.32, size, 0, 0.9, 'saturate(0.86) contrast(0.95)');
  });

  const player = game.player;
  const characterImage = images[player.state] || images.ride;
  const previousCharacterImage = images[player.previousState] || characterImage;
  const playerHeight = Math.max(118, Math.min(166, height * 0.215));
  const playerWidth = playerHeight * 0.78;
  const playerX = width * player.xRatio;
  const playerWorldX = game.worldX + width * player.xRatio;
  const groundY = terrainY(playerWorldX, height);
  const airHeight = Math.max(0, groundY - player.y);
  const shadowScale = Math.max(0.45, 1 - airHeight / (height * 0.24));
  const shadowAlpha = Math.max(0.1, 0.34 - airHeight / (height * 0.85));

  ctx.save();
  ctx.translate(playerX, groundY + 4);
  ctx.rotate(player.groundAngle);
  ctx.scale(shadowScale, 1);
  ctx.beginPath();
  ctx.ellipse(0, 0, playerWidth * 0.36, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(14, 20, 16, ${shadowAlpha})`;
  ctx.fill();
  ctx.restore();

  game.dust.forEach((particle) => {
    const progress = particle.age / particle.life;
    const screenX = particle.x - game.worldX;
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - progress) * 0.36;
    ctx.beginPath();
    ctx.arc(screenX, particle.y, particle.size * (1 + progress), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(241, 214, 154, 0.75)';
    ctx.fill();
    ctx.restore();
  });

  if (player.stateBlend < 1 && previousCharacterImage !== characterImage) {
    drawAnchoredSprite(
      ctx,
      previousCharacterImage,
      playerX,
      player.y,
      playerWidth,
      playerHeight,
      PLAYER_WHEEL_ANCHOR_X,
      PLAYER_WHEEL_ANCHOR_Y,
      player.rotation,
      1 - player.stateBlend
    );
  }
  drawAnchoredSprite(
    ctx,
    characterImage,
    playerX,
    player.y,
    playerWidth,
    playerHeight,
    PLAYER_WHEEL_ANCHOR_X,
    PLAYER_WHEEL_ANCHOR_Y,
    player.rotation,
    player.stateBlend
  );

  ctx.save();
  ctx.translate(playerX, player.y);
  ctx.rotate(player.rotation);
  ctx.strokeStyle = 'rgba(250, 214, 142, 0.7)';
  ctx.lineWidth = 1.4;
  [-0.22, 0.22].forEach((offset) => {
    const wheelX = playerWidth * offset;
    const wheelY = -playerHeight * 0.05;
    ctx.save();
    ctx.translate(wheelX, wheelY);
    ctx.rotate(player.wheelSpin);
    ctx.beginPath();
    ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
    ctx.moveTo(-5, 0);
    ctx.lineTo(5, 0);
    ctx.moveTo(0, -5);
    ctx.lineTo(0, 5);
    ctx.stroke();
    ctx.restore();
  });
  ctx.restore();

  if (game.feedback && game.status === 'playing') {
    const progress = Math.min(1, game.feedback.age / FEEDBACK_DURATION);
    const alpha = Math.sin((1 - progress) * Math.PI * 0.5);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = '800 22px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fillText(game.feedback.text, width / 2, height * 0.18 - progress * 18);
    if (game.feedback.score) {
      ctx.font = '700 16px Space Grotesk, sans-serif';
      ctx.fillStyle = 'rgba(250, 204, 21, 0.92)';
      ctx.fillText(game.feedback.score, width / 2, height * 0.18 + 24 - progress * 18);
    }
    ctx.restore();
  }
}

function EndlessSkatingPage() {
  const canvasRef = useRef(null);
  const gameRef = useRef(createGameState(INITIAL_HUD.best));
  const frameRef = useRef(0);
  const [phase, setPhase] = useState('menu');
  const [hud, setHud] = useState(INITIAL_HUD);
  const { loaded, imagesRef } = useGameAssets();

  const syncHud = useCallback(() => {
    const game = gameRef.current;
    setHud({
      score: Math.floor(game.score),
      distance: Math.floor(game.distance),
      stars: game.starCount,
      combo: game.combo,
      best: game.best,
    });
    setPhase(game.status);
  }, []);

  const resetGame = useCallback((status = 'instructions') => {
    const best = Number(window.localStorage?.getItem('endless-skating-best') || 0);
    const next = createGameState(best);
    next.status = status;
    addChunk(next, 580);
    addChunk(next, 1340);
    gameRef.current = next;
    syncHud();
  }, [syncHud]);

  const startRun = useCallback(() => {
    const game = gameRef.current;
    window.localStorage?.setItem('endless-skating-seen-instructions', 'true');
    game.hasSeenInstructions = true;
    game.status = 'playing';
    game.message = 'Ayubowan!';
    game.feedback = { text: 'AYUBOWAN!', score: '', age: 0 };
    game.lastTime = performance.now();
    setPhase('playing');
  }, []);

  const restartRun = useCallback(() => {
    const best = Number(window.localStorage?.getItem('endless-skating-best') || 0);
    const next = createGameState(best);
    next.status = 'playing';
    next.hasSeenInstructions = true;
    next.feedback = { text: 'GO!', score: '', age: 0 };
    next.lastTime = performance.now();
    addChunk(next, 580);
    addChunk(next, 1340);
    gameRef.current = next;
    syncHud();
  }, [syncHud]);

  const jump = useCallback(() => {
    const game = gameRef.current;
    if (game.status !== 'playing') {
      return;
    }
    if (game.player.grounded && game.player.movementPhase === 'ride') {
      const playerWorldX = game.worldX + window.innerWidth * game.player.xRatio;
      const downhillBoost = Math.max(0, terrainAngle(playerWorldX, window.innerHeight)) * 180;
      game.player.movementPhase = 'takeoff';
      game.player.phaseTimer = 0;
      game.player.takeoffVelocity = -590 - Math.min(95, downhillBoost) - Math.max(0, game.speed - 300) * 0.16;
      game.player.completedFlips = 0;
      setPlayerState(game.player, 'crouch');
    }
  }, []);

  const press = useCallback(() => {
    const game = gameRef.current;
    game.inputHeld = true;
    jump();
  }, [jump]);

  const release = useCallback(() => {
    gameRef.current.inputHeld = false;
  }, []);

  useEffect(() => {
    resetGame('menu');
  }, [resetGame]);

  useEffect(() => {
    const onGameActionClick = (event) => {
      if (event.defaultPrevented) {
        return;
      }

      const actionElement = event.target.closest?.('[data-skating-action]');
      if (!actionElement) {
        return;
      }

      const action = actionElement.getAttribute('data-skating-action');
      if (action === 'instructions') {
        resetGame('instructions');
      }
      if (action === 'start') {
        startRun();
      }
      if (action === 'restart') {
        restartRun();
      }
    };

    document.addEventListener('click', onGameActionClick);
    return () => {
      document.removeEventListener('click', onGameActionClick);
    };
  }, [resetGame, restartRun, startRun]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code !== 'Space') {
        return;
      }
      event.preventDefault();
      if (!event.repeat) {
        press();
      }
    };
    const onKeyUp = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        release();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [press, release]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) {
      return undefined;
    }
    const ctx = canvas.getContext('2d');
    let lastHudUpdate = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * ratio);
      canvas.height = Math.floor(rect.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const game = gameRef.current;
      const playerWorldX = game.worldX + rect.width * game.player.xRatio;
      game.player.y = terrainY(playerWorldX, rect.height);
    };

    const tick = (now) => {
      const rect = canvas.getBoundingClientRect();
      const game = gameRef.current;
      const dt = Math.min(0.033, Math.max(0, (now - (game.lastTime || now)) / 1000));
      game.lastTime = now;
      updateGame(game, dt, rect.width, rect.height);
      renderGame(ctx, imagesRef.current, game, rect.width, rect.height);
      if (now - lastHudUpdate > 120 || game.status !== phase) {
        syncHud();
        lastHudUpdate = now;
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    resize();
    frameRef.current = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [imagesRef, loaded, phase, syncHud]);

  const finalStats = useMemo(() => ({
    score: hud.score.toLocaleString(),
    distance: `${hud.distance.toLocaleString()} m`,
    stars: hud.stars.toLocaleString(),
    best: hud.best.toLocaleString(),
  }), [hud]);

  return (
    <main className="skating-game-page">
      <canvas
        ref={canvasRef}
        className={`skating-game-canvas ${phase === 'playing' ? 'is-playing' : ''}`}
        aria-label="Sri Lankan endless skating game"
        onPointerDown={press}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
      />

      <div className="skating-hud" aria-live="polite">
        <span className="skating-hud-distance"><strong>{hud.distance.toLocaleString()} m</strong></span>
        <span className="skating-hud-secondary">★ <strong>{hud.stars}</strong></span>
        <span className="skating-hud-secondary">x<strong>{hud.combo}</strong></span>
        <span className="skating-hud-score">Score <strong>{hud.score.toLocaleString()}</strong></span>
      </div>

      <Link className="skating-home-link" to="/">
        Home
      </Link>

      {!loaded ? (
        <section className="skating-overlay">
          <p className="hero-eyebrow">Loading assets</p>
          <h1>Endless Skating</h1>
        </section>
      ) : null}

      {loaded && phase === 'menu' ? (
        <section className="skating-overlay">
          <p className="hero-eyebrow">Sri Lankan Endless Skating Adventure</p>
          <h1>Endless Skating</h1>
          <p>Ride through Sigiriya sunsets, temple mist, Ella bridges, Colombo glow, and Sri Pada dawn.</p>
          <button
            type="button"
            className="primary-button"
            data-skating-action="instructions"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              resetGame('instructions');
            }}
          >
            Start
          </button>
        </section>
      ) : null}

      {loaded && phase === 'instructions' ? (
        <section className="skating-overlay skating-overlay-compact">
          <p className="hero-eyebrow">How to ride</p>
          <h1>Stay Smooth</h1>
          <p>Press SPACE or tap the screen to jump.</p>
          <p>Hold while in the air to perform a backflip.</p>
          <p>Collect stars, avoid rocks, and travel as far as possible.</p>
          <button
            type="button"
            className="primary-button"
            data-skating-action="start"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              startRun();
            }}
          >
            Begin Run
          </button>
        </section>
      ) : null}

      {phase === 'gameover' ? (
        <section className="skating-overlay skating-overlay-compact">
          <p className="hero-eyebrow">Run complete</p>
          <h1>Game Over</h1>
          <div className="skating-results">
            <span>Score <strong>{finalStats.score}</strong></span>
            <span>Distance <strong>{finalStats.distance}</strong></span>
            <span>Stars <strong>{finalStats.stars}</strong></span>
            <span>Best <strong>{finalStats.best}</strong></span>
          </div>
          <div className="skating-actions">
            <button
              type="button"
              className="primary-button"
              data-skating-action="restart"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                restartRun();
              }}
            >
              Restart
            </button>
            <Link className="secondary-button" to="/">
              Home
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default EndlessSkatingPage;
