import React, {useRef, useState, useEffect, useCallback} from 'react';
import {Canvas} from '@react-three/fiber';
import {Physics} from '@react-three/rapier';
import {
  MenuOverlay,
  gameAudio,
  useAutoFocus,
  useIsMobile,
} from './utils';
import {useInput} from './input';
import {GameScene} from './Game';
import {getConfig} from './constants';
import {GameState, PlayerProgress} from './types';
import {SEASONS, ALL_LEVELS} from './levels';
import {
  usePlayground,
  usePlaygroundGameLifecycle,
} from './utils/usePlayground';
import {BackgroundMusic} from './utils/BackgroundMusic';
import {
  RotateCw,
  HelpCircle,
  Menu,
  Volume2,
  VolumeX,
  Trophy,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Lock,
  Key,
  Play,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const STORAGE_KEY = 'red_orb_odyssey_progress_v8';

function loadInitialProgress(): PlayerProgress {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        unlockedLevel: parsed.unlockedLevel || 1,
        completedLevels: parsed.completedLevels || [],
        levelEggs: parsed.levelEggs || {},
      };
    }
  } catch (e) {
    // fallback
  }
  return {
    unlockedLevel: 1,
    completedLevels: [],
    levelEggs: {},
  };
}

function saveProgress(progress: PlayerProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    // ignore
  }
}

