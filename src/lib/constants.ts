export const AREAS = [
  'Pagrati',
  'Ilioupoli',
  'Zografou',
  'Vironas',
  'Kaisariani',
] as const;
export type Area = (typeof AREAS)[number];

export const CATEGORIES = [
  'Music',
  'Dance',
  'Art',
  'Yoga',
  'Swimming',
  'Languages',
  'Tennis',
  'Basketball',
  'Gym',
  'Theater',
  'Football',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  Music: 'bg-violet-100 text-violet-800',
  Dance: 'bg-pink-100 text-pink-800',
  Art: 'bg-amber-100 text-amber-800',
  Yoga: 'bg-emerald-100 text-emerald-800',
  Swimming: 'bg-sky-100 text-sky-800',
  Languages: 'bg-indigo-100 text-indigo-800',
  Tennis: 'bg-lime-100 text-lime-800',
  Basketball: 'bg-orange-100 text-orange-800',
  Gym: 'bg-red-100 text-red-800',
  Theater: 'bg-rose-100 text-rose-800',
  Football: 'bg-green-100 text-green-800',
};

export const CATEGORY_CB_BADGES: Record<string, string> = {
  Music: 'ring-2 ring-stone-800',
  Dance: 'ring-2 ring-stone-600',
  Art: 'ring-2 ring-stone-500',
  Yoga: 'ring-2 ring-stone-700',
  Swimming: 'ring-2 ring-stone-400',
  Languages: 'ring-2 ring-stone-900',
  Tennis: 'ring-2 ring-stone-600',
  Basketball: 'ring-2 ring-stone-500',
  Gym: 'ring-2 ring-stone-700',
  Theater: 'ring-2 ring-stone-800',
  Football: 'ring-2 ring-stone-400',
};

export const AGE_GROUPS = [
  { key: '4-6', min: 4, max: 6 },
  { key: '7-9', min: 7, max: 9 },
  { key: '10-12', min: 10, max: 12 },
  { key: '13-17', min: 13, max: 17 },
  { key: '18plus', min: 18, max: null },
] as const;

export const QUALIFICATIONS = [
  'sports_science',
  'education',
  'arts',
  'university',
  'certified_coach',
  'federation_license',
  'first_aid',
] as const;
