export const handleError = error => {
  let message = 'An unknown error occurred';
  let details = {};

  if (error.response && error.response.data) {
    const {error: errorInfo} = error.response.data;

    if (errorInfo) {
      if (errorInfo.message) {
        message = errorInfo.message;
      }

      if (errorInfo.details) {
        details = errorInfo.details;
      }
    }
  } else if (error.message) {
    message = error.message;
  }

  return {message, ...details};
};
