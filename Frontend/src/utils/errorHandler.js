export const handleError = error => {
  let errorMessage = 'An unknown error occurred';

  if (error.response && error.response.data) {
    const {error: errorDetails} = error.response.data;

    if (errorDetails) {
      if (errorDetails.details && Array.isArray(errorDetails.details)) {
        errorMessage = errorDetails.details
          .map(err => `${err.field}: ${err.message}`)
          .join('\n');
      } else if (errorDetails.message) {
        errorMessage = errorDetails.message;
      }
    }
  } else if (error.message) {
    errorMessage = error.message;
  }

  console.error('Error:', errorMessage);
  return errorMessage;
};
