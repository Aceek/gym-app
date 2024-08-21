import {useState, useEffect, useCallback} from 'react';

const useCountdown = (initialTime, onComplete) => {
  const [timer, setTimer] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive) {
      const countdown = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 1) {
            return prevTimer - 1;
          } else {
            clearInterval(countdown);
            onComplete();
            setIsActive(false);
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [isActive, onComplete]);

  const startCountdown = useCallback(() => {
    setTimer(initialTime);
    setIsActive(true);
  }, [initialTime]);

  const resetCountdown = useCallback(() => {
    setIsActive(false);
    setTimer(initialTime);
  }, [initialTime]);

  return {timer, startCountdown, resetCountdown, isActive};
};

export default useCountdown;
