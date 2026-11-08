export const AREAS = [
  'Pagrati',
  'Ilioupoli',
  'Zografou',
  'Vironas',
  'Kaisariani',
] as const;
export type Area = (typeof AREAS)[number];
