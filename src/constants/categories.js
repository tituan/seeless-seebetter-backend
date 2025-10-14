export const CATEGORIES = [
  { key: "fashion", label: "Fashion" },
  { key: "art",     label: "Art" },
  { key: "bars",    label: "Bars" },
  { key: "expos",   label: "Expos" },
  { key: "music",   label: "Music" },
  { key: "paris",   label: "Paris" },
  { key: "restos",  label: "Restos" },
  { key: "shopping",label: "Shopping" },
];

// util: liste des clés autorisées
export const CATEGORY_KEYS = CATEGORIES.map(c => c.key);

// normalisation douce (ex: "Paris " -> "paris")
export function normalizeCategory(v) {
  if (!v) return v;
  const k = String(v).trim().toLowerCase();
  return CATEGORY_KEYS.includes(k) ? k : null;
}