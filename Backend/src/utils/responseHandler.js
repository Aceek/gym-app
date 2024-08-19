export const sendSuccessResponse = (
  res,
  data = null,
  message = "Operation successful",
  statusCode = 200
) => {
  const response = {
    status: "success",
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const sendErrorResponse = (res, errorMessage, errorCode = 500) => {
  return res.status(errorCode).json({
    status: "error",
    error: {
      code: errorCode,
      message: errorMessage,
    },
  });
};
