import { useState } from 'react';
import { Loader2, AlertCircle, X, Check } from 'lucide-react';
import { supabase, type Teacher, type TeacherInput } from '@/lib/supabase';
import { AGE_GROUPS, QUALIFICATIONS } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';
import {
  ageGroupsFromRange,
  parseQualifications,
  rangeFromAgeGroups,
} from '@/lib/teacherFields';

type Props = {
  teacher: Teacher | null;
  storeId: string;
  onClose: () => void;
  onSaved: () => void;
};

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder:text-stone-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all text-sm';
const labelCls = 'block text-sm font-medium text-stone-700 mb-1.5';

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function TeacherFormModal({ teacher, storeId, onClose, onSaved }: Props) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    name: teacher?.name ?? '',
    photo_url: teacher?.photo_url ?? '',
    experience_years: teacher?.experience_years?.toString() ?? '0',
    experience: teacher?.experience ?? '',
  });
  const [qualifications, setQualifications] = useState<string[]>(() =>
    parseQualifications(teacher?.academic_status ?? null)
  );
  const [ageGroups, setAgeGroups] = useState<string[]>(() =>
    teacher ? ageGroupsFromRange(teacher.age_min, teacher.age_max) : []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPublished = teacher?.status === 'published';

  const buildInput = (range: { min: number; max: number | null }): TeacherInput => ({
    name: form.name.trim(),
    photo_url: form.photo_url.trim() || null,
    academic_status: qualifications.join(',') || null,
    experience_years: Math.max(0, parseInt(form.experience_years, 10) || 0),
    experience: form.experience.trim() || null,
    age_min: range.min,
    age_max: range.max,
  });

  const handleSave = async (status: 'draft' | 'pending') => {
    const range = rangeFromAgeGroups(ageGroups);
    if (!range) {
      setError(t('teachers.ageGroupRequired'));
      return;
    }
    const input = buildInput(range);

    setSaving(true);
    setError(null);

    const res = teacher
      ? await supabase.from('teachers').update({ ...input, status }).eq('id', teacher.id).select('id')
      : await supabase.from('teachers').insert([{ ...input, status, store_id: storeId }]).select('id');

    if (res.error || !res.data || res.data.length === 0) {
      setError(t('teachers.saveError'));
      setSaving(false);
      return;
    }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-stone-900">
            {teacher ? t('teachers.editTitle') : t('teachers.addTitle')}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave('pending');
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className={labelCls}>{t('teachers.name')}</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>{t('teachers.photo')}</label>
            <input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} placeholder="https://..." className={inputCls} />
            {form.photo_url && (
              <div className="mt-3 h-28 w-28 rounded-xl overflow-hidden bg-stone-100">
                <img src={form.photo_url} alt={form.name} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className={labelCls}>{t('teachers.qualifications')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUALIFICATIONS.map((q) => {
                const checked = qualifications.includes(q);
                return (
                  <label
                    key={q}
                    className={`flex items-center gap-2.5 cursor-pointer select-none px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                      checked
                        ? 'bg-teal-50 border-teal-300 text-teal-800'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-teal-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setQualifications(toggle(qualifications, q))}
                      className="sr-only"
                    />
                    <span
                      className={`w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center ${
                        checked ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-stone-300'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3" />}
                    </span>
                    {t(`qual.${q}`)}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelCls}>{t('teachers.ageGroups')}</label>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map((g) => {
                const checked = ageGroups.includes(g.key);
                return (
                  <label
                    key={g.key}
                    className={`inline-flex items-center gap-2 cursor-pointer select-none px-3.5 py-2 rounded-full border text-sm font-medium transition-colors ${
                      checked
                        ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-teal-300 hover:text-teal-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setAgeGroups(toggle(ageGroups, g.key))}
                      className="sr-only"
                    />
                    {t(`filter.age.${g.key}`)}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelCls}>{t('teachers.experienceYearsLabel')}</label>
            <input type="number" min={0} max={80} value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>{t('teachers.experience')}</label>
            <textarea value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} rows={4} placeholder={t('teachers.experiencePh')} className={`${inputCls} resize-none`} />
          </div>

          {isPublished && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">{t('teachers.republishNote')}</p>
          )}

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('teachers.submitReview')}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('draft')}
              className="px-5 py-3 rounded-xl border border-stone-200 text-stone-700 font-semibold text-sm hover:bg-stone-50 transition-colors disabled:opacity-60"
            >
              {t('teachers.saveDraft')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
