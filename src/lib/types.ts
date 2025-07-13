export type Command = {
  id: string;
  type: "forward" | "turn-left" | "turn-right" | "pause" | "backward";
};

export type Direction = "up" | "down" | "left" | "right";

export type Position = {
  x: number;
  y: number;
};

export type GameStatus = "idle" | "running" | "win" | "lose";
