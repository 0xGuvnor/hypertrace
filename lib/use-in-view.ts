"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type UseInViewOptions = {
  rootMargin?: string;
  threshold?: number | number[];
  /** When false, the observer disconnects and inView latches false. */
  enabled?: boolean;
};

export type UseInViewResult = {
  ref: (node: Element | null) => void;
  inView: boolean;
};

export function useInView(options?: UseInViewOptions): UseInViewResult {
  const { rootMargin, threshold, enabled = true } = options ?? {};
  const [inView, setInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRef = useRef<Element | null>(null);

  const disconnect = useCallback(() => {
    observerRef.current?.disconnect();
    observerRef.current = null;
  }, []);

  const observe = useCallback(
    (node: Element) => {
      disconnect();
      if (typeof IntersectionObserver === "undefined") {
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setInView(entry?.isIntersecting ?? false);
        },
        { rootMargin, threshold },
      );
      observer.observe(node);
      observerRef.current = observer;
    },
    [disconnect, rootMargin, threshold],
  );

  const ref = useCallback(
    (node: Element | null) => {
      nodeRef.current = node;
      if (!enabled || node === null) {
        disconnect();
        setInView(false);
        return;
      }
      observe(node);
    },
    [disconnect, enabled, observe],
  );

  useEffect(() => {
    if (!enabled) {
      disconnect();
      setInView(false);
      return;
    }
    if (nodeRef.current !== null) {
      observe(nodeRef.current);
    }
    return disconnect;
  }, [disconnect, enabled, observe]);

  return { ref, inView };
}
