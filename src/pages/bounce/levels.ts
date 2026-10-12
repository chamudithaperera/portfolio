import {LevelData, SeasonTheme, SpringType} from './types';

export const SEASONS: SeasonTheme[] = [
  {
    id: 1,
    name: 'Sunny Meadow',
    subtitle: 'Vivid Skies & Grassy Steppes',
    description: 'Bright cyan skies, rolling hills, bridges, lifts, and golden egg collectibles.',
    skyColor: '#00d2ff',
    platformColor: '#0e331b',
    platformGrassColor: '#5cd600',
    patternColor: '#0a2714',
    cloudColor: '#ffffff',
  },
  {
    id: 2,
    name: 'Sunset Highlands',
    subtitle: 'Golden Peaks & Floating Isles',
    description: 'Elevated floating tree islands, chasm bridges, industrial lifts, and spring towers.',
    skyColor: '#06b6d4',
    platformColor: '#1e293b',
    platformGrassColor: '#eab308',
    patternColor: '#0f172a',
    cloudColor: '#fef08a',
  },
  {
    id: 3,
    name: 'Emerald Haven',
    subtitle: 'Deep Canopy & Steep Spires',
    description: 'Towering tree stumps, soaring mega mushroom springs, rope bridges, and high-altitude lifts.',
    skyColor: '#0284c7',
    platformColor: '#06281e',
    platformGrassColor: '#10b981',
    patternColor: '#031711',
    cloudColor: '#ecfdf5',
  },
];

const ZONE_DESIGNS: Record<number, {title: string; theme: string}[]> = {
  1: [
    {title: 'Meadow Gateway', theme: 'compact-starter'},
    {title: 'Twin Bridge Isles', theme: 'dual-bridges'},
    {title: 'Sky Alcove Ascent', theme: 'vertical-lift-tower'},
    {title: 'Mushroom Ridge', theme: 'spring-leap-plateau'},
    {title: 'Floating Steppes', theme: 'multi-island-chain'},
    {title: 'Chasm Crossing', theme: 'deep-pit-ropeway'},
    {title: 'Fern High Ledges', theme: 'tiered-cliffs'},
    {title: 'Super Spring Sanctuary', theme: 'super-bounce-maze'},
    {title: 'Labyrinthine Ledge', theme: 'long-traverse-valley'},
    {title: 'Meadow Apex Citadel', theme: 'grand-summit-citadel'},
  ],
  2: [
    {title: 'Highland Overlook', theme: 'elevated-start'},
    {title: 'Double Lift Valley', theme: 'dual-elevator-cables'},
    {title: 'Suspension Gorge', theme: 'high-altitude-bridges'},
    {title: 'Highland Spring Spire', theme: 'spiral-spring-towers'},
    {title: 'Bomb Pass Floating Isles', theme: 'bomb-hazards-corridor'},
    {title: 'Golden Peak Ledges', theme: 'stairway-to-clouds'},
    {title: 'Summit Mega Bounce', theme: 'triple-mushroom-skyway'},
    {title: 'Sky Chimney Bastion', theme: 'vertical-lift-chasm'},
    {title: 'Timber Tree Citadel', theme: 'tree-canopy-islands'},
    {title: 'Highland Crown Peak', theme: 'epic-far-highland'},
  ],
  3: [
    {title: 'Emerald Forest Gate', theme: 'dense-steppes'},
    {title: 'Trunk Bridge Valley', theme: 'long-bridge-spans'},
    {title: 'Fern Spire Ascender', theme: 'high-rise-elevators'},
    {title: 'Mushroom Canopy Way', theme: 'mega-spring-highways'},
    {title: 'Lethal Thorns Ravine', theme: 'spike-trap-crossing'},
    {title: 'Verdant Triple Spires', theme: 'three-pillar-bastions'},
    {title: 'Bramble Air Tram', theme: 'horizontal-moving-lifts'},
    {title: 'Infinite Canopy Citadel', theme: 'massive-expanse-maze'},
    {title: 'Emerald Dragon Ascent', theme: 'sky-ladder-catapults'},
    {title: 'Infinite Haven Apex', theme: 'legendary-mega-map'},
  ],
};

