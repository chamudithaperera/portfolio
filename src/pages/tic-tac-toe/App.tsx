// tslint:disable
/* eslint-disable */
import {
  Activity,
  Flame,
  Gamepad,
  HelpCircle,
  Play,
  RotateCw,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AVAILABLE_MUSIC_TRACKS, getConfig} from './constants';
import {checkWinner, Game} from './Game';
import {AIDifficulty, BoardState, CellPlayer, MatchStats} from './types';
import BackgroundMusic from './utils/BackgroundMusic';
import {
  gameAudio,
  GameState,
  MenuOverlay,
  Overlay,
  useIsMobile,
} from './utils/helper';
import {
  usePlayground,
  usePlaygroundGameLifecycle,
  usePlaygroundResume,
  useRpc,
} from './utils/usePlayground';

interface CustomWindow extends Window {
  canHandleBackKey?: boolean;
}

// Minimax algorithm for Master AI
function evaluateBoard(board: BoardState): number {
  const result = checkWinner(board);
  if (result.winner === 'O') return 10;
  if (result.winner === 'X') return -10;
  return 0;
}

function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
): number {
  const score = evaluateBoard(board);
  if (score === 10) return score - depth;
  if (score === -10) return score + depth;
  if (board.every((c) => c !== null)) return 0;
  if (depth >= 6) return 0; // limit depth for fast response

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const evaluation = minimax(board, depth + 1, false, alpha, beta);
        board[i] = null;
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        const evaluation = minimax(board, depth + 1, true, alpha, beta);
        board[i] = null;
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
}

function getBestMoveMinimax(board: BoardState): number {
  let bestVal = -Infinity;
  let bestMove = -1;
  const availableMoves: number[] = [];

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) availableMoves.push(i);
  }

  // If opening board is empty or 1 move in center, pick strategically
  if (availableMoves.length === 9) return 4;
  if (availableMoves.length === 8 && board[4] === null) return 4;

  for (const move of availableMoves) {
    board[move] = 'O';
    const moveVal = minimax(board, 0, false, -Infinity, Infinity);
    board[move] = null;
    if (moveVal > bestVal) {
      bestVal = moveVal;
      bestMove = move;
    }
  }
  return bestMove !== -1 ? bestMove : availableMoves[0];
}

