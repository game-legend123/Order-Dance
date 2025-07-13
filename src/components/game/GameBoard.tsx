"use client";

import type { FC } from "react";
import type { Position, Direction } from "@/lib/types";
import { Player } from "@/components/game/Player";
import { Enemy } from "@/components/game/Enemy";
import { cn } from "@/lib/utils";

interface GameBoardProps {
  gridSize: number;
  playerPos: Position;
  playerDir: Direction;
  enemies: Position[];
  targetPos: Position;
}

export const GameBoard: FC<GameBoardProps> = ({
  gridSize,
  playerPos,
  playerDir,
  enemies,
  targetPos,
}) => {
  return (
    <div className="relative w-full h-full p-2 bg-muted/50 rounded-lg">
      <div
        className="relative w-full h-full grid bg-background rounded-md overflow-hidden border"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {/* Grid Cells */}
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <div key={i} className="border-r border-b border-border/50"></div>
        ))}
        
        {/* Target */}
        <div
          className="absolute flex items-center justify-center transition-all duration-300"
          style={{
            width: `${100 / gridSize}%`,
            height: `${100 / gridSize}%`,
            top: `${targetPos.y * (100 / gridSize)}%`,
            left: `${targetPos.x * (100 / gridSize)}%`,
          }}
        >
          <div className="w-3/4 h-3/4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
        </div>

        {/* Player */}
        <div
          className="absolute transition-all duration-300 ease-linear"
          style={{
            width: `${100 / gridSize}%`,
            height: `${100 / gridSize}%`,
            top: `${playerPos.y * (100 / gridSize)}%`,
            left: `${playerPos.x * (100 / gridSize)}%`,
          }}
        >
          <Player direction={playerDir} />
        </div>

        {/* Enemies */}
        {enemies.map((enemy, i) => (
          <div
            key={`enemy-${i}`}
            className="absolute transition-all duration-300 ease-linear"
            style={{
              width: `${100 / gridSize}%`,
              height: `${100 / gridSize}%`,
              top: `${enemy.y * (100 / gridSize)}%`,
              left: `${enemy.x * (100 / gridSize)}%`,
            }}
          >
            <Enemy />
          </div>
        ))}
      </div>
    </div>
  );
};
