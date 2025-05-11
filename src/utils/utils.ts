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
