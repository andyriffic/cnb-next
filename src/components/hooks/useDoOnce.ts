import { useEffect, useRef } from "react";

export const useDoOnce = (fn: () => void, condition: boolean = true) => {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!condition) {
      return;
    }
    if (hasRunRef.current) {
      return;
    }
    hasRunRef.current = true;
    fn();
  }, [fn, condition]);
};
