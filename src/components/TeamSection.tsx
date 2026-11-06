import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { supabase, type Teacher } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import { formatQualifications } from '@/lib/teacherFields';

export function TeamSection({ storeId }: { storeId: string }) {
  const { t } = useI18n();
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('store_id', storeId)
        .eq('status', 'published')
        .order('created_at', { ascending: true });
      if (cancelled) return;
      if (error) {
        console.error('Error fetching teachers:', error);
        setTeachers([]);
        return;
      }
      setTeachers((data ?? []) as Teacher[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [storeId]);

  if (teachers.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-stone-400" />
        {t('teachers.meetTeachers')}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-2xl border border-stone-200 p-4 flex gap-4">
            <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-stone-100">
              {teacher.photo_url ? (
                <img src={teacher.photo_url} alt={teacher.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <GraduationCap className="w-7 h-7" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-stone-900 truncate">{teacher.name}</h4>
              {teacher.academic_status && (
                <p className="text-sm text-teal-700 font-medium mt-0.5">{formatQualifications(teacher.academic_status, t)}</p>
              )}
              <p className="text-xs text-stone-500 mt-1">
                {t('teachers.experienceYears', { n: teacher.experience_years })} · {teacher.age_max !== null ? t('teachers.ageRange', { min: teacher.age_min, max: teacher.age_max }) : t('teachers.agePlus', { min: teacher.age_min })}
              </p>
              {teacher.experience && (
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">{teacher.experience}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
