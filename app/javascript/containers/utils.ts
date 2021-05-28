export function isEmptyObject(obj) {
  return typeof obj === 'object' && Object.keys(obj).length === 0;
}

export const getLocalTimeDate = (date: Date) =>
  date.toLocaleString(undefined, {
    hour12: true,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
