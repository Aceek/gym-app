import { validationResult } from "express-validator";
import { sendErrorResponse } from "../../utils/responseHandler.js";

export default (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    return sendErrorResponse(res, "Validation failed", 400, formattedErrors);
  }
  next();
};
