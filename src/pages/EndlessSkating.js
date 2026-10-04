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

const terrainY = (worldX, height) => {
  const base = height * 0.66;
  const longWave = Math.sin(worldX / 620) * height * 0.075;
  const shortWave = Math.sin(worldX / 245 + 1.8) * height * 0.038;
  return base + longWave + shortWave;
};

const terrainSlope = (worldX, height) => terrainY(worldX + 8, height) - terrainY(worldX - 8, height);

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
    speed: 345,
    player: {
      xRatio: 0.25,
      y: 0,
      velocityY: 0,
      grounded: true,
      rotation: 0,
      completedFlips: 0,
      state: 'push',
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
  };
}

function addChunk(game, startX) {
  const chunkWidth = 760;
  const pattern = Math.floor(startX / chunkWidth) % 4;

  for (let i = 0; i < 8; i += 1) {
    const x = startX + 110 + i * 72;
    const arc = pattern === 1 ? Math.sin((i / 7) * Math.PI) * 120 : 0;
    game.stars.push({
      x,
      yOffset: 118 + arc + (pattern === 2 && i % 2 ? 42 : 0),
      collected: false,
      pulse: (i * 0.37) % 1,
    });
  }

  if (pattern !== 3) {
    game.obstacles.push({
      x: startX + 430,
      size: 58 + (pattern % 2) * 10,
      hit: false,
    });
  }

  game.decor.push(
    { type: pattern % 2 ? 'treeA' : 'treeB', x: startX + 170, layer: 'near', scale: 0.26 },
    { type: pattern === 2 ? 'peacock' : 'deer', x: startX + 570, layer: 'near', scale: pattern === 2 ? 0.16 : 0.18 },
    { type: pattern % 2 ? 'balloonA' : 'balloonB', x: startX + 300, layer: 'sky', scale: 0.13 }
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

function drawSprite(ctx, image, x, y, width, height, rotation = 0, alpha = 1) {
  if (!image) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(rotation);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function drawTerrain(ctx, game, width, height, playerWorldX) {
  const horizon = height * 0.55;
  const points = [];
  for (let x = -32; x <= width + 48; x += 18) {
    const world = playerWorldX + x - width * game.player.xRatio;
    points.push([x, terrainY(world, height)]);
  }

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  points.forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.lineTo(width + 60, height + 80);
  ctx.lineTo(-60, height + 80);
  ctx.closePath();
  const groundGradient = ctx.createLinearGradient(0, horizon, 0, height);
  groundGradient.addColorStop(0, '#315f37');
  groundGradient.addColorStop(0.45, '#1e4d30');
  groundGradient.addColorStop(1, '#102517');
  ctx.fillStyle = groundGradient;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  points.forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.strokeStyle = 'rgba(250, 214, 129, 0.9)';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1] + 10);
  points.forEach(([x, y]) => ctx.lineTo(x, y + 10));
  ctx.strokeStyle = 'rgba(20, 83, 45, 0.7)';
  ctx.lineWidth = 8;
  ctx.stroke();
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
  const groundY = terrainY(playerWorldX, height) - 66;

  if (game.status === 'crashed') {
    player.crashTimer += dt;
    player.rotation += dt * 3.5;
    if (player.crashTimer > 1) {
      game.status = 'gameover';
      game.message = 'Game Over';
      game.best = Math.max(game.best, Math.floor(game.score));
      window.localStorage?.setItem('endless-skating-best', String(game.best));
    }
    return;
  }

  game.speed = Math.min(560, game.speed + dt * 2.6);
  game.worldX += game.speed * dt;
  game.distance = game.worldX / 10;
  game.score = game.distance * 3 + game.starCount * 100 + game.trickScore;

  const slope = terrainSlope(playerWorldX, height);
  if (player.grounded) {
    player.y = groundY;
    player.rotation = Math.atan2(slope, 16) * 0.22;
    player.state = slope > 3.2 ? 'crouch' : game.speed < 380 ? 'push' : 'ride';
  } else {
    player.velocityY += 1080 * dt;
    player.y += player.velocityY * dt;
    if (game.inputHeld) {
      player.rotation -= 7.2 * dt;
      player.state = 'backflip';
    } else if (player.velocityY < -190) {
      player.state = 'highAir';
    } else if (player.velocityY < 130) {
      player.state = 'grab';
    } else {
      player.state = 'landing';
    }

    const fullFlips = Math.floor(Math.abs(player.rotation) / (Math.PI * 2));
    player.completedFlips = Math.max(player.completedFlips, fullFlips);

    if (player.y >= groundY) {
      const normalizedRotation = Math.abs((((player.rotation % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      const landedCleanly = normalizedRotation < 0.72 || player.completedFlips > 0;
      if (!landedCleanly) {
        game.status = 'crashed';
        game.message = 'Bad landing';
        player.crashTimer = 0;
        return;
      }
      if (player.completedFlips > 0) {
        game.combo = Math.min(8, game.combo + player.completedFlips);
        game.trickScore += 450 * player.completedFlips * game.combo;
        game.message = player.completedFlips > 1 ? 'Double backflip!' : 'Backflip!';
      }
      player.grounded = true;
      player.y = groundY;
      player.velocityY = 0;
      player.rotation = 0;
      player.completedFlips = 0;
      player.state = 'landing';
    }
  }

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
        game.message = 'Star combo!';
      }
    }
  });

  game.obstacles.forEach((obstacle) => {
    if (obstacle.hit) {
      return;
    }
    const obstacleScreenX = obstacle.x - game.worldX;
    const obstacleY = terrainY(obstacle.x, height) - obstacle.size * 0.64;
    const dx = obstacleScreenX - width * player.xRatio;
    const dy = obstacleY - player.y;
    if (Math.abs(dx) < 42 && Math.abs(dy) < 54 && player.grounded) {
      obstacle.hit = true;
      game.status = 'crashed';
      game.message = 'You hit a rock';
      player.crashTimer = 0;
    }
  });

  const pruneBefore = game.worldX - width;
  game.stars = game.stars.filter((star) => star.x > pruneBefore && !star.collected);
  game.obstacles = game.obstacles.filter((obstacle) => obstacle.x > pruneBefore);
  game.decor = game.decor.filter((item) => item.x > pruneBefore);
}

function renderGame(ctx, images, game, width, height) {
  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, images, game, width, height);

  game.decor.forEach((item) => {
    const image = images[item.type];
    if (!image) {
      return;
    }
    const parallax = item.layer === 'sky' ? 0.18 : 0.72;
    const screenX = item.x - game.worldX * parallax + (item.layer === 'sky' ? width * 0.2 : 0);
    const ground = item.layer === 'sky' ? height * 0.18 : terrainY(item.x, height) - 92;
    const size = Math.min(width, height) * item.scale;
    drawSprite(ctx, image, screenX, ground, size * (image.width / image.height), size);
  });

  drawTerrain(ctx, game, width, height, game.worldX + width * game.player.xRatio);

  game.stars.forEach((star) => {
    const screenX = star.x - game.worldX;
    if (screenX < -80 || screenX > width + 80) {
      return;
    }
    const pulse = 1 + Math.sin((game.distance / 18) + star.pulse * Math.PI * 2) * 0.08;
    const size = 34 * pulse;
    const starY = terrainY(star.x, height) - star.yOffset;
    drawSprite(ctx, images.star, screenX - size / 2, starY - size / 2, size, size);
  });

  game.obstacles.forEach((obstacle) => {
    const screenX = obstacle.x - game.worldX;
    if (screenX < -120 || screenX > width + 120) {
      return;
    }
    const size = obstacle.size;
    drawSprite(ctx, images.rock, screenX - size / 2, terrainY(obstacle.x, height) - size * 0.88, size * 1.38, size);
  });

  const player = game.player;
  const characterImage = images[player.state] || images.ride;
  const playerHeight = Math.max(110, Math.min(172, height * 0.22));
  const playerWidth = playerHeight * 0.78;
  drawSprite(
    ctx,
    characterImage,
    width * player.xRatio - playerWidth / 2,
    player.y - playerHeight + 18,
    playerWidth,
    playerHeight,
    player.rotation
  );

  if (game.message && game.status === 'playing') {
    ctx.save();
    ctx.font = '700 24px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fillText(game.message, width / 2, height * 0.18);
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
    game.status = 'playing';
    game.message = 'Ayubowan!';
    game.lastTime = performance.now();
    setPhase('playing');
  }, []);

  const jump = useCallback(() => {
    const game = gameRef.current;
    if (game.status !== 'playing') {
      return;
    }
    if (game.player.grounded) {
      game.player.grounded = false;
      game.player.velocityY = -565;
      game.player.rotation = 0;
      game.player.completedFlips = 0;
      game.player.state = 'jump';
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
      game.player.y = terrainY(playerWorldX, rect.height) - 66;
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
        className="skating-game-canvas"
        aria-label="Sri Lankan endless skating game"
        onPointerDown={press}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
      />

      <div className="skating-hud" aria-live="polite">
        <span>Score <strong>{hud.score.toLocaleString()}</strong></span>
        <span>Distance <strong>{hud.distance.toLocaleString()} m</strong></span>
        <span>Stars <strong>{hud.stars}</strong></span>
        <span>Combo <strong>x{hud.combo}</strong></span>
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
          <button type="button" className="primary-button" onClick={() => resetGame('instructions')}>
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
          <button type="button" className="primary-button" onClick={startRun}>
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
            <button type="button" className="primary-button" onClick={() => resetGame('instructions')}>
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
