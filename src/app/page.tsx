"use client";

import { useState, useEffect, useCallback } from "react";
import type { Command, Direction, GameStatus, Position } from "@/lib/types";
import { GameBoard } from "@/components/game/GameBoard";
import { ScriptEditor } from "@/components/game/ScriptEditor";
import { GameStatusDialog } from "@/components/game/GameStatusDialog";
import { Card } from "@/components/ui/card";
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

const GRID_SIZE = 10;
const STEP_DURATION_MS = 300;
const TARGET_POSITION: Position = { x: 9, y: 9 };
const INITIAL_PLAYER_POSITION: Position = { x: 0, y: 0 };
const INITIAL_PLAYER_DIRECTION: Direction = "right";

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
  }, []);

  useEffect(() => {
    if (gameStatus === "win" || gameStatus === "lose") {
      // The dialog will handle the next actions
    } else {
      const isAtTarget = playerPos.x === TARGET_POSITION.x && playerPos.y === TARGET_POSITION.y;
      if (isAtTarget) {
        setGameStatus("win");
        return;
      }
      
      const hasCollision = enemies.some(
        (enemy) => enemy.x === playerPos.x && enemy.y === playerPos.y
      );
      if (hasCollision) {
        setGameStatus("lose");
      }
    }
  }, [playerPos, enemies, gameStatus]);
  

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
    setGameStatus("running");
    let currentPos = { ...INITIAL_PLAYER_POSITION };
    let currentDir = INITIAL_PLAYER_DIRECTION;
    let currentEnemies = [...INITIAL_ENEMIES.map(e => e.position)];
    
    // Reset positions before running
    setPlayerPos(currentPos);
    setPlayerDir(currentDir);
    setEnemies(currentEnemies);

    await new Promise(resolve => setTimeout(resolve, STEP_DURATION_MS));

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
      
      setPlayerPos(currentPos);
      setPlayerDir(currentDir);
      
      currentEnemies = currentEnemies.map((p, idx) => INITIAL_ENEMIES[idx].pattern(p));
      setEnemies(currentEnemies);
      
      await new Promise(resolve => setTimeout(resolve, STEP_DURATION_MS));
      
      const isAtTarget = currentPos.x === TARGET_POSITION.x && currentPos.y === TARGET_POSITION.y;
      const hasCollision = currentEnemies.some(
        (enemy) => enemy.x === currentPos.x && enemy.y === currentPos.y
      );

      if (isAtTarget) {
        setGameStatus("win");
        return;
      }
      if (hasCollision) {
        setGameStatus("lose");
        return;
      }
    }
    
    // If script finishes without win/loss
    setGameStatus("idle");
    setCurrentStep(null);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <main className="flex flex-col min-h-screen items-center justify-center p-4 md:p-8 space-y-4 bg-background dark:bg-background">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Vũ Điệu Trật Tự</h1>
          <p className="text-muted-foreground">Lập trình vũ đạo, chinh phục pattern.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full max-w-7xl">
          <Card className="lg:col-span-2 aspect-square">
             <GameBoard
                gridSize={GRID_SIZE}
                playerPos={playerPos}
                playerDir={playerDir}
                enemies={enemies}
                targetPos={TARGET_POSITION}
             />
          </Card>
          
          <div className="lg:col-span-1">
            <SortableContext items={script} strategy={verticalListSortingStrategy}>
              <ScriptEditor
                  script={script}
                  currentStep={currentStep}
                  isExecuting={isExecuting}
                  onAddCommand={addCommand}
                  onRemoveCommand={removeCommand}
                  onClearScript={clearScript}
                  onRunScript={runScript}
                  onResetGame={resetGame}
              />
            </SortableContext>
          </div>
        </div>

        <GameStatusDialog
          status={gameStatus}
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
