"use client";

import type { CSSProperties } from "react";

type SceneProgressProps = {
  progress: number;
};

export function SceneProgress({ progress }: SceneProgressProps) {
  return (
    <div className="scene-progress" style={{ "--progress": `${progress}%` } as CSSProperties} aria-hidden="true">
      <span className="scene-progress-fill" />
    </div>
  );
}
