"use client";

import type { FC } from "react";

export const Enemy: FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-1.5">
      <div className="w-full h-full bg-destructive rounded-md shadow-md"></div>
    </div>
  );
};
