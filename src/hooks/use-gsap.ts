import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Runs a GSAP animation scoped to a container ref, cleaning up
 * (reverting all tweens/timelines/selectors) on unmount or re-run.
 *
 * Usage:
 *   const containerRef = useGsapContext((ctx, container) => {
 *     gsap.from(".box", { opacity: 0, y: 20 });
 *   }, [deps]);
 */
export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  callback: (context: gsap.Context, container: T | null) => void,
  deps: React.DependencyList = []
) {
  const containerRef = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      callback(ctx, containerRef.current);
    }, containerRef);

    return () => ctx.revert();
  }, deps);

  return containerRef;
}
