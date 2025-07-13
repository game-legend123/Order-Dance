"use client";

import type { FC } from "react";
import type { GameStatus } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface GameStatusDialogProps {
  status: GameStatus;
  score: number;
  onReset: () => void;
  onTryAgain: () => void;
}

export const GameStatusDialog: FC<GameStatusDialogProps> = ({ status, score, onReset, onTryAgain }) => {
  const isOpen = status === "win" || status === "lose";
  const isWin = status === "win";

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={isWin ? "text-green-500" : "text-destructive"}>
            {isWin ? "Chiến Thắng!" : "Thất Bại!"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isWin
              ? `Bạn đã hoàn thành vũ điệu một cách hoàn hảo và đạt được ${score} điểm. Pattern đã được chinh phục!`
              : "Vũ điệu đã sai nhịp. Hãy thử lại một lộ trình khác."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onReset}>
            Viết Lại Script
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={onTryAgain}>
            Thử Lại
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
