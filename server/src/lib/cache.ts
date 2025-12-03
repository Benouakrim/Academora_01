/**
 * Simple in-memory cache implementation
 * Simulates Redis for development and small-scale deployments
 * For production with multiple instances, consider Redis or similar
 */

interface CacheEntry {
  value: any;
  expires: number;
}

const cache = new Map<string, CacheEntry>();

// Cache TTL constants
export const TTL_SHORT = 60000;   // 1 minute
export const TTL_LONG = 300000;   // 5 minutes

/**
 * Set a value in cache with TTL
 * @param key Cache key
 * @param value Value to cache
 * @param ttl Time to live in milliseconds (default: TTL_LONG)
 */
export function set(key: string, value: any, ttl: number = TTL_LONG): void {
  cache.set(key, {
    value,
    expires: Date.now() + ttl,
  });
}

/**
 * Get a value from cache
 * Returns undefined if not found or expired
 * @param key Cache key
 */
export function get(key: string): any | undefined {
  const entry = cache.get(key);
  
  if (!entry) {
    return undefined;
  }
  
  // Check if expired
  if (entry.expires < Date.now()) {
    cache.delete(key);
    return undefined;
  }
  
  return entry.value;
}

/**
 * Delete a specific key from cache
 * @param key Cache key
 */
export function del(key: string): boolean {
  return cache.delete(key);
}

/**
 * Clear entire cache
 */
export function clear(): void {
  cache.clear();
}

/**
 * Get cache stats
 */
export function stats() {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;
  
  cache.forEach((entry) => {
    if (entry.expires >= now) {
      validEntries++;
    } else {
      expiredEntries++;
    }
  });
  
  return {
    totalEntries: cache.size,
    validEntries,
    expiredEntries,
  };
}

// Cleanup expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  cache.forEach((entry, key) => {
    if (entry.expires < now) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => cache.delete(key));
  
  if (keysToDelete.length > 0) {
    console.log(`[Cache] Cleaned up ${keysToDelete.length} expired entries`);
  }
}, 600000); // 10 minutes
