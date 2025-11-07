// Utilities to convert object keys between snake_case and camelCase
function toCamel(s: string) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function toSnake(s: string) {
  return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

export function camelizeKeys<T>(obj: any): T {
  if (obj == null) return obj;
  if (Array.isArray(obj)) return obj.map((v) => camelizeKeys(v)) as any;
  if (typeof obj === "object") {
    return Object.keys(obj).reduce((acc: any, key) => {
      const newKey = toCamel(key);
      acc[newKey] = camelizeKeys(obj[key]);
      return acc;
    }, {} as any) as T;
  }
  return obj as T;
}

export function snakeifyKeys(obj: any): any {
  if (obj == null) return obj;
  if (Array.isArray(obj)) return obj.map((v) => snakeifyKeys(v));
  if (typeof obj === "object") {
    return Object.keys(obj).reduce((acc: any, key) => {
      const newKey = toSnake(key);
      acc[newKey] = snakeifyKeys(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

export default {
  camelizeKeys,
  snakeifyKeys,
};
