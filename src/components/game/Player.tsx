"use client";

import type { FC } from "react";
import type { Direction } from "@/lib/types";

interface PlayerProps {
  direction: Direction;
}

export const Player: FC<PlayerProps> = ({ direction }) => {
  const rotationClasses: Record<Direction, string> = {
    up: "rotate-0",
    right: "rotate-90",
    down: "rotate-180",
    left: "-rotate-90",
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-1">
      <svg
        className={`w-full h-full text-primary transition-transform duration-300 ease-in-out ${rotationClasses[direction]}`}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L2 22h20L12 2z" />
      </svg>
    </div>
  );
};
