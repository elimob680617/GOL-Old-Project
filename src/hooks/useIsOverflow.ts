import { useLayoutEffect, useState } from 'react';

const useIsOverflow = (ref) => {
  const [isOverflow, setIsOverflow] = useState<boolean | undefined>(undefined);

  useLayoutEffect(() => {
    const trigger = () => {
      const hasOverflow = ref?.current?.scrollWidth > ref?.current?.clientWidth;

      setIsOverflow(hasOverflow);
    };

    if (ref?.current) {
      trigger();
    }
  }, [ref]);

  return isOverflow;
};

export default useIsOverflow;