export default function App() {
  const {sdk} = usePlayground();

  // Navigation: 'TITLE' | 'SEASON_LEVELS' | 'PLAYING'
  const [activeScreen, setActiveScreen] = useState<'TITLE' | 'SEASON_LEVELS' | 'PLAYING'>('TITLE');
  const [selectedSeasonId, setSelectedSeasonId] = useState<number>(1);
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    status: 'START',
    score: 0,
    level: 1,
    lives: getConfig('startingLives'),
  });

  usePlaygroundGameLifecycle(gameState, sdk);

  // Player progress
  const [progress, setProgress] = useState<PlayerProgress>(loadInitialProgress);

  // Audio and Modals
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isSfxMuted, setIsSfxMuted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // In-game mechanics (3 Keys requirement)
  const [eggsCollected, setEggsCollected] = useState(0);
  const [totalEggsInLevel, setTotalEggsInLevel] = useState(10);
  const [keysCollected, setKeysCollected] = useState(0);
  const totalKeysRequired = 3;
  const [respawnTrigger, setRespawnTrigger] = useState(0);
  const [damageFlash, setDamageFlash] = useState(false);
  const [levelClearModal, setLevelClearModal] = useState(false);

  // Canvas & input
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useInput(canvasWrapperRef);
  const isMobileDevice = useIsMobile();

  // Check if mobile or tablet view
  const [isTouchOrTablet, setIsTouchOrTablet] = useState(false);
  useEffect(() => {
    const checkTouchTablet = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isTabletWidth = window.innerWidth <= 1024;
      setIsTouchOrTablet(isMobileDevice || hasTouch || isTabletWidth);
    };
    checkTouchTablet();
    window.addEventListener('resize', checkTouchTablet);
    return () => window.removeEventListener('resize', checkTouchTablet);
  }, [isMobileDevice]);

  const playButtonRef = useAutoFocus<HTMLButtonElement>(activeScreen === 'TITLE');
  const levelClearButtonRef = useAutoFocus<HTMLButtonElement>(levelClearModal);
  const restartButtonRef = useAutoFocus<HTMLButtonElement>(gameState.status === 'GAME_OVER');

  const currentLevel = ALL_LEVELS[currentLevelIndex] || ALL_LEVELS[0];

  const isSeasonUnlocked = useCallback(
    (seasonId: number) => {
      if (seasonId === 1) return true;
      if (seasonId === 2) {
        return progress.completedLevels.includes(10) || progress.unlockedLevel >= 11;
      }
      if (seasonId === 3) {
        return progress.completedLevels.includes(20) || progress.unlockedLevel >= 21;
      }
      return false;
    },
    [progress]
  );

  const getSeasonCompletionCount = useCallback(
    (seasonId: number) => {
      const seasonLevelIds = ALL_LEVELS.filter((l) => l.seasonId === seasonId).map((l) => l.id);
      return seasonLevelIds.filter((id) => progress.completedLevels.includes(id)).length;
    },
    [progress.completedLevels]
  );

  const getSeasonEggsCount = useCallback(
    (seasonId: number) => {
      const seasonLevelIds = ALL_LEVELS.filter((l) => l.seasonId === seasonId).map((l) => l.id);
      return seasonLevelIds.reduce((acc, id) => acc + (progress.levelEggs[id] || 0), 0);
    },
    [progress.levelEggs]
  );

  const isLevelUnlocked = useCallback(
    (levelId: number) => {
      if (levelId === 1) return true;
      return levelId <= progress.unlockedLevel || progress.completedLevels.includes(levelId - 1);
    },
    [progress]
  );

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  }, []);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).canHandleBackKey = [
      'PLAYING',
      'PAUSED',
    ].includes(gameState.status);
  }, [gameState.status]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isHowToPlayOpen) {
          setIsHowToPlayOpen(false);
        } else if (activeScreen === 'SEASON_LEVELS') {
          setActiveScreen('TITLE');
        } else if (gameState.status === 'PLAYING') {
          setIsGameMenuOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHowToPlayOpen, activeScreen, gameState.status]);

  const handleLaunchLevel = useCallback(
    (globalLevelIndex: number) => {
      if (sdk) {
        sdk.startGame();
      }
      setCurrentLevelIndex(globalLevelIndex);
      const lvl = ALL_LEVELS[globalLevelIndex] || ALL_LEVELS[0];
      setSelectedSeasonId(lvl.seasonId);
      setEggsCollected(0);
      setKeysCollected(0);
      setTotalEggsInLevel(lvl.eggs.length || 10);
      setLevelClearModal(false);
      setIsGameMenuOpen(false);
      setActiveScreen('PLAYING');
      setGameState({
        status: 'PLAYING',
        score: 0,
        level: globalLevelIndex + 1,
        lives: getConfig('startingLives'),
      });
      gameAudio.playConfirmSelect();
    },
    [sdk]
  );

  const handleKeyCollected = useCallback(
    (_keyId: number, currentKeys: number, totalKeys: number) => {
      setKeysCollected(currentKeys);
      if (currentKeys >= totalKeys) {
        showToast(`🎉 All ${totalKeys}/${totalKeys} Keys Collected! Door Unlocked!`);
      } else {
        showToast(`🔑 Golden Key Found (${currentKeys}/${totalKeys})!`);
      }
    },
    [showToast]
  );

  const handleDoorLockedAttempt = useCallback(
    (remainingKeys: number) => {
      showToast(`🔒 Door is Locked! Find ${remainingKeys} more Golden Key${remainingKeys > 1 ? 's' : ''}!`);
    },
    [showToast]
  );

  const handleLevelComplete = useCallback(() => {
    const lvlId = currentLevel.id;
    const nextLevelId = lvlId + 1;

    setProgress((prev) => {
      const nextCompleted = prev.completedLevels.includes(lvlId)
        ? prev.completedLevels
        : [...prev.completedLevels, lvlId];
      const nextUnlocked = Math.max(prev.unlockedLevel, Math.min(30, nextLevelId));
      const updatedEggs = {
        ...prev.levelEggs,
        [lvlId]: Math.max(prev.levelEggs[lvlId] || 0, eggsCollected),
      };

      const newProg: PlayerProgress = {
        unlockedLevel: nextUnlocked,
        completedLevels: nextCompleted,
        levelEggs: updatedEggs,
      };
      saveProgress(newProg);
      return newProg;
    });

    if (lvlId === 30) {
      setGameState((prev) => ({
        ...prev,
        status: 'VICTORY',
        score: prev.score + 5000,
      }));
    } else {
      setLevelClearModal(true);
      setGameState((prev) => ({
        ...prev,
        score: prev.score + 1000,
      }));
    }
  }, [currentLevel.id, eggsCollected]);

  const handleNextLevel = useCallback(() => {
    setLevelClearModal(false);
    const nextIndex = currentLevelIndex + 1;
    if (nextIndex < ALL_LEVELS.length) {
      handleLaunchLevel(nextIndex);
    } else {
      setGameState((prev) => ({...prev, status: 'VICTORY'}));
    }
  }, [currentLevelIndex, handleLaunchLevel]);

  const handlePlayerDamaged = useCallback(
    (cause: 'bomb' | 'spike' | 'liquid') => {
      setDamageFlash(true);
      setTimeout(() => setDamageFlash(false), 300);

      const causeLabel =
        cause === 'bomb' ? 'Bomb!' : cause === 'liquid' ? 'Pit Fall!' : 'Spikes!';
      showToast(`💥 ${causeLabel} Respawning at Checkpoint...`);

      setGameState((prev) => {
        const nextLives = (prev.lives ?? 5) - 1;
        if (nextLives <= 0) {
          gameAudio.playDefeatMotif();
          return {
            ...prev,
            status: 'GAME_OVER',
            lives: 0,
          };
        }
        setRespawnTrigger((r) => r + 1);
        return {
          ...prev,
          lives: nextLives,
        };
      });
    },
    [showToast]
  );

  const handleScoreAdd = useCallback((pts: number) => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + pts,
    }));
  }, []);

  const handleEggCollected = useCallback(
    (eggId: number, count: number, total: number) => {
      setEggsCollected(count);
      setTotalEggsInLevel(total);
      showToast(`🥚 Golden Egg (${count}/${total}) Found!`);
    },
    [showToast]
  );

  const handleCheckpointReached = useCallback(
    (cpId: number) => {
      showToast(`🚩 Checkpoint ${cpId} Saved!`);
    },
    [showToast]
  );

  const musicTrackUrl = getConfig('backgroundMusicUrl') || '';
  const totalEggsCollectedAll = Object.values(progress.levelEggs).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 overflow-hidden touch-none flex flex-col bg-[#00d2ff] text-slate-800 font-sans select-none">
      {/* Background Music */}
      {musicTrackUrl ? (
        <BackgroundMusic
          url={musicTrackUrl}
          isPlaying={gameState.status === 'PLAYING' && !isGameMenuOpen && !isHowToPlayOpen && activeScreen === 'PLAYING'}
          isMuted={isMusicMuted}
        />
      ) : null}

      {/* Red Screen Damage Flash Effect */}
      {damageFlash && (
        <div className="absolute inset-0 z-50 bg-red-500/40 pointer-events-none transition-opacity duration-200" />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && activeScreen === 'PLAYING' && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-40 px-5 py-2 bg-[#5cd600] text-slate-900 text-xs md:text-sm font-black rounded-xl border-3 border-white shadow-lg animate-bounce flex items-center gap-2">
          {toastMessage}
        </div>
      )}

      {/* SCREEN 1: WORLD SELECT */}
      {activeScreen === 'TITLE' && (
        <div className="absolute inset-0 z-30 flex flex-col justify-between items-center bg-[#00d2ff] p-4 sm:p-6 overflow-y-auto">
          <div className="absolute top-8 left-12 w-28 h-20 bg-white rounded-2xl pointer-events-none opacity-90 shadow-sm" />
          <div className="absolute top-16 right-16 w-36 h-24 bg-white rounded-2xl pointer-events-none opacity-90 shadow-sm" />
          <div className="absolute bottom-24 left-1/4 w-32 h-20 bg-white rounded-2xl pointer-events-none opacity-80 shadow-sm" />

          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-center text-center pb-2 gap-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#ef233c] border-3 border-black shadow-md flex items-center justify-center relative overflow-hidden flex-shrink-0 animate-bounce">
                <div className="w-4 h-4 rounded-full bg-white absolute top-2 right-2.5 shadow-sm" />
                <div className="flex gap-2 absolute top-5">
                  <div className="w-2.5 h-1.5 bg-black rounded-full" />
                  <div className="w-2.5 h-1.5 bg-black rounded-full" />
                </div>
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] text-center">
                  Red Orb Odyssey
                </h1>
                <p className="text-xs text-sky-100 font-bold text-center">
                  Expansive Unique Lands, 3 Keys Per Stage & Springs!
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap mt-1">
              <div className="flex items-center gap-3 bg-[#0e331b] text-white border-2 border-white px-4 py-1.5 rounded-xl shadow-md font-black text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🥚</span>
                  <span>{totalEggsCollectedAll}/300 Eggs</span>
                </div>
                <div className="w-px h-3 bg-white/40" />
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span>{progress.completedLevels.length}/30 Cleared</span>
                </div>
              </div>

              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  setIsHowToPlayOpen(true);
                }}
                className="px-3.5 py-1.5 bg-[#5cd600] hover:bg-[#4ec000] active:translate-y-0.5 text-slate-900 rounded-xl border-2 border-white shadow-md transition flex items-center gap-1.5 text-xs font-black">
                <HelpCircle className="w-4 h-4 text-slate-900" />
                <span>How to Play</span>
              </button>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-4xl mx-auto my-auto py-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SEASONS.map((season) => {
                const unlocked = isSeasonUnlocked(season.id);
                const completedCount = getSeasonCompletionCount(season.id);
                const seasonEggs = getSeasonEggsCount(season.id);

                return (
                  <div
                    key={season.id}
                    onClick={() => {
                      if (unlocked) {
                        gameAudio.playCrispClick();
                        setSelectedSeasonId(season.id);
                        setActiveScreen('SEASON_LEVELS');
                      } else {
                        gameAudio.playShieldBlock();
                        showToast(`🔒 Complete World ${season.id - 1} first!`);
                      }
                    }}
                    className={`rounded-2xl overflow-hidden border-3 border-black shadow-xl select-none transition duration-150 flex flex-col ${
                      unlocked
                        ? 'cursor-pointer hover:-translate-y-1.5'
                        : 'opacity-70 cursor-not-allowed filter grayscale-[25%]'
                    }`}>
                    <div className="bg-[#5cd600] p-3 border-b-3 border-black relative flex flex-col items-center text-center">
                      <div className="w-full flex justify-between items-center mb-1">
                        <span className="text-xs font-black uppercase text-slate-900 tracking-wider">
                          World 0{season.id}
                        </span>
                        {unlocked ? (
                          <span className="text-[10px] font-black bg-white text-slate-900 px-2 py-0.5 rounded-md border border-black shadow-sm">
                            {completedCount === 10 ? '★ Mastered' : `${completedCount}/10 Stages`}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-900 text-yellow-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Locked
                          </span>
                        )}
                      </div>

                      <div className="h-16 flex items-center justify-center relative w-full gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#ef233c] border-2 border-black shadow flex items-center justify-center relative">
                          <div className="w-2.5 h-2.5 rounded-full bg-white absolute top-1 right-1" />
                        </div>
                        <div className="w-6 h-8 rounded-full bg-[#fed7aa] border-2 border-black shadow-sm flex items-center justify-center text-xs">
                          🥚
                        </div>
                        <div className="w-6 h-6 rounded-full bg-[#fde047] border border-black flex items-center justify-center text-xs font-bold text-slate-900">
                          3x🔑
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0e331b] text-white p-4 flex-1 flex flex-col justify-between items-center text-center">
                      <div className="w-full flex flex-col items-center text-center">
                        <h3 className="text-base font-black mb-0.5 text-center text-[#5cd600]">
                          {season.name}
                        </h3>
                        <p className="text-xs text-emerald-100/80 font-medium mb-3 text-center">
                          {season.subtitle}
                        </p>
                      </div>

                      <div className="w-full flex flex-col items-center">
                        <div className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-black/40 px-3 py-1.5 rounded-lg mb-3 border border-white/20">
                          <span className="text-sm">🥚</span>
                          <span>Golden Eggs:</span>
                          <span className="text-yellow-300 font-black">{seasonEggs} / 100</span>
                        </div>

                        {unlocked ? (
                          <button className="w-full py-2 bg-[#5cd600] hover:bg-[#4ec000] active:translate-y-0.5 text-slate-900 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 border-2 border-white shadow-md transition">
                            <Play className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                            <span>Select Stage</span>
                          </button>
                        ) : (
                          <div className="w-full py-2 bg-black/40 text-white/60 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Beat World {season.id - 1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 border-t-2 border-white/30 text-center">
            <span className="text-xs text-white font-bold drop-shadow text-center">
              Controls: <kbd className="px-1.5 py-0.5 bg-white text-slate-900 font-black rounded shadow-sm text-[11px]">A</kbd> / <kbd className="px-1.5 py-0.5 bg-white text-slate-900 font-black rounded shadow-sm text-[11px]">D</kbd> Move • Single <kbd className="px-1.5 py-0.5 bg-white text-slate-900 font-black rounded shadow-sm text-[11px]">Space</kbd> / <kbd className="px-1.5 py-0.5 bg-white text-slate-900 font-black rounded shadow-sm text-[11px]">W</kbd> Jump
            </span>

            <button
              ref={playButtonRef}
              autoFocus
              onClick={() => {
                const targetIdx = Math.max(0, Math.min(29, progress.unlockedLevel - 1));
                handleLaunchLevel(targetIdx);
              }}
              className="px-6 py-2.5 bg-[#ef233c] hover:bg-[#d90429] active:translate-y-0.5 text-white font-black rounded-xl text-xs sm:text-sm border-2 border-white shadow-lg transition flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-white" />
              <span>Resume Stage {progress.unlockedLevel}</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: LEVEL STAGE MAP */}
      {activeScreen === 'SEASON_LEVELS' && (
        <div className="absolute inset-0 z-30 flex flex-col justify-between items-center bg-[#00d2ff] p-4 sm:p-6 overflow-y-auto">
          <div className="absolute top-8 right-12 w-32 h-20 bg-white rounded-2xl pointer-events-none opacity-90 shadow-sm" />
          <div className="absolute bottom-16 left-8 w-36 h-24 bg-white rounded-2xl pointer-events-none opacity-80 shadow-sm" />

          <div className="relative z-10 w-full max-w-3xl flex flex-col sm:flex-row items-center justify-between pb-3 border-b-2 border-white/30 gap-2">
            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setActiveScreen('TITLE');
              }}
              className="px-4 py-2 bg-[#0e331b] hover:bg-[#144726] active:translate-y-0.5 text-white rounded-xl border-2 border-white shadow flex items-center justify-center gap-1.5 text-xs font-black transition">
              <span>⬅ Back to Worlds</span>
            </button>

            <div className="text-center flex flex-col items-center">
              <span className="text-[10px] font-black text-sky-100 uppercase tracking-wider block">
                World {selectedSeasonId}
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-white uppercase drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] text-center">
                {SEASONS[selectedSeasonId - 1].name}
              </h2>
            </div>

            <div className="flex items-center justify-center gap-1.5 bg-white text-slate-900 border-2 border-black px-3 py-1 rounded-xl text-xs font-black shadow">
              <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{getSeasonCompletionCount(selectedSeasonId)}/10 Cleared</span>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-3xl mx-auto my-auto py-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              {ALL_LEVELS.filter((l) => l.seasonId === selectedSeasonId).map((lvl) => {
                const unlocked = isLevelUnlocked(lvl.id);
                const isCompleted = progress.completedLevels.includes(lvl.id);
                const isCurrent = lvl.id === progress.unlockedLevel;
                const eggsFound = progress.levelEggs[lvl.id] || 0;
                const globalIndex = lvl.id - 1;

                return (
                  <div
                    key={lvl.id}
                    onClick={() => {
                      if (unlocked) {
                        handleLaunchLevel(globalIndex);
                      } else {
                        gameAudio.playShieldBlock();
                        showToast(`🔒 Clear Stage ${lvl.levelInSeason - 1} first!`);
                      }
                    }}
                    className={`rounded-2xl p-3 border-3 border-black flex flex-col items-center justify-between text-center select-none transition-all duration-150 ${
                      unlocked
                        ? isCurrent
                          ? 'bg-[#ef233c] text-white shadow-lg ring-4 ring-yellow-300 hover:-translate-y-1 cursor-pointer'
                          : isCompleted
                          ? 'bg-[#0e331b] text-white shadow-md hover:-translate-y-1 cursor-pointer'
                          : 'bg-[#5cd600] text-slate-900 shadow-md hover:-translate-y-1 cursor-pointer'
                        : 'bg-slate-300 text-slate-500 opacity-75 cursor-not-allowed shadow-none border-slate-400'
                    }`}>
                    <div className="w-full flex items-center justify-center relative">
                      <span className="w-8 h-8 rounded-full bg-white text-slate-900 font-black text-sm flex items-center justify-center border-2 border-black shadow-sm">
                        {lvl.levelInSeason}
                      </span>
                      {isCompleted && (
                        <span className="absolute right-0 text-[10px] bg-[#5cd600] text-slate-900 px-1.5 py-0.5 rounded font-black border border-black">
                          ✓
                        </span>
                      )}
                      {!unlocked && <Lock className="absolute right-0 w-3.5 h-3.5 text-slate-600" />}
                    </div>

                    <div className="my-2 flex flex-col items-center text-center">
                      <p className="text-xs font-black leading-tight line-clamp-1 text-center">
                        Stage {lvl.levelInSeason}
                      </p>
                      <p className="text-[10px] font-semibold opacity-90 line-clamp-1 text-center">
                        {lvl.difficulty}
                      </p>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center gap-1 bg-black/30 rounded-lg py-1 px-1.5">
                      <div className="flex items-center gap-1 text-[11px] font-black text-yellow-300">
                        <span>🥚</span>
                        <span>{eggsFound}/10</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 w-full max-w-3xl flex justify-center pt-2 border-t-2 border-white/30">
            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setActiveScreen('TITLE');
              }}
              className="px-6 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-black border-2 border-black shadow transition flex items-center justify-center">
              Back to World Selection
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 3: IN-GAME HUD & 3D CANVAS */}
      {activeScreen === 'PLAYING' && (
        <div className="flex-1 w-full min-h-0 relative bg-[#00d2ff] overflow-hidden flex flex-col">
          {/* Top HUD with Key Status Indicator */}
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 pointer-events-none">
            {/* TOP-LEFT: Golden Egg Collectible Icon + Digit Counter */}
            <div className="pointer-events-auto flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              <div className="w-9 h-11 sm:w-11 sm:h-14 rounded-[45%_45%_50%_50%] bg-[#fed7aa] border-3 border-black flex items-center justify-center relative shadow-md">
                <div className="w-2 h-4 rounded-full bg-white absolute top-1.5 left-1.5 rotate-[-25deg]" />
              </div>
              <span className="text-2xl sm:text-4xl font-black text-white tracking-wider font-mono drop-shadow-[0_3px_2px_#000000]">
                {eggsCollected < 10 ? `0${eggsCollected}` : eggsCollected}
              </span>
            </div>

            {/* TOP-CENTER: Lives & 3 Keys Status */}
            <div className="pointer-events-auto flex items-center gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-1.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#ef233c] border-3 border-black flex items-center justify-center relative shadow-md">
                  <div className="w-3 h-3 rounded-full bg-white absolute top-1 right-1.5" />
                  <div className="flex flex-col items-center justify-center pt-1">
                    <div className="flex gap-2 mb-0.5">
                      <div className="w-2.5 h-1 bg-black rounded-full rotate-[-15deg]" />
                      <div className="w-2.5 h-1 bg-black rounded-full rotate-[15deg]" />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-2 h-1.5 bg-black rounded-full" />
                      <div className="w-2 h-1.5 bg-black rounded-full" />
                    </div>
                  </div>
                </div>
                <span className="text-2xl sm:text-4xl font-black text-white font-mono drop-shadow-[0_3px_2px_#000000]">
                  {gameState.lives ?? 5}
                </span>
              </div>

              {/* 3 Keys HUD Indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/70 rounded-xl border-2 border-white/80 shadow-md">
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((kIdx) => (
                    <Key
                      key={kIdx}
                      className={`w-4 h-4 transition-all ${
                        kIdx < keysCollected
                          ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_#facc15]'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`text-xs font-black font-mono ${
                    keysCollected >= 3 ? 'text-[#5cd600]' : 'text-yellow-300'
                  }`}>
                  {keysCollected}/3
                </span>
              </div>
            </div>

            {/* TOP-RIGHT: Menu Button */}
            <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  setIsGameMenuOpen(true);
                }}
                aria-label="Open Menu"
                className="px-3 py-2 bg-white hover:bg-slate-100 active:translate-y-0.5 rounded-xl border-2 border-black shadow-md text-slate-900 flex items-center gap-1.5 text-xs font-black">
                <Menu className="w-4 h-4" />
                <span className="hidden sm:inline">Pause</span>
              </button>
            </div>
          </div>

          {/* Main 3D Canvas */}
          <div
            ref={canvasWrapperRef}
            className="flex-1 w-full min-h-0 relative bg-[#00d2ff] overflow-hidden flex items-center justify-center">
            <Canvas
              camera={{
                position: [getConfig('cameraX'), getConfig('cameraY'), getConfig('cameraZ')],
                fov: getConfig('fov'),
              }}
              shadows
              gl={{antialias: true, powerPreference: 'high-performance'}}
              className="w-full h-full block">
              <Physics
                gravity={[0, getConfig('gravity'), 0]}
                paused={
                  gameState.status !== 'PLAYING' ||
                  isGameMenuOpen ||
                  isHowToPlayOpen ||
                  levelClearModal
                }>
                <GameScene
                  currentLevelIndex={currentLevelIndex}
                  inputRef={inputRef}
                  isPaused={
                    gameState.status !== 'PLAYING' ||
                    isGameMenuOpen ||
                    isHowToPlayOpen ||
                    levelClearModal
                  }
                  keysCollectedCount={keysCollected}
                  totalKeysRequired={totalKeysRequired}
                  onKeyCollected={handleKeyCollected}
                  onEggCollected={handleEggCollected}
                  onCheckpointReached={handleCheckpointReached}
                  onPlayerDamaged={handlePlayerDamaged}
                  onDoorLockedAttempt={handleDoorLockedAttempt}
                  onLevelComplete={handleLevelComplete}
                  onScoreAdd={handleScoreAdd}
                  respawnTrigger={respawnTrigger}
                />
              </Physics>
            </Canvas>

            {/* Mobile & Tablet On-Screen Controls */}
            {isTouchOrTablet && gameState.status === 'PLAYING' && !levelClearModal && !isGameMenuOpen && (
              <div className="absolute inset-0 pointer-events-none z-30 flex justify-between items-end p-5 pb-7">
                <div className="pointer-events-auto flex flex-col items-center gap-1.5 pl-2">
                  <button
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture(e.pointerId);
                      if (inputRef.current) inputRef.current.actions.up = true;
                    }}
                    onPointerUp={() => {
                      if (inputRef.current) inputRef.current.actions.up = false;
                    }}
                    onPointerCancel={() => {
                      if (inputRef.current) inputRef.current.actions.up = false;
                    }}
                    className="w-14 h-14 rounded-2xl bg-white active:bg-amber-100 text-slate-900 font-black flex items-center justify-center border-3 border-black shadow-xl active:translate-y-1 select-none touch-none">
                    <ArrowUp className="w-7 h-7 text-slate-900" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        if (inputRef.current) inputRef.current.actions.left = true;
                      }}
                      onPointerUp={() => {
                        if (inputRef.current) inputRef.current.actions.left = false;
                      }}
                      onPointerCancel={() => {
                        if (inputRef.current) inputRef.current.actions.left = false;
                      }}
                      className="w-14 h-14 rounded-2xl bg-white active:bg-amber-100 text-slate-900 font-black flex items-center justify-center border-3 border-black shadow-xl active:translate-y-1 select-none touch-none">
                      <ArrowLeft className="w-7 h-7 text-slate-900" />
                    </button>

                    <button
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        if (inputRef.current) inputRef.current.actions.down = true;
                      }}
                      onPointerUp={() => {
                        if (inputRef.current) inputRef.current.actions.down = false;
                      }}
                      onPointerCancel={() => {
                        if (inputRef.current) inputRef.current.actions.down = false;
                      }}
                      className="w-14 h-14 rounded-2xl bg-white active:bg-amber-100 text-slate-900 font-black flex items-center justify-center border-3 border-black shadow-xl active:translate-y-1 select-none touch-none">
                      <ArrowDown className="w-7 h-7 text-slate-900" />
                    </button>

                    <button
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        if (inputRef.current) inputRef.current.actions.right = true;
                      }}
                      onPointerUp={() => {
                        if (inputRef.current) inputRef.current.actions.right = false;
                      }}
                      onPointerCancel={() => {
                        if (inputRef.current) inputRef.current.actions.right = false;
                      }}
                      className="w-14 h-14 rounded-2xl bg-white active:bg-amber-100 text-slate-900 font-black flex items-center justify-center border-3 border-black shadow-xl active:translate-y-1 select-none touch-none">
                      <ArrowRight className="w-7 h-7 text-slate-900" />
                    </button>
                  </div>
                </div>

                <div className="pointer-events-auto flex items-center gap-3 pr-2">
                  <button
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture(e.pointerId);
                      if (inputRef.current) inputRef.current.actions.confirm = true;
                    }}
                    onPointerUp={() => {
                      if (inputRef.current) inputRef.current.actions.confirm = false;
                    }}
                    onPointerCancel={() => {
                      if (inputRef.current) inputRef.current.actions.confirm = false;
                    }}
                    className="w-20 h-20 rounded-full bg-[#ef233c] hover:bg-[#d90429] active:translate-y-1.5 text-white font-black flex flex-col items-center justify-center border-4 border-black shadow-2xl select-none touch-none ring-4 ring-white/50">
                    <span className="text-xl leading-none">⬆</span>
                    <span className="text-xs font-black uppercase tracking-wider">JUMP</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALS */}
      {levelClearModal && (
        <MenuOverlay tone="neutral" zIndex={60}>
          <div className="w-full max-w-sm flex flex-col items-center bg-white border-4 border-black rounded-3xl p-6 m-4 shadow-2xl text-center text-slate-900">
            <div className="w-16 h-16 rounded-full bg-[#5cd600] border-3 border-black flex items-center justify-center mb-3 shadow-md animate-bounce">
              <Sparkles className="w-9 h-9 text-white" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-wide">
              Stage Cleared!
            </h2>
            <p className="text-xs text-slate-600 font-bold mb-4">{currentLevel.name}</p>

            <div className="w-full bg-[#0e331b] border-2 border-black rounded-2xl p-4 mb-4 flex justify-around text-white">
              <div>
                <span className="text-[10px] text-emerald-200 uppercase font-black block">Eggs</span>
                <span className="text-base font-black text-yellow-300">
                  {eggsCollected} / {totalEggsInLevel}
                </span>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div>
                <span className="text-[10px] text-emerald-200 uppercase font-black block">Score</span>
                <span className="text-base font-black text-[#5cd600]">{gameState.score}</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <button
                ref={levelClearButtonRef}
                autoFocus
                onClick={handleNextLevel}
                className="w-full py-3 bg-[#5cd600] hover:bg-[#4ec000] active:translate-y-0.5 text-slate-900 font-black rounded-xl text-sm transition flex items-center justify-center gap-1.5 border-2 border-black shadow-md">
                <span>Next Stage</span>
                <ChevronRight className="w-5 h-5 text-slate-900" />
              </button>

              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  setLevelClearModal(false);
                  setActiveScreen('SEASON_LEVELS');
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-300 transition">
                Stage Select
              </button>
            </div>
          </div>
        </MenuOverlay>
      )}

      {gameState.status === 'GAME_OVER' && (
        <MenuOverlay tone="danger" zIndex={50}>
          <div className="w-full max-w-sm flex flex-col items-center bg-white border-4 border-black rounded-3xl p-6 m-4 shadow-2xl text-center text-slate-900">
            <ShieldAlert className="w-14 h-14 text-[#ef233c] mb-2 animate-pulse" />
            <h2 className="text-2xl font-black text-[#ef233c] mb-1 uppercase">Out of Lives!</h2>
            <p className="text-xs text-slate-600 font-bold mb-4">Hazards got the best of you.</p>

            <button
              ref={restartButtonRef}
              autoFocus
              onClick={() => handleLaunchLevel(currentLevelIndex)}
              className="w-full py-3 bg-[#ef233c] hover:bg-[#d90429] active:translate-y-0.5 text-white font-black rounded-xl text-sm transition mb-2 border-2 border-black shadow-md">
              Retry Stage
            </button>
            <button
              onClick={() => {
                gameAudio.playCrispClick();
                setActiveScreen('SEASON_LEVELS');
                setGameState((prev) => ({...prev, status: 'START'}));
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs rounded-xl font-bold border border-slate-300 transition">
              Select Another Stage
            </button>
          </div>
        </MenuOverlay>
      )}

      {gameState.status === 'VICTORY' && (
        <MenuOverlay tone="victory" zIndex={50}>
          <div className="w-full max-w-md flex flex-col items-center bg-white border-4 border-black rounded-3xl p-6 m-4 shadow-2xl text-center text-slate-900">
            <Trophy className="w-16 h-16 text-amber-500 mb-2 animate-bounce" />
            <h2 className="text-2xl font-black text-amber-600 mb-1 uppercase">
              All Worlds Complete!
            </h2>
            <p className="text-xs text-slate-700 font-bold mb-4">
              You conquered all 30 stages, unlocked every door with all 3 keys, and collected every golden egg!
            </p>

            <button
              autoFocus
              onClick={() => {
                gameAudio.playCrispClick();
                setActiveScreen('TITLE');
                setGameState((prev) => ({...prev, status: 'START'}));
              }}
              className="w-full py-3 bg-[#5cd600] hover:bg-[#4ec000] active:translate-y-0.5 text-slate-900 font-black rounded-xl text-sm border-2 border-black transition shadow-md">
              Back to World Select
            </button>
          </div>
        </MenuOverlay>
      )}

      {isGameMenuOpen && (
        <MenuOverlay tone="neutral" zIndex={60}>
          <div className="w-full max-w-xs flex flex-col items-center bg-white border-4 border-black rounded-3xl p-5 m-4 shadow-2xl text-slate-900">
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase">Game Paused</h2>

            <div className="w-full flex flex-col gap-2.5">
              <button
                autoFocus
                onClick={() => {
                  gameAudio.playCrispClick();
                  setIsGameMenuOpen(false);
                }}
                className="w-full py-2.5 bg-[#5cd600] hover:bg-[#4ec000] text-slate-900 font-black rounded-xl text-xs border-2 border-black transition shadow">
                Resume
              </button>

              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  handleLaunchLevel(currentLevelIndex);
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Restart Stage</span>
              </button>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => {
                    const next = gameAudio.toggleMute();
                    setIsSfxMuted(next);
                  }}
                  className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1 border border-slate-300">
                  {isSfxMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-green-600" />}
                  <span>SFX</span>
                </button>

                <button
                  onClick={() => setIsMusicMuted((prev) => !prev)}
                  className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1 border border-slate-300">
                  {isMusicMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-green-600" />}
                  <span>Music</span>
                </button>
              </div>

              <button
                onClick={() => {
                  gameAudio.playCrispClick();
                  setIsGameMenuOpen(false);
                  setActiveScreen('TITLE');
                  setGameState((prev) => ({...prev, status: 'START'}));
                }}
                className="w-full py-2 bg-red-100 hover:bg-red-200 text-red-700 font-black rounded-xl text-xs transition mt-1 border border-red-300">
                Exit to World Select
              </button>
            </div>
          </div>
        </MenuOverlay>
      )}

      {isHowToPlayOpen && (
        <MenuOverlay tone="neutral" zIndex={70}>
          <div className="w-full max-w-sm flex flex-col bg-white border-4 border-black rounded-3xl p-5 m-4 shadow-2xl text-left text-slate-900 max-h-[85vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-900 mb-3 text-center uppercase">
              How to Play
            </h3>

            <div className="space-y-2.5 text-xs text-slate-700 mb-4 font-medium">
              <div className="bg-yellow-50 p-2.5 rounded-2xl border-2 border-yellow-300">
                <p className="font-black text-yellow-800 mb-0.5 flex items-center gap-1.5">
                  <span>🔑</span> 1. Collect All 3 Golden Keys
                </p>
                <p>Every level has 3 Golden Keys scattered across its unique terrain. Collect all 3 to unlock the final Exit Portal!</p>
              </div>

              <div className="bg-purple-50 p-2.5 rounded-2xl border-2 border-purple-300">
                <p className="font-black text-purple-800 mb-0.5 flex items-center gap-1.5">
                  <span>🍄</span> 2. Springs, Bridges & Lifts
                </p>
                <p>Use Leaf, Golden Super Springs, and Mega Mushroom Springs to leap high vertical cliffs. Ride elevator lifts and cross suspension rope bridges!</p>
              </div>

              <div className="bg-emerald-50 p-2.5 rounded-2xl border-2 border-emerald-300">
                <p className="font-black text-emerald-800 mb-0.5 flex items-center gap-1.5">
                  <span>🥚</span> 3. Collect Golden Eggs
                </p>
                <p>Gather all 10 eggs per level to achieve master status across all worlds.</p>
              </div>

              <div className="bg-sky-50 p-2.5 rounded-2xl border-2 border-sky-300">
                <p className="font-black text-sky-800 mb-0.5 flex items-center gap-1.5">
                  <span>🚩</span> 4. Checkpoints & Hazards
                </p>
                <p>Hit flagpoles to save your checkpoint. Watch out for bombs, spikes, and endless falls!</p>
              </div>
            </div>

            <button
              autoFocus
              onClick={() => {
                gameAudio.playCrispClick();
                setIsHowToPlayOpen(false);
              }}
              className="w-full py-2.5 bg-[#5cd600] hover:bg-[#4ec000] text-slate-900 font-black rounded-xl text-xs border-2 border-black shadow transition text-center">
              Got It!
            </button>
          </div>
        </MenuOverlay>
      )}
    </div>
  );
}
