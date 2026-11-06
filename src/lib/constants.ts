export const AREAS = [
  'Agia Paraskevi',
  'Ambelokipi',
  'Chalandri',
  'Egaleo',
  'Exarchia',
  'Gazi',
  'Glyfada',
  'Goudi',
  'Holargos',
  'Ilioupoli',
  'Kaisariani',
  'Kallithea',
  'Kifisia',
  'Kolonaki',
  'Kolonos',
  'Koukaki',
  'Kypseli',
  'Marousi',
  'Mets',
  'Monastiraki',
  'Moschato',
  'Nea Smyrni',
  'Neos Kosmos',
  'Pagkrati',
  'Palaio Faliro',
  'Patisia',
  'Peristeri',
  'Petralona',
  'Plaka',
  'Psirri',
  'Thiseio',
  'Vironas',
  'Voula',
  'Vouliagmeni',
  'Zografou',
] as const;
export type Area = (typeof AREAS)[number];

export const CATEGORIES = [
  'Martial Arts',
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

export const QUALIFICATIONS = [
  'sports_science',
  'education',
  'arts',
  'university',
  'certified_coach',
  'federation_license',
  'first_aid',
] as const;

export const AGE_GROUPS: { key: string; min: number; max: number | null }[] = [
  { key: '4-6', min: 4, max: 6 },
  { key: '7-9', min: 7, max: 9 },
  { key: '10-12', min: 10, max: 12 },
  { key: '13-17', min: 13, max: 17 },
  { key: '18plus', min: 18, max: null },
];

export const CATEGORY_ICONS: Record<string, string> = {
  'Martial Arts': 'Hand',
  Music: 'Music',
  Dance: 'PartyPopper',
  Art: 'Palette',
  Yoga: 'Flower2',
  Swimming: 'Waves',
  Languages: 'Languages',
  Tennis: 'CircleDot',
  Basketball: 'Dribbble',
  Gym: 'Dumbbell',
  Theater: 'Drama',
  Football: 'Volleyball',
};

export const CATEGORY_COLORS: Record<string, string> = {
  'Martial Arts': 'bg-rose-100 text-rose-700',
  Music: 'bg-violet-100 text-violet-700',
  Dance: 'bg-pink-100 text-pink-700',
  Art: 'bg-amber-100 text-amber-700',
  Yoga: 'bg-emerald-100 text-emerald-700',
  Swimming: 'bg-sky-100 text-sky-700',
  Languages: 'bg-indigo-100 text-indigo-700',
  Tennis: 'bg-lime-100 text-lime-700',
  Basketball: 'bg-orange-100 text-orange-700',
  Gym: 'bg-stone-100 text-stone-700',
  Theater: 'bg-fuchsia-100 text-fuchsia-700',
  Football: 'bg-green-100 text-green-700',
};

// Pattern classes for colorblind mode — each category gets a distinct
// border style so it's identifiable without relying on hue.
export const CATEGORY_CB_BADGES: Record<string, string> = {
  'Martial Arts': 'cb-badge cb-badge-martial',
  Music: 'cb-badge cb-badge-music',
  Dance: 'cb-badge cb-badge-dance',
  Art: 'cb-badge cb-badge-art',
  Yoga: 'cb-badge cb-badge-yoga',
  Swimming: 'cb-badge cb-badge-swim',
  Languages: 'cb-badge cb-badge-lang',
  Tennis: 'cb-badge cb-badge-tennis',
  Basketball: 'cb-badge cb-badge-bball',
  Gym: 'cb-badge cb-badge-gym',
  Theater: 'cb-badge cb-badge-theater',
  Football: 'cb-badge cb-badge-football',
};
