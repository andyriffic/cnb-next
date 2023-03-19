import { useEffect, useRef } from "react";

export const useDoOnce = (fn: () => void) => {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) {
      return;
    }
    hasRunRef.current = true;
    fn();
  }, [fn]);
};
