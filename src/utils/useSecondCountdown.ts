import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

function appendZero(number: number): string {
  return ('0' + number).slice(-2);
}

export default function useSecondCountdown({ init = 60, automatic = true }: { init: number; automatic?: boolean }) {
  const [countdown, setCountdown] = useState<number>(init);
  const [autoStart, setAutoStart] = useState<boolean>(automatic);

  useEffect(() => {
    if (autoStart) {
      const interval = setInterval(() => {
        if (countdown === 0) {
          clearInterval(interval);
        } else {
          setCountdown((prevCount) => prevCount - 1);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    return;
  }, [countdown, autoStart]);

  function start(cooldown?: number) {
    setAutoStart(true);
    setCountdown(cooldown || init);
  }

  function restart(cooldown?: number) {
    setAutoStart(true);
    setCountdown(cooldown || init);
  }

  const minutes = appendZero(Math.floor(countdown / 60));
  const seconds = appendZero(Math.floor(countdown % 60));

  const _countdown = { minutes, seconds };

  return { isFinished: !Boolean(countdown), countdown: _countdown, restart, start };
}
