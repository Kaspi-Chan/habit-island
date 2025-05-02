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
