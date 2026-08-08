import type { ReactNode } from "react";

type PaperNoteProps = {
  children: ReactNode;
  className?: string;
};

export function PaperNote({ children, className = "" }: PaperNoteProps) {
  return <article className={`paper-note ${className}`}>{children}</article>;
}
