import {useState, useEffect, useCallback} from 'react';

const usePopupRedirect = (timeout = 2000) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [onTimeoutCallback, setOnTimeoutCallback] = useState(null);

  const showPopup = useCallback((msg, onTimeout) => {
    setMessage(msg);
    setOnTimeoutCallback(() => onTimeout);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isVisible && onTimeoutCallback) {
      const timer = setTimeout(() => {
        onTimeoutCallback();
        hidePopup();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onTimeoutCallback, timeout, hidePopup]);

  const hidePopup = useCallback(() => {
    setIsVisible(false);
    setMessage('');
    setOnTimeoutCallback(null);
  }, []);

  return {
    isVisible,
    message,
    showPopup,
    hidePopup,
  };
};

export default usePopupRedirect;
