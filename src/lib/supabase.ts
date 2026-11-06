import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Store = {
  id: string;
  name: string;
  description: string;
  category: string;
  area: string;
  address: string;
  phone: string;
  email: string;
  image_url: string | null;
  photo_url_1: string | null;
  photo_url_2: string | null;
  floor: string | null;
  disability_access: boolean;
  rate_info: string | null;
  first_class_discount_pct: number;
  weekly_schedule: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

export type ClassItem = {
  id: string;
  store_id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  age_min: number;
  age_max: number | null;
  price_eur: number;
  duration_minutes: number;
  capacity: number;
  weekly_schedule: string;
  image_url: string | null;
  created_at: string;
  store?: Store;
};

export type Booking = {
  id: string;
  class_id: string;
  participant_name: string;
  participant_age: number;
  guardian_name: string | null;
  booker_name: string;
  booker_email: string;
  booker_phone: string;
  preferred_date: string;
  notes: string | null;
  status: string;
  created_at: string;
};

export type BookingInput = Omit<Booking, 'id' | 'status' | 'created_at'>;

export type TeacherStatus = 'draft' | 'pending' | 'published';

export type Teacher = {
  id: string;
  store_id: string;
  name: string;
  photo_url: string | null;
  academic_status: string | null;
  experience_years: number;
  experience: string | null;
  age_min: number;
  age_max: number | null;
  status: TeacherStatus;
  created_at: string;
  updated_at: string;
};

export type TeacherInput = Pick<
  Teacher,
  'name' | 'photo_url' | 'academic_status' | 'experience_years' | 'experience' | 'age_min' | 'age_max'
>;
