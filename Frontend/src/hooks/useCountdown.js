import {useState, useEffect, useCallback} from 'react';
import {
  storeTimerData,
  getStoredTimerData,
  clearStoredTimerData,
} from '../utils/storageUtils';

const useCountdown = (initialTime, onComplete, storageKey) => {
  const [timer, setTimer] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const loadTimer = async () => {
      const {storedTime, lastUpdate} = await getStoredTimerData(storageKey);
      const now = Date.now();

      if (storedTime && lastUpdate) {
        const timeElapsed = Math.floor((now - parseInt(lastUpdate, 10)) / 1000);
        const newTime = parseInt(storedTime, 10) - timeElapsed;

        if (newTime > 0) {
          setTimer(newTime);
          setIsActive(true);
        } else {
          onComplete();
          await clearStoredTimerData(storageKey);
        }
      }
    };

    loadTimer();
  }, [onComplete, storageKey]);

  useEffect(() => {
    if (isActive) {
      const countdown = setInterval(async () => {
        setTimer(prevTimer => {
          const newTime = prevTimer - 1;
          if (newTime > 0) {
            storeTimerData(storageKey, newTime);
            return newTime;
          } else {
            clearInterval(countdown);
            onComplete();
            setIsActive(false);
            clearStoredTimerData(storageKey);
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [isActive, onComplete, storageKey]);

  const startCountdown = useCallback(async () => {
    setTimer(initialTime);
    setIsActive(true);
    await storeTimerData(storageKey, initialTime);
  }, [initialTime, storageKey]);

  const resetCountdown = useCallback(async () => {
    setIsActive(false);
    setTimer(initialTime);
    await clearStoredTimerData(storageKey);
  }, [initialTime, storageKey]);

  return {timer, startCountdown, resetCountdown, isActive};
};

export default useCountdown;
