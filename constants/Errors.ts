enum ErrorCodes {
    ServerError = 500,
    NotFound = 404,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    Unknown = 0,
}

const ErrorMessages = {
    [ErrorCodes.ServerError]: "An internal server error occurred, please try again later",
    [ErrorCodes.NotFound]: "The requested resource was not found",
    [ErrorCodes.BadRequest]: "Email or password is incorrect, please try again",
    [ErrorCodes.Unauthorized]: "Email or password is incorrect, please try again",
    [ErrorCodes.Forbidden]: "You are forbidden to access this resource",
    [ErrorCodes.Unknown]: "An unknown error occurred",
}

export {ErrorCodes, ErrorMessages};