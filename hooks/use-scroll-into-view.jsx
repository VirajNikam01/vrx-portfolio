import { useEffect, useRef } from "react";

export function useScrollIntoView(
  trigger,
  options = { behavior: "smooth", block: "nearest" },
) {
  const ref = useRef(null);

  useEffect(() => {
    if (trigger) {
      ref.current?.scrollIntoView(options);
    }
  }, [trigger]);

  return ref;
}
