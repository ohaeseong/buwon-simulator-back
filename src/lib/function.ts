export function callback(feature: () => void) {
  try {
    return () => feature();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function generateArray(max: number) {
  const result = [];
  for (let i = 0; i <= Math.ceil(max / 100) * 100; i += 100) {
    result.push(i);
  }

  return result;
}

export function normalizeValue(value: string): number | string {
  const match = value.match(/^\d+/);
  if (match) return parseInt(match[0], 10);

  if (!isNaN(Number(value))) return Number(value);

  return value;
}
