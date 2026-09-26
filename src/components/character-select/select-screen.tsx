import type { ReactNode } from "react";

type SelectScreenProps = {
  children: ReactNode;
};

/** Full-viewport stage; children are stacked layers in paint order. */
export function SelectScreen({ children }: SelectScreenProps) {
  return (
    <main className="relative isolate h-dvh w-full overflow-hidden bg-black text-white select-none">
      {children}
    </main>
  );
}
