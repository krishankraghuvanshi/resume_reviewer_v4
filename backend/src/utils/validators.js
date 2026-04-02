function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function isPdfMimetype(mimetype) {
  return String(mimetype || "").toLowerCase() === "application/pdf";
}

module.exports = { isNonEmptyString, isPdfMimetype };


