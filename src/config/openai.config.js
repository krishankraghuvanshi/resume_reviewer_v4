function getOpenAiConfig() {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const timeoutMs = Number(process.env.OPENAI_TIMEOUT_MS || 20000);

  if (!apiKey) {
    const err = new Error("OPENAI_API_KEY is not set");
    err.statusCode = 500;
    err.publicMessage = "Server misconfigured";
    throw err;
  }

  return { apiKey, baseUrl, model, timeoutMs };
}

module.exports = { getOpenAiConfig };


