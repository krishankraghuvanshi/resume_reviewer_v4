const axios = require("axios");
const { getOpenAiConfig } = require("../config/openai.config");
const { gatewayTimeout, serviceUnavailable, badGateway } = require("../utils/httpErrors");

function safeJsonParse(maybeJson) {
  if (typeof maybeJson !== "string") return { ok: false, error: "not a string" };
  try {
    return { ok: true, value: JSON.parse(maybeJson) };
  } catch (e) {
    // Fallback: attempt to extract the JSON object substring.
    const first = maybeJson.indexOf("{");
    const last = maybeJson.lastIndexOf("}");
    if (first >= 0 && last > first) {
      const sub = maybeJson.slice(first, last + 1);
      try {
        return { ok: true, value: JSON.parse(sub) };
      } catch (_) {
        return { ok: false, error: e.message };
      }
    }
    return { ok: false, error: e.message };
  }
}

async function createJsonCompletion({ system, user, resumeId, log }) {
  const { apiKey, baseUrl, model, timeoutMs } = getOpenAiConfig();

  const start = process.hrtime.bigint();
  try {
    const resp = await axios({
      method: "post",
      url: `${baseUrl.replace(/\/$/, "")}/chat/completions`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: timeoutMs,
      data: {
        model,
        temperature: 0,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        response_format: { type: "json_object" }
      },
      validateStatus: (s) => s >= 200 && s < 300
    });

    const ms = Number((process.hrtime.bigint() - start) / 1000000n);
    const usage = resp.data && resp.data.usage ? resp.data.usage : null;

    const content = resp.data?.choices?.[0]?.message?.content;
    const parsed = safeJsonParse(content || "");
    if (!parsed.ok) {
      log.error({ resume_id: resumeId, parse_error: parsed.error, ms }, "openai returned non-json");
      throw badGateway("LLM returned invalid JSON");
    }

    log.info({ resume_id: resumeId, ms, usage }, "openai call completed");
    return { json: parsed.value, usage };
  } catch (err) {
    if (err.code === "ECONNABORTED") throw gatewayTimeout("OpenAI request timed out");
    if (err.response) {
      // OpenAI errors include status + data.
      log.error(
        { resume_id: resumeId, status: err.response.status, data: err.response.data },
        "openai request failed"
      );
      throw badGateway("LLM request failed");
    }
    log.error({ resume_id: resumeId, err }, "openai request failed");
    throw serviceUnavailable("LLM service unavailable");
  }
}

module.exports = { createJsonCompletion };