// Strategic heuristic for Medium AI
function getMediumMove(board: BoardState): number {
  // 1. Can AI win in one move?
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'O';
      if (checkWinner(board).winner === 'O') {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  // 2. Must AI block player from winning?
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'X';
      if (checkWinner(board).winner === 'X') {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  // 3. Take center if available
  if (board[4] === null) return 4;
  // 4. Take corners
  const corners = [0, 2, 6, 8].filter((idx) => board[idx] === null);
  if (corners.length > 0 && Math.random() < 0.7) {
    return corners[Math.floor(Math.random() * corners.length)];
  }
  // 5. Random empty
  const empty = board
    .map((v, i) => (v === null ? i : null))
    .filter((v): v is number => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

// Random exploration for Easy AI
function getEasyMove(board: BoardState): number {
  // Check if player is winning and block 40% of the time, else random
  if (Math.random() < 0.4) {
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        if (checkWinner(board).winner === 'X') {
          board[i] = null;
          return i;
        }
        board[i] = null;
      }
    }
  }
  const empty = board
    .map((v, i) => (v === null ? i : null))
    .filter((v): v is number => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

export default function App() {
  const {sdk, isReady} = usePlayground();
  const [exitChat] = useRpc<Record<string, unknown>, void>('ExitChat');
  const isMobile = useIsMobile();

  // Save / Resume integration
  const {initialLevel, initialScore, persistenceEnabled, autoStartPending} =
    usePlaygroundResume({
      isReady,
      onAutoStart: () => {
        if (gameStateRef.current.status === 'START') {
          initGame();
        }
      },
    });

  const startLevel = initialLevel || 1;
  const startScore = initialScore || 0;
  const levelStartScoreRef = useRef(startScore);
  const prevLevelRef = useRef(startLevel);
  const runWonRef = useRef(false);

  const [gameState, setGameState] = useState<GameState>({
    status: 'START',
    score: startScore,
    level: startLevel,
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Board gameplay state
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<'X' | 'O'>('X');
  const [isAITurn, setIsAITurn] = useState(false);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [roundWinner, setRoundWinner] = useState<'X' | 'O' | 'draw' | null>(
    null,
  );
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [camAngle, setCamAngle] = useState(0);
  const [boardKey, setBoardKey] = useState(0);

  // Difficulty & Settings
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');
  const [stats, setStats] = useState<MatchStats>({
    playerWins: 0,
    aiWins: 0,
    draws: 0,
    currentStreak: 0,
    bestStreak: 0,
  });

  // Overlays
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [sfxMuted, setSfxMuted] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);

  useEffect(() => {
    if (gameState.level !== prevLevelRef.current) {
      prevLevelRef.current = gameState.level;
      levelStartScoreRef.current = gameStateRef.current.score;
    }
  }, [gameState.level]);

  useEffect(() => {
    if (gameState.status === 'VICTORY') {
      runWonRef.current = true;
    }
  }, [gameState.status]);

  useEffect(() => {
    (window as unknown as CustomWindow).canHandleBackKey = [
      'PLAYING',
      'PAUSED',
    ].includes(gameState.status);
  }, [gameState.status]);

  // Keyboard shortcut for Esc menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isHowToPlayOpen) {
          setIsHowToPlayOpen(false);
        } else if (gameState.status === 'PLAYING') {
          setIsGameMenuOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, isHowToPlayOpen]);

  // Start / Reset Round
  const startNewRound = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentTurn('X');
    setIsAITurn(false);
    setWinningLine(null);
    setRoundWinner(null);
    setHoveredCell(null);
    setBoardKey((k) => k + 1);
  }, []);

  const startRun = useCallback(
    (level: number, score: number) => {
      levelStartScoreRef.current = score;
      prevLevelRef.current = level;
      runWonRef.current = false;
      startNewRound();
      setGameState((prev) => ({
        ...prev,
        status: 'PLAYING',
        level,
        score,
      }));
      if (sdk) sdk.startGame();
    },
    [sdk, startNewRound],
  );

  const initGame = useCallback(() => {
    if (persistenceEnabled && !runWonRef.current) {
      startRun(gameStateRef.current.level, levelStartScoreRef.current);
    } else {
      startRun(1, 0);
    }
  }, [startRun, persistenceEnabled]);

  const resetGame = useCallback(() => {
    setStats({
      playerWins: 0,
      aiWins: 0,
      draws: 0,
      currentStreak: 0,
      bestStreak: 0,
    });
    startRun(1, 0);
  }, [startRun]);

  usePlaygroundGameLifecycle(gameState, sdk);

  // SFX triggers on match outcomes
  useEffect(() => {
    if (roundWinner === 'X') {
      gameAudio.playVictoryFanfare();
    } else if (roundWinner === 'O') {
      gameAudio.playDefeatMotif();
    } else if (roundWinner === 'draw') {
      gameAudio.playErrorBuzz();
    }
  }, [roundWinner]);

  // Handle tile placement by Player
  const handleTileClick = useCallback(
    (index: number) => {
      if (gameState.status !== 'PLAYING') return;
      if (isGameMenuOpen || isHowToPlayOpen) return;
      if (board[index] !== null || currentTurn !== 'X' || isAITurn || roundWinner) {
        gameAudio.playErrorBuzz();
        return;
      }

      gameAudio.playCrispClick();
      const nextBoard = [...board];
      nextBoard[index] = 'X';
      setBoard(nextBoard);

      const check = checkWinner(nextBoard);
      if (check.winner) {
        setWinningLine(check.line);
        setRoundWinner(check.winner);
        if (check.winner === 'X') {
          const winScore = getConfig('pointsPerWin');
          const newStreak = stats.currentStreak + 1;
          const best = Math.max(stats.bestStreak, newStreak);
          setStats((prev) => ({
            ...prev,
            playerWins: prev.playerWins + 1,
            currentStreak: newStreak,
            bestStreak: best,
          }));
          setGameState((prev) => ({
            ...prev,
            score: prev.score + winScore * Math.min(newStreak, 5),
            level: prev.level + 1,
          }));
        } else if (check.winner === 'draw') {
          setStats((prev) => ({...prev, draws: prev.draws + 1}));
        }
        return;
      }

      // Switch to AI turn
      setCurrentTurn('O');
      setIsAITurn(true);
    },
    [
      gameState.status,
      isGameMenuOpen,
      isHowToPlayOpen,
      board,
      currentTurn,
      isAITurn,
      roundWinner,
      stats.currentStreak,
      stats.bestStreak,
    ],
  );

  // AI Turn Execution
  useEffect(() => {
    if (!isAITurn || roundWinner || gameState.status !== 'PLAYING') return;

    // Fast snappy reaction: 120ms
    const delay = Math.min(150, getConfig('aiDelayMs'));
    const timer = setTimeout(() => {
      let chosenMove: number;
      if (difficulty === 'master') {
        chosenMove = getBestMoveMinimax([...board]);
      } else if (difficulty === 'medium') {
        chosenMove = getMediumMove([...board]);
      } else {
        chosenMove = getEasyMove([...board]);
      }

      if (chosenMove >= 0 && chosenMove < 9 && board[chosenMove] === null) {
        gameAudio.playJumpLandingThud();
        const nextBoard = [...board];
        nextBoard[chosenMove] = 'O';
        setBoard(nextBoard);

        const check = checkWinner(nextBoard);
        if (check.winner) {
          setWinningLine(check.line);
          setRoundWinner(check.winner);
          if (check.winner === 'O') {
            setStats((prev) => ({
              ...prev,
              aiWins: prev.aiWins + 1,
              currentStreak: 0,
            }));
          } else if (check.winner === 'draw') {
            setStats((prev) => ({...prev, draws: prev.draws + 1}));
          }
        } else {
          setCurrentTurn('X');
        }
      }
      setIsAITurn(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [isAITurn, board, difficulty, roundWinner, gameState.status]);

  return (
    <div className="fixed inset-0 overflow-hidden touch-none flex flex-col bg-slate-950 text-white font-sans select-none">
      <BackgroundMusic
        url={getConfig('backgroundMusicUrl')}
        isPlaying={gameState.status === 'PLAYING' && !isGameMenuOpen}
        isMuted={musicMuted}
      />

      {/* TOP HEADER HUD */}
      {gameState.status === 'PLAYING' && (
        <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-2 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-sky-950/70 border border-sky-500/40 rounded-lg px-2.5 py-1 text-xs font-semibold text-sky-300">
              <Zap size={14} className="text-sky-400" />
              <span>Score: {gameState.score}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-950/70 border border-amber-500/40 rounded-lg px-2.5 py-1 text-xs font-semibold text-amber-300">
              <Flame size={14} className="text-amber-400" />
              <span>Streak: {stats.currentStreak}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span>W: {stats.playerWins}</span>
              <span>L: {stats.aiWins}</span>
              <span>D: {stats.draws}</span>
            </div>
          </div>

          {/* Difficulty & Menu triggers */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
              {(['easy', 'medium', 'master'] as AIDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => {
                    gameAudio.playConfirmSelect();
                    setDifficulty(diff);
                  }}
                  className={`px-2 py-1 rounded capitalize font-medium transition-colors ${
                    difficulty === diff
                      ? 'bg-sky-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}>
                  {diff}
                </button>
              ))}
            </div>

            <button
              type="button"
              data-testid="menu-button"
              onClick={() => setIsGameMenuOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow">
              <span>Menu</span>
            </button>
          </div>
        </header>
      )}

      {/* 3D CANVAS VIEW AREA */}
      <div className="flex-1 w-full min-h-0 relative flex items-center justify-center bg-slate-950">
        <Game
          gameState={gameState}
          setGameState={setGameState}
          exitChat={exitChat}
          gameStateRef={gameStateRef}
          board={board}
          onTileClick={handleTileClick}
          hoveredCell={hoveredCell}
          setHoveredCell={setHoveredCell}
          winningLine={winningLine}
          currentTurn={currentTurn}
          isAITurn={isAITurn}
          camAngle={camAngle}
          setCamAngle={setCamAngle}
          boardKey={boardKey}
          stats={stats}
        />

        {/* TURN BADGE OVERLAY (Bottom-Center Safe Zone) */}
        {gameState.status === 'PLAYING' && (
          <div className="absolute bottom-5 inset-x-0 flex flex-col items-center pointer-events-none z-10 px-4">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isAITurn
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-sky-400 animate-pulse'
                }`}
              />
              <span className="text-xs font-bold tracking-wide">
                {roundWinner === 'X'
                  ? 'YOU WON THE ROUND!'
                  : roundWinner === 'O'
                  ? 'AI WON THE ROUND'
                  : roundWinner === 'draw'
                  ? "IT'S A DRAW"
                  : isAITurn
                  ? 'AI Core Thinking...'
                  : 'Your Turn (Azure X)'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Drag or swipe horizontally to orbit 3D view
            </div>
          </div>
        )}

        {/* ROUND FINISHED MODAL CARD */}
        {gameState.status === 'PLAYING' && roundWinner && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-20">
            <div className="bg-slate-900 border border-slate-700/80 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center flex flex-col items-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-lg ${
                  roundWinner === 'X'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/50'
                    : roundWinner === 'O'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                    : 'bg-slate-700/30 text-slate-300 border border-slate-600'
                }`}>
                {roundWinner === 'X' ? (
                  <Trophy size={30} />
                ) : roundWinner === 'O' ? (
                  <Activity size={30} />
                ) : (
                  <Gamepad size={30} />
                )}
              </div>
              <h2 className="text-2xl font-black mb-1">
                {roundWinner === 'X'
                  ? 'VICTORY!'
                  : roundWinner === 'O'
                  ? 'ROUND LOST'
                  : 'ROUND DRAW'}
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                {roundWinner === 'X'
                  ? `Streak Multiplier Active! +${
                      getConfig('pointsPerWin') * Math.min(stats.currentStreak, 5)
                    } pts`
                  : roundWinner === 'O'
                  ? 'The AI countered your sequence.'
                  : 'All 9 cells placed without a match.'}
              </p>
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  autoFocus
                  onClick={() => {
                    gameAudio.playCrispClick();
                    startNewRound();
                  }}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-2.5 rounded-xl shadow text-sm flex items-center justify-center gap-2">
                  <RotateCw size={16} />
                  Next Round
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* START SCREEN OVERLAY */}
      {gameState.status === 'START' && !autoStartPending && (
        <MenuOverlay tone="neutral" zIndex={50}>
          <div className="bg-slate-900 border border-slate-700/80 p-8 rounded-2xl shadow-2xl flex flex-col items-center w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-sky-500/20">
              <Gamepad size={36} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">
              {getConfig('title') ?? 'TIC TAC TACTICS'}
            </h1>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Tactile 3D Tic-Tac-Toe with animated physics tokens, dynamic
              camera orbit, and adaptive Minimax AI rivals.
            </p>

            {/* Difficulty Selector on Title Screen */}
            <div className="w-full mb-6">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Select AI Rival Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'master'] as AIDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => {
                      gameAudio.playConfirmSelect();
                      setDifficulty(diff);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                      difficulty === diff
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}>
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={initGame}
              autoFocus
              data-testid="start-button"
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-transform active:scale-95">
              <Play size={20} />
              START MATCH
            </button>
          </div>
        </MenuOverlay>
      )}

      {/* GAME MENU / PAUSE OVERLAY */}
      {isGameMenuOpen && (
        <MenuOverlay tone="neutral" zIndex={60}>
          <div className="w-full max-w-sm flex flex-col items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-black mb-6 text-white text-center">
              GAME MENU
            </h2>

            <div className="flex flex-col gap-3 w-full mb-6">
              <button
                type="button"
                autoFocus
                onClick={() => setIsGameMenuOpen(false)}
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                Resume
              </button>

              <button
                type="button"
                onClick={() => {
                  gameAudio.playCrispClick();
                  startNewRound();
                  setIsGameMenuOpen(false);
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                Try Level Again
              </button>

              <button
                type="button"
                onClick={() => setIsHowToPlayOpen(true)}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                <HelpCircle size={16} />
                How to Play
              </button>

              {/* SFX & Music Toggles */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    const newMuted = gameAudio.toggleMute();
                    setSfxMuted(newMuted);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 text-slate-300">
                  {sfxMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  SFX: {sfxMuted ? 'Off' : 'On'}
                </button>
                <button
                  type="button"
                  onClick={() => setMusicMuted(!musicMuted)}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 text-slate-300">
                  {musicMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  Music: {musicMuted ? 'Off' : 'On'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsGameMenuOpen(false);
                setGameState((prev) => ({...prev, status: 'START'}));
              }}
              className="text-xs text-rose-400 hover:text-rose-300 underline font-medium">
              Quit to Title Menu
            </button>
          </div>
        </MenuOverlay>
      )}

      {/* HOW TO PLAY SCREEN OVERLAY */}
      {isHowToPlayOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col text-slate-300">
            <h3 className="text-xl font-bold text-white mb-3 text-center">
              How to Play
            </h3>
            <ul className="text-xs space-y-2 mb-6 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">•</span>
                <span>
                  <strong>Place Markers:</strong> Tap or click any open 3D tile
                  on your turn to place an Azure 'X'.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong>AI Opponent:</strong> The floating robotic core will
                  strategize and counter with Solar 'O' tokens.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>3D Orbit:</strong> Drag or swipe across the screen on
                  both mobile and PC to rotate your perspective.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>
                  <strong>Winning & Streaks:</strong> Connect 3 tokens in a row
                  to activate the laser strike and multiply your score streak!
                </span>
              </li>
            </ul>

            <button
              type="button"
              autoFocus
              onClick={() => setIsHowToPlayOpen(false)}
              className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
