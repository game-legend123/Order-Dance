"use client";

import type { FC } from "react";
import type { Command } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowUp, ArrowDown, Undo2, Redo2, Pause, Play, RefreshCw, Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface ScriptEditorProps {
  script: Command[];
  currentStep: number | null;
  isExecuting: boolean;
  onAddCommand: (type: Command["type"]) => void;
  onRemoveCommand: (id: string) => void;
  onClearScript: () => void;
  onRunScript: () => void;
  onResetGame: () => void;
}

const commandConfig = {
  "forward": { icon: ArrowUp, label: "Tiến" },
  "backward": { icon: ArrowDown, label: "Lùi" },
  "turn-left": { icon: Undo2, label: "Rẽ Trái" },
  "turn-right": { icon: Redo2, label: "Rẽ Phải" },
  "pause": { icon: Pause, label: "Dừng" },
};

const SortableCommandItem: FC<{ command: Command; onRemove: (id: string) => void; isExecuting: boolean; isActive: boolean }> = ({ command, onRemove, isExecuting, isActive }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: command.id, disabled: isExecuting });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const commandInfo = commandConfig[command.type];
  if (!commandInfo) return null;

  const { icon: Icon, label } = commandInfo;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between p-2 rounded-md bg-secondary/50 border transition-all",
        isActive && "ring-2 ring-primary shadow-lg",
        isExecuting && "opacity-70"
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-grab h-8 w-8"
          disabled={isExecuting}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Icon className="h-5 w-5 text-primary" />
        <span className="font-medium">{label}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onRemove(command.id)}
        disabled={isExecuting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const ScriptEditor: FC<ScriptEditorProps> = ({
  script,
  currentStep,
  isExecuting,
  onAddCommand,
  onRemoveCommand,
  onClearScript,
  onRunScript,
  onResetGame,
}) => {
  return (
    <Card className="flex flex-col h-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Bảng Lập Trình</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(commandConfig) as Array<keyof typeof commandConfig>).map((type) => {
            const { icon: Icon, label } = commandConfig[type];
            return (
              <Button
                key={type}
                variant="outline"
                onClick={() => onAddCommand(type)}
                disabled={isExecuting}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            )
          })}
        </div>
        <Separator />
        <div className="relative flex-grow min-h-0">
          <ScrollArea className="h-full absolute inset-0">
            {script.length > 0 ? (
              <div className="space-y-2 p-1">
                {script.map((cmd, index) => (
                  <SortableCommandItem
                    key={cmd.id}
                    command={cmd}
                    onRemove={onRemoveCommand}
                    isExecuting={isExecuting}
                    isActive={currentStep === index}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
                <p>Thêm các lệnh ở trên để tạo kịch bản di chuyển cho nhân vật.</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t pt-6">
        <Button
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          size="lg"
          onClick={onRunScript}
          disabled={isExecuting || script.length === 0}
        >
          <Play className="mr-2 h-5 w-5" />
          Chạy Vũ Điệu
        </Button>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button variant="outline" onClick={onClearScript} disabled={isExecuting || script.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa Script
          </Button>
          <Button variant="destructive" onClick={onResetGame} disabled={isExecuting}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Chơi Lại
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