export function generateLevels(): LevelData[] {
  const levels: LevelData[] = [];

  for (let s = 1; s <= 3; s++) {
    for (let l = 1; l <= 10; l++) {
      const globalId = (s - 1) * 10 + l;
      const diffLabel = l <= 3 ? 'Easy' : l <= 7 ? 'Medium' : 'Hard';
      const zoneInfo = ZONE_DESIGNS[s]?.[l - 1] || {title: `Stage ${l}`, theme: 'custom'};

      const platforms: LevelData['platforms'] = [];
      const bridges: LevelData['bridges'] = [];
      const lifts: LevelData['lifts'] = [];
      const checkpoints: LevelData['checkpoints'] = [];
      const eggs: LevelData['eggs'] = [];
      const keys: LevelData['keys'] = [];
      const bombs: LevelData['bombs'] = [];
      const spikes: LevelData['spikes'] = [];
      const ladders: LevelData['ladders'] = [];
      const springs: LevelData['springs'] = [];

      // World scale scaling: early levels (e.g. World 1-1, 1-2) are compact and fast to complete.
      // Higher levels and World 2/3 expand drastically into vast adventure maps (X spans from -8 to +60)!
      const worldScale = 1.0 + (s - 1) * 0.35 + (l - 1) * 0.12;

      // -----------------------------------------------------------------------------------
      // 1. UNIQUE PROCEDURAL ARCHITECTURE GENERATION BASED ON (SEASON, LEVEL)
      // -----------------------------------------------------------------------------------
      
      // Start Zone
      platforms.push({
        id: 1,
        position: [-7.0, -0.5, 0],
        size: [6.0, 1.8, 3.5],
        hasSproutFern: true,
        fernPosition: [-4.5, 0.4, 0],
      });

      checkpoints.push({
        id: 1,
        position: [-8.5, 0.8, 0],
        activated: true,
      });

      // Spring on start platform to reach forward easily
      springs.push({
        id: springs.length + 1,
        type: 'leaf',
        position: [-4.8, 0.5, 0],
        powerMultiplier: 2.0,
      });

      // KEY 1: Found in the first territory
      let key1Pos: [number, number, number] = [-4.8, 1.8, 0];

      // Custom Layout Variations per stage:
      if (l === 1) {
        // --- LEVEL 1: Compact Starter Map ---
        // Quick bridge -> Main platform with Key 1 -> Lift & Spring -> Floating land with Key 2 -> Spring to Key 3 & Exit!
        bridges.push({id: 1, position: [-2.2, 0.2, 0], length: 3.4});
        eggs.push({id: 1, position: [-2.2, 0.9, 0], collected: false, score: 100});

        // Main platform
        platforms.push({
          id: 2,
          position: [1.6, 0.2, 0],
          size: [4.4, 1.6, 3.5],
          hasSproutFern: true,
        });
        key1Pos = [1.6, 1.4, 0];

        // Dedicated Spring on Main Platform to launch directly to Floating Land
        springs.push({
          id: springs.length + 1,
          type: 'super',
          position: [3.2, 1.1, 0],
          powerMultiplier: 2.3,
        });

        // Lift
        lifts.push({
          id: 1,
          startPosition: [5.8, 0.6, 0],
          travelDistance: 3.8,
          axis: 'y',
          speed: 1.8,
          platformWidth: 3.2,
        });

        // Floating Land
        platforms.push({
          id: 3,
          position: [10.2, 4.0, 0],
          size: [5.0, 1.2, 3.5],
          hasSproutFern: true,
        });
        // Key 2 on floating land
        keys.push({id: 2, position: [9.5, 5.2, 0], collected: false});

        checkpoints.push({id: 2, position: [11.5, 5.0, 0], activated: false});

        // Spring on Floating Land to launch towards the Launchpad / Summit
        springs.push({
          id: springs.length + 1,
          type: 'leaf',
          position: [12.0, 4.7, 0],
          powerMultiplier: 2.0,
        });

        // Spring launchpad to summit
        platforms.push({id: 4, position: [14.6, 4.0, 0], size: [3.0, 1.2, 3.5]});
        springs.push({
          id: springs.length + 1,
          type: 'mushroom',
          position: [14.6, 4.7, 0],
          powerMultiplier: 2.6,
        });

        // Exit Summit
        platforms.push({id: 5, position: [19.8, 8.4, 0], size: [5.6, 1.4, 3.5]});
        // Key 3 on Summit before the exit door
        keys.push({id: 3, position: [18.2, 9.6, 0], collected: false});

      } else if (l === 2) {
        // --- LEVEL 2: Twin Bridge Isles & Floating Sky Lands ---
        bridges.push({id: 1, position: [-2.0, 0.2, 0], length: 3.6});
        platforms.push({id: 2, position: [2.2, 0.3, 0], size: [4.4, 1.6, 3.5]});

        // Spring positioned at clear entrance of Platform 2 to launch onto Floating Land 3 cleanly
        springs.push({
          id: springs.length + 1,
          type: 'super',
          position: [0.3, 1.2, 0],
          powerMultiplier: 2.3,
        });

        // High Floating Land positioned with clear landing access
        platforms.push({id: 3, position: [3.2, 4.4, 0], size: [4.0, 1.0, 3.5]});
        key1Pos = [3.2, 5.4, 0]; // Key 1 atop high floating land!

        // Spring ON Floating Land 3 to easily leap across to the next high path
        springs.push({
          id: springs.length + 1,
          type: 'leaf',
          position: [4.6, 5.0, 0],
          powerMultiplier: 2.1,
        });

        // Bridge 2
        bridges.push({id: 2, position: [6.8, 0.3, 0], length: 3.8});
        platforms.push({id: 4, position: [11.2, 0.5, 0], size: [4.6, 1.6, 3.5]});
        checkpoints.push({id: 2, position: [9.8, 1.8, 0], activated: false});

        // Spring on Platform 4 to reach upper Floating Sky Island
        springs.push({
          id: springs.length + 1,
          type: 'super',
          position: [12.8, 1.4, 0],
          powerMultiplier: 2.4,
        });

        // Lift to upper bridge
        lifts.push({
          id: 1,
          startPosition: [15.2, 1.0, 0],
          travelDistance: 4.5,
          axis: 'y',
          speed: 1.8,
          platformWidth: 3.4,
        });

        // Floating Sky Island
        platforms.push({id: 5, position: [20.0, 5.2, 0], size: [5.2, 1.2, 3.5]});
        keys.push({id: 2, position: [19.2, 6.4, 0], collected: false}); // Key 2

        // Spring ON Floating Sky Island to launch to the far peak
        springs.push({
          id: springs.length + 1,
          type: 'leaf',
          position: [21.8, 5.9, 0],
          powerMultiplier: 2.1,
        });

        // Super spring launchpad to far peak
        platforms.push({id: 6, position: [25.0, 5.2, 0], size: [3.4, 1.2, 3.5]});
        springs.push({
          id: springs.length + 1,
          type: 'mushroom',
          position: [25.0, 5.9, 0],
          powerMultiplier: 2.7,
        });

        platforms.push({id: 7, position: [31.0, 9.8, 0], size: [6.0, 1.4, 3.5]});
        keys.push({id: 3, position: [29.5, 11.0, 0], collected: false}); // Key 3

      } else if (l === 3) {
        // --- LEVEL 3: Vertical Double Lift Alcove & Stepped Plateau ---
        platforms.push({id: 2, position: [-1.0, 1.2, 0], size: [4.8, 2.4, 3.5]});
        key1Pos = [-1.0, 2.8, 0];

        // Spring on Platform 2 to reach Floating Land 3 directly
        springs.push({
          id: springs.length + 1,
          type: 'super',
          position: [0.8, 2.5, 0],
          powerMultiplier: 2.4,
        });

        // Lift 1
        lifts.push({
          id: 1,
          startPosition: [3.6, 1.4, 0],
          travelDistance: 4.0,
          axis: 'y',
          speed: 2.0,
          platformWidth: 3.4,
        });

        // Floating Land 3
        platforms.push({id: 3, position: [8.2, 5.0, 0], size: [5.0, 1.2, 3.5]});
        checkpoints.push({id: 2, position: [7.0, 6.0, 0], activated: false});
        keys.push({id: 2, position: [8.8, 6.2, 0], collected: false}); // Key 2

        // Spring ON Floating Land 3 to launch across the chasm
        springs.push({
          id: springs.length + 1,
          type: 'leaf',
          position: [10.0, 5.7, 0],
          powerMultiplier: 2.2,
        });

        // Rope Bridge across chasm
        bridges.push({id: 1, position: [13.0, 5.6, 0], length: 4.4});

        // Intermediate Springboard Platform
        platforms.push({id: 4, position: [17.6, 5.0, 0], size: [4.2, 1.2, 3.5]});
        springs.push({
          id: springs.length + 1,
          type: 'mushroom',
          position: [17.6, 5.7, 0],
          powerMultiplier: 2.8,
        });

        // Towering Citadel
        platforms.push({id: 5, position: [24.2, 10.5, 0], size: [6.5, 1.4, 3.5]});
        keys.push({id: 3, position: [22.8, 11.8, 0], collected: false}); // Key 3

      } else if (l <= 6) {
        // --- LEVEL 4-6: Multi-Tiered Long Valley with Springs & Floating Lands ---
        const spanX1 = 2.0 * worldScale;
        platforms.push({id: 2, position: [spanX1, 0.4, 0], size: [4.8, 1.8, 3.5]});

        // Spring before Secret High Terrace with clear upward-forward path
        springs.push({
          id: springs.length + 1,
          type: 'super',
          position: [spanX1 - 1.8, 1.4, 0],
          powerMultiplier: 2.4,
        });

        // Secret High Floating Terrace
        platforms.push({id: 3, position: [spanX1 + 1.2, 5.2, 0], size: [4.2, 1.2, 3.5]});
        key1Pos = [spanX1 + 1.2, 6.4, 0]; // Key 1 in the clouds

        // Spring ON Secret High Terrace to launch forward
        springs.push({
          id: springs.length + 1,
          type: 'leaf',
          position: [spanX1 + 2.8, 5.9, 0],
          powerMultiplier: 2.2,
        });

        checkpoints.push({id: 2, position: [spanX1 + 1.6, 1.6, 0], activated: false});

        // Horizontal Bridge & Moving Platform
        const bridgeX = spanX1 + 5.6;
        bridges.push({id: 1, position: [bridgeX, 0.4, 0], length: 4.0});

        const spanX2 = bridgeX + 5.4;
        platforms.push({id: 4, position: [spanX2, 0.6, 0], size: [4.6, 1.8, 3.5]});

        // Spring on Platform 4 to reach Floating Island 5
        springs.push({
          id: springs.length + 1,
          type: 'super',
          position: [spanX2 + 1.6, 1.6, 0],
          powerMultiplier: 2.5,
        });

        // Vertical Lift
        const liftX = spanX2 + 4.8;
        lifts.push({
          id: 1,
          startPosition: [liftX, 1.2, 0],
          travelDistance: 5.2,
          axis: 'y',
          speed: 1.8,
          platformWidth: 3.4,
        });

        // Floating Island
        const floatX = liftX + 4.8;
        platforms.push({id: 5, position: [floatX, 6.0, 0], size: [5.2, 1.2, 3.5]});
        keys.push({id: 2, position: [floatX, 7.2, 0], collected: false}); // Key 2

        // Spring ON Floating Island 5
        springs.push({
          id: springs.length + 1,
          type: 'leaf',
          position: [floatX + 2.0, 6.7, 0],
          powerMultiplier: 2.2,
        });

        // Upper Bridge
        const bridge2X = floatX + 4.8;
        bridges.push({id: 2, position: [bridge2X, 6.6, 0], length: 4.2});

        // Launchpad
        const launchX = bridge2X + 4.8;
        platforms.push({id: 6, position: [launchX, 5.8, 0], size: [3.8, 1.2, 3.5]});
        springs.push({
          id: springs.length + 1,
          type: 'mushroom',
          position: [launchX, 6.5, 0],
          powerMultiplier: 2.9,
        });

        // Summit
        const summitX = launchX + 6.5;
        platforms.push({id: 7, position: [summitX, 11.5, 0], size: [6.8, 1.5, 3.5]});
        checkpoints.push({id: 3, position: [summitX - 2.0, 12.6, 0], activated: false});
        keys.push({id: 3, position: [summitX - 0.5, 12.8, 0], collected: false}); // Key 3

      } else {
        // --- LEVEL 7-10: VAST EPIC FAR EXPEDITIONS WITH HIGH-FLYING SPRINGS ---
        const step1X = 2.5;
        platforms.push({id: 2, position: [step1X, 0.5, 0], size: [5.0, 2.0, 3.5]});

        // Spring to High Secret Tower
        springs.push({
          id: springs.length + 1,
          type: 'super',
          position: [step1X - 1.8, 1.6, 0],
          powerMultiplier: 2.5,
        });

        // High Secret Floating Tower
        platforms.push({id: 3, position: [step1X + 1.2, 5.8, 0], size: [3.8, 1.2, 3.5]});
        key1Pos = [step1X + 1.2, 7.0, 0]; // Key 1 atop secret tower

        // Spring ON High Secret Tower
        springs.push({
          id: springs.length + 1,
          type: 'leaf',
          position: [step1X + 2.5, 6.5, 0],
          powerMultiplier: 2.2,
        });

        // Bridge 1
        const b1X = step1X + 5.4;
        bridges.push({id: 1, position: [b1X, 0.4, 0], length: 4.8});

        // Mid Terrace
        const step2X = b1X + 5.4;
        platforms.push({id: 4, position: [step2X, 0.6, 0], size: [5.2, 2.0, 3.5]});
        checkpoints.push({id: 2, position: [step2X, 1.8, 0], activated: false});

        // Spring on Platform 4 to reach Floating Isle 1
        springs.push({
          id: springs.length + 1,
          type: 'super',
          position: [step2X + 1.8, 1.7, 0],
          powerMultiplier: 2.5,
        });

        // Lift 1 (Vertical ascent)
        const lift1X = step2X + 5.2;
        lifts.push({
          id: 1,
          startPosition: [lift1X, 1.2, 0],
          travelDistance: 5.4,
          axis: 'y',
          speed: 1.9,
          platformWidth: 3.4,
        });

        // Floating Isle 1
        const isle1X = lift1X + 5.0;
        platforms.push({id: 5, position: [isle1X, 6.2, 0], size: [5.4, 1.2, 3.5]});
        keys.push({id: 2, position: [isle1X, 7.4, 0], collected: false}); // Key 2 on Floating Isle

        // Spring ON Floating Isle 1
        springs.push({
          id: springs.length + 1,
          type: 'leaf',
          position: [isle1X + 2.0, 6.9, 0],
          powerMultiplier: 2.2,
        });

        // Bridge 2
        const b2X = isle1X + 5.2;
        bridges.push({id: 2, position: [b2X, 6.8, 0], length: 4.6});

        // Sky Island with Super Spring
        const skyX = b2X + 5.2;
        platforms.push({id: 6, position: [skyX, 6.2, 0], size: [4.4, 1.2, 3.5]});
        springs.push({
          id: springs.length + 1,
          type: 'super',
          position: [skyX + 1.2, 6.9, 0],
          powerMultiplier: 2.5,
        });

        // High Sky Tram Platform
        const skyTramX = skyX + 5.0;
        platforms.push({id: 7, position: [skyTramX, 9.8, 0], size: [4.8, 1.2, 3.5]});
        checkpoints.push({id: 3, position: [skyTramX - 1.2, 10.8, 0], activated: false});

        // Spring ON High Sky Tram Platform
        springs.push({
          id: springs.length + 1,
          type: 'super',
          position: [skyTramX + 1.6, 10.5, 0],
          powerMultiplier: 2.4,
        });

        // Lift 2 (Sky Elevator)
        const lift2X = skyTramX + 5.0;
        lifts.push({
          id: 2,
          startPosition: [lift2X, 9.8, 0],
          travelDistance: 4.5,
          axis: 'y',
          speed: 2.0,
          platformWidth: 3.4,
        });

        // Launchpad to Final Summit
        const launchX = lift2X + 5.0;
        platforms.push({id: 8, position: [launchX, 13.8, 0], size: [3.8, 1.2, 3.5]});
        springs.push({
          id: springs.length + 1,
          type: 'mushroom',
          position: [launchX, 14.5, 0],
          powerMultiplier: 3.0,
        });

        // GRAND FINAL SUMMIT CITADEL
        const summitX = launchX + 7.0;
        platforms.push({id: 99, position: [summitX, 19.5, 0], size: [7.5, 1.5, 3.5]});
        keys.push({id: 3, position: [summitX - 1.5, 20.8, 0], collected: false}); // Key 3 on Grand Summit
      }

      // Add Key 1
      keys.push({id: 1, position: key1Pos, collected: false});

      // -----------------------------------------------------------------------------------
      // 2. SCATTER 10 GOLDEN EGGS ACROSS THE MAP PATHWAYS
      // -----------------------------------------------------------------------------------
      const lastPlat = platforms[platforms.length - 1];
      const exitDoorPos: [number, number, number] = [
        lastPlat.position[0] + lastPlat.size[0] / 2 - 1.2,
        lastPlat.position[1] + lastPlat.size[1] / 2 + 0.9,
        0,
      ];

      // Distribute 10 eggs along the unique terrain platforms & bridges
      platforms.forEach((p, idx) => {
        if (eggs.length < 10) {
          eggs.push({
            id: eggs.length + 1,
            position: [p.position[0], p.position[1] + p.size[1] / 2 + 0.7, 0],
            collected: false,
            score: 100,
          });
        }
      });
      bridges.forEach((b) => {
        if (eggs.length < 10) {
          eggs.push({
            id: eggs.length + 1,
            position: [b.position[0], b.position[1] + 0.7, 0],
            collected: false,
            score: 100,
          });
        }
      });
      while (eggs.length < 10) {
        const p = platforms[eggs.length % platforms.length];
        eggs.push({
          id: eggs.length + 1,
          position: [p.position[0] + (eggs.length % 2 === 0 ? 1.0 : -1.0), p.position[1] + p.size[1] / 2 + 0.7, 0],
          collected: false,
          score: 100,
        });
      }

      // Add stage hazards for higher levels
      if (l >= 3) {
        const midPlat = platforms[Math.floor(platforms.length / 2)];
        spikes.push({
          id: 1,
          position: [midPlat.position[0] + 1.2, midPlat.position[1] + midPlat.size[1] / 2 + 0.2, 0],
          size: [0.8, 0.4, 1.0],
        });
      }
      if (l >= 6) {
        const pBomb = platforms[Math.min(platforms.length - 2, 3)];
        bombs.push({
          id: 1,
          position: [pBomb.position[0] - 0.8, pBomb.position[1] + pBomb.size[1] / 2 + 0.5, 0],
        });
      }

      levels.push({
        id: globalId,
        seasonId: s,
        levelInSeason: l,
        name: `World ${s}-${l}: ${zoneInfo.title}`,
        difficulty: diffLabel,
        description: `Collect all 3 Golden Keys across the island to unlock the exit portal!`,
        spawnPoint: [-8.5, 1.2, 0],
        exitDoorPosition: exitDoorPos,
        platforms,
        bridges,
        lifts,
        eggs,
        keys,
        checkpoints,
        bombs,
        spikes,
        ladders,
        springs,
      });
    }
  }

  return levels;
}

export const ALL_LEVELS = generateLevels();
