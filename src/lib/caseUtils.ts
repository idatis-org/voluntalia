// Utilities to convert object keys between snake_case and camelCase
function toCamel(s: string) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function toSnake(s: string) {
  return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

/**
 * Recursively convert object keys from snake_case to camelCase.
 * Returns a strongly-typed T when possible. Uses `unknown` internally to
 * avoid unsafe `any` usages that the project's eslint rules forbid.
 */
export function camelizeKeys<T = unknown>(obj: unknown): T {
  if (obj == null) return obj as T;
  if (Array.isArray(obj)) return obj.map((v) => camelizeKeys(v)) as unknown as T;
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    const result: Record<string, unknown> = {};
    for (const [key, value] of entries) {
      const newKey = toCamel(key);
      result[newKey] = camelizeKeys(value);
    }
    return result as T;
  }
  return obj as T;
}

/**
 * Recursively convert object keys from camelCase to snake_case.
 */
export function snakeifyKeys<T = unknown>(obj: unknown): T {
  if (obj == null) return obj as T;
  if (Array.isArray(obj)) return obj.map((v) => snakeifyKeys(v)) as unknown as T;
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    const result: Record<string, unknown> = {};
    for (const [key, value] of entries) {
      const newKey = toSnake(key);
      result[newKey] = snakeifyKeys(value);
    }
    return result as T;
  }
  return obj as T;
}

export default {
  camelizeKeys,
  snakeifyKeys,
};
