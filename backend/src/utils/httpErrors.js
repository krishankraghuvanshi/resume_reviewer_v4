class HttpError extends Error {
  constructor(statusCode, message, publicMessage) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.publicMessage = publicMessage || message;
  }
}

function badRequest(message = "Bad Request") {
  return new HttpError(400, message, message);
}

function unsupportedMediaType(message = "Unsupported Media Type") {
  return new HttpError(415, message, message);
}

function payloadTooLarge(message = "Payload Too Large") {
  return new HttpError(413, message, message);
}

function gatewayTimeout(message = "Gateway Timeout") {
  return new HttpError(504, message, message);
}

function serviceUnavailable(message = "Service Unavailable") {
  return new HttpError(503, message, message);
}

function badGateway(message = "Bad Gateway") {
  return new HttpError(502, message, message);
}

module.exports = {
  HttpError,
  badRequest,
  unsupportedMediaType,
  payloadTooLarge,
  badGateway,
  gatewayTimeout,
  serviceUnavailable
};


