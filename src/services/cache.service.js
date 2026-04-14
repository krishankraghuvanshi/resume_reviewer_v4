const { logger } = require("../utils/logger");

const MAX_ENTRIES = Number(process.env.CACHE_MAX_ENTRIES || 500);
const TTL_MS = Number(process.env.CACHE_TTL_MS || 6 * 60 * 60 * 1000); // 6 hours

// Simple in-memory cache (per-process). For production scale-out, replace with Redis.
class InMemoryCache {
  constructor() {
    this.map = new Map(); // key -> { value, expiresAt }
  }

  get(key) {
    const entry = this.map.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key, value) {
    if (this.map.size >= MAX_ENTRIES) {
      // naive eviction: delete oldest inserted
      const firstKey = this.map.keys().next().value;
      if (firstKey) this.map.delete(firstKey);
      logger.warn({ max_entries: MAX_ENTRIES }, "cache at capacity; evicting oldest");
    }
    this.map.set(key, { value, expiresAt: Date.now() + TTL_MS });
  }
}

const cache = new InMemoryCache();

module.exports = { cache };


