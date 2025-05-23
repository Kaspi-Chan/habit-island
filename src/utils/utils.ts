export const getRandomProperty = (obj: Object) => {
  const keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0] as keyof typeof obj];
};

export const getRandomKey = (obj: Object) => {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
};

export const getRandomString = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const isWithinRange = (
  value: number,
  reference: number,
  range: number
) => value >= reference - range && value <= reference + range;

export const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

export const getDay = (after: number) => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + after,
    0,
    0,
    0,
    0
  );
};

export const formatDateForInput = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
