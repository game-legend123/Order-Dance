"use client";

import { useState, useEffect, useCallback } from "react";
import type { Command, Direction, GameStatus, Position } from "@/lib/types";
import { GameBoard } from "@/components/game/GameBoard";
import { ScriptEditor } from "@/components/game/ScriptEditor";
import { GameStatusDialog } from "@/components/game/GameStatusDialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Award, Target, ShieldAlert, Bot } from "lucide-react";

const GRID_SIZE = 10;
const STEP_DURATION_MS = 300;
const TARGET_POSITION: Position = { x: 9, y: 9 };
const INITIAL_PLAYER_POSITION: Position = { x: 0, y: 0 };
const INITIAL_PLAYER_DIRECTION: Direction = "right";
const BASE_WIN_SCORE = 1000;
const COMMAND_COST = 10;

const INITIAL_ENEMIES = [
  {
    position: { x: 5, y: 5 },
    pattern: (pos: Position) => ({
      ...pos,
      x: pos.x > 7 ? 3 : pos.x + 1,
    }),
  },
  {
    position: { x: 2, y: 2 },
    pattern: (pos: Position) => ({
      ...pos,
      y: pos.y > 6 ? 0 : pos.y + 1,
    }),
  },
];

export default function Home() {
  const [script, setScript] = useState<Command[]>([]);
  const [playerPos, setPlayerPos] = useState<Position>(INITIAL_PLAYER_POSITION);
  const [playerDir, setPlayerDir] = useState<Direction>(INITIAL_PLAYER_DIRECTION);
  const [enemies, setEnemies] = useState(INITIAL_ENEMIES.map(e => e.position));
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const isExecuting = gameStatus === "running";

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const resetGame = useCallback(() => {
    setPlayerPos(INITIAL_PLAYER_POSITION);
    setPlayerDir(INITIAL_PLAYER_DIRECTION);
    setEnemies(INITIAL_ENEMIES.map(e => e.position));
    setGameStatus("idle");
    setCurrentStep(null);
    setScore(0);
  }, []);

  useEffect(() => {
    if (gameStatus === "running" || gameStatus === "win" || gameStatus === "lose") {
      return; 
    }
  
    const isAtTarget = playerPos.x === TARGET_POSITION.x && playerPos.y === TARGET_POSITION.y;
    if (isAtTarget) {
      setGameStatus("win");
      const finalScore = Math.max(0, BASE_WIN_SCORE - (script.length * COMMAND_COST));
      setScore(finalScore);
      return;
    }
    
    const hasCollision = enemies.some(
      (enemy) => enemy.x === playerPos.x && enemy.y === playerPos.y
    );
    if (hasCollision) {
      setGameStatus("lose");
      setScore(0);
    }
  }, [playerPos, enemies, gameStatus, script.length]);
  

  const addCommand = (type: Command["type"]) => {
    if (isExecuting) return;
    setScript((prev) => [...prev, { id: `cmd-${Date.now()}-${Math.random()}`, type }]);
  };

  const removeCommand = (id: string) => {
    if (isExecuting) return;
    setScript((prev) => prev.filter((cmd) => cmd.id !== id));
  };

  const clearScript = () => {
    if (isExecuting) return;
    setScript([]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setScript((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const runScript = async () => {
    resetGame();
    await new Promise(r => setTimeout(r, 100)); // Allow state to reset

    setGameStatus("running");
    let currentPos = { ...INITIAL_PLAYER_POSITION };
    let currentDir = INITIAL_PLAYER_DIRECTION;
    let currentEnemies = [...INITIAL_ENEMIES.map(e => e.position)];

    for (let i = 0; i < script.length; i++) {
      setCurrentStep(i);
      const command = script[i];

      switch (command.type) {
        case "forward":
          const nextPosF = { ...currentPos };
          if (currentDir === "up") nextPosF.y--;
          if (currentDir === "down") nextPosF.y++;
          if (currentDir === "left") nextPosF.x--;
          if (currentDir === "right") nextPosF.x++;

          if (nextPosF.x >= 0 && nextPosF.x < GRID_SIZE && nextPosF.y >= 0 && nextPosF.y < GRID_SIZE) {
            currentPos = nextPosF;
          }
          break;
        case "backward":
          const nextPosB = { ...currentPos };
          if (currentDir === "up") nextPosB.y++;
          if (currentDir === "down") nextPosB.y--;
          if (currentDir === "left") nextPosB.x++;
          if (currentDir === "right") nextPosB.x--;

          if (nextPosB.x >= 0 && nextPosB.x < GRID_SIZE && nextPosB.y >= 0 && nextPosB.y < GRID_SIZE) {
            currentPos = nextPosB;
          }
          break;
        case "turn-left":
          currentDir = { up: "left", left: "down", down: "right", right: "up" }[currentDir] as Direction;
          break;
        case "turn-right":
          currentDir = { up: "right", right: "down", down: "left", left: "up" }[currentDir] as Direction;
          break;
        case "pause":
           await new Promise(resolve => setTimeout(resolve, STEP_DURATION_MS));
           break;
      }
      
      currentEnemies = currentEnemies.map((p, idx) => INITIAL_ENEMIES[idx].pattern(p));
      
      setPlayerPos(currentPos);
      setPlayerDir(currentDir);
      setEnemies(currentEnemies);
      
      const isAtTarget = currentPos.x === TARGET_POSITION.x && currentPos.y === TARGET_POSITION.y;
      if (isAtTarget) {
        setGameStatus("win");
        const finalScore = Math.max(0, BASE_WIN_SCORE - (script.length * COMMAND_COST));
        setScore(finalScore);
        await new Promise(resolve => setTimeout(resolve, STEP_DURATION_MS));
        setCurrentStep(null);
        return;
      }

      const hasCollision = currentEnemies.some(
        (enemy) => enemy.x === currentPos.x && enemy.y === currentPos.y
      );

      if (hasCollision) {
        setGameStatus("lose");
        setScore(0);
        await new Promise(resolve => setTimeout(resolve, STEP_DURATION_MS));
        setCurrentStep(null);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, STEP_DURATION_MS));
    }
    
    // If script finishes without win/loss
    setGameStatus("idle");
    setCurrentStep(null);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <main className="flex flex-col min-h-screen items-center justify-center p-4 md:p-8 space-y-4 bg-background dark:bg-background">
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Vũ Điệu Trật Tự</h1>
          <p className="text-muted-foreground">Lập trình vũ đạo, chinh phục pattern.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full max-w-7xl">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card className="aspect-square">
               <GameBoard
                  gridSize={GRID_SIZE}
                  playerPos={playerPos}
                  playerDir={playerDir}
                  enemies={enemies}
                  targetPos={TARGET_POSITION}
               />
            </Card>
            <Card className="hidden lg:block">
              <CardContent className="p-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-bold">Mục tiêu (Thắng)</p>
                      <p className="text-muted-foreground">Đưa nhân vật đến ô màu xanh lá.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-8 w-8 text-destructive" />
                    <div>
                      <p className="font-bold">Va chạm (Thua)</p>
                      <p className="text-muted-foreground">Tránh va vào các ô màu đỏ của kẻ địch.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bot className="h-8 w-8 text-primary" />
                     <div>
                      <p className="font-bold">Kẻ địch</p>
                      <p className="text-muted-foreground">Di chuyển theo một quy luật cố định.</p>
                    </div>
                  </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1 flex flex-col gap-4">
             <Card>
              <CardContent className="p-4 flex items-center justify-center gap-2 text-xl font-semibold text-accent">
                <Award className="h-6 w-6" />
                <span>Điểm: {score}</span>
              </CardContent>
            </Card>
            <SortableContext items={script} strategy={verticalListSortingStrategy}>
              <ScriptEditor
                  script={script}
                  currentStep={currentStep}
                  isExecuting={isExecuting}
                  onAddCommand={addCommand}
                  onRemoveCommand={removeCommand}
                  onClearScript={clearScript}
                  onRunScript={runScript}
                  onResetGame={() => {
                    resetGame();
                    clearScript();
                  }}
              />
            </SortableContext>
          </div>
        </div>

        <GameStatusDialog
          status={gameStatus}
          score={score}
          onReset={() => {
            resetGame();
            clearScript();
          }}
          onTryAgain={resetGame}
        />
      </main>
    </DndContext>
  );
}
