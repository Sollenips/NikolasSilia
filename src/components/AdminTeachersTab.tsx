import { useState, useEffect, useCallback } from 'react';
import { Loader2, Check, Undo2, EyeOff } from 'lucide-react';
import { supabase, type Teacher, type TeacherStatus } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import { formatQualifications } from '@/lib/teacherFields';
import { TeacherStatusBadge } from '@/components/TeacherStatusBadge';

type TeacherWithStore = Teacher & { store: { name: string } | null };

const FILTERS: TeacherStatus[] = ['pending', 'published', 'draft'];

export function AdminTeachersTab() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<TeacherStatus>('pending');
  const [teachers, setTeachers] = useState<TeacherWithStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('teachers')
      .select('*, store:stores(name)')
      .order('updated_at', { ascending: false });
    if (fetchError) {
      setError(t('adminTeachers.loadError'));
    } else {
      setTeachers((data ?? []) as TeacherWithStore[]);
    }
    setLoading(false);
  }, [t]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const changeStatus = async (teacher: TeacherWithStore, status: TeacherStatus) => {
    setBusyId(teacher.id);
    setError(null);
    const { data, error: updateError } = await supabase
      .from('teachers')
      .update({ status })
      .eq('id', teacher.id)
      .select('id');
    setBusyId(null);
    if (updateError || !data || data.length === 0) {
      setError(t('adminTeachers.updateError'));
      return;
    }
    setTeachers((prev) => prev.map((x) => (x.id === teacher.id ? { ...x, status } : x)));
  };

  const visible = teachers.filter((tc) => tc.status === filter);
  const counts = (status: TeacherStatus) => teachers.filter((tc) => tc.status === status).length;

  return (
    <div>
      <p className="text-sm text-stone-500 mb-4">{t('adminTeachers.note')}</p>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              filter === status
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-teal-300'
            }`}
          >
            {t(`adminTeachers.filter.${status}`)} ({counts(status)})
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="text-sm">{t('adminTeachers.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visible.map((teacher) => {
            const busy = busyId === teacher.id;
            return (
              <div key={teacher.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex">
                <div className="w-24 flex-shrink-0 bg-stone-100">
                  {teacher.photo_url ? (
                    <img src={teacher.photo_url} alt={teacher.name} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-stone-900 leading-tight truncate">{teacher.name}</h3>
                      <TeacherStatusBadge status={teacher.status} />
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5 truncate">{teacher.store?.name}</p>
                    {teacher.academic_status && (
                      <p className="text-xs text-stone-600 mt-1">{formatQualifications(teacher.academic_status, t)}</p>
                    )}
                    <p className="text-xs text-stone-500 mt-0.5">
                      {t('teachers.experienceYears', { n: teacher.experience_years })} · {teacher.age_max !== null ? t('teachers.ageRange', { min: teacher.age_min, max: teacher.age_max }) : t('teachers.agePlus', { min: teacher.age_min })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 mt-3">
                    {teacher.status === 'pending' && (
                      <>
                        <button
                          onClick={() => changeStatus(teacher, 'published')}
                          disabled={busy}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-60"
                        >
                          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          {t('adminTeachers.approve')}
                        </button>
                        <button
                          onClick={() => changeStatus(teacher, 'draft')}
                          disabled={busy}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-60"
                        >
                          <Undo2 className="w-3.5 h-3.5" /> {t('adminTeachers.returnDraft')}
                        </button>
                      </>
                    )}
                    {teacher.status === 'published' && (
                      <button
                        onClick={() => changeStatus(teacher, 'draft')}
                        disabled={busy}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-60"
                      >
                        <EyeOff className="w-3.5 h-3.5" /> {t('adminTeachers.unpublish')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
