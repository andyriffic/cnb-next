import { useEffect, useRef } from "react";

export const useSomethingWhenArraySizeChanges = (
  array: Array<any> | undefined,
  doTheThing: () => void
): void => {
  const lastArrayLength = useRef(array ? array.length : 0);

  useEffect(() => {
    if (array && array.length !== lastArrayLength.current) {
      doTheThing();
      lastArrayLength.current = array.length;
    }
  }, [array, doTheThing]);

  return;
};
