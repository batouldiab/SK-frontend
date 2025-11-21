const normcase = (str) => {
  if (!str) return '';
  return String(str).replace(/\s+/g, ' ').trim().toLowerCase();
};

const cleanString = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/^["':,\s]+/, '')
    .replace(/["':,\s]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export { normcase, cleanString };