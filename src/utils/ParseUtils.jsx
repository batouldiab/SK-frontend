const safeParseInt = (val) => {
  if (typeof val === 'number') return Math.floor(val);
  const parsed = parseInt(String(val).replace(/[^\d]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};
const safeParseFloat = (val) => {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};
export { safeParseInt, safeParseFloat };