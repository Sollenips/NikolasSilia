import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, ArrowLeft, Building2, Users } from 'lucide-react';
import { supabase, type Store, type Teacher } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import { formatQualifications } from '@/lib/teacherFields';
import { useAuth } from '@/lib/auth';
import { StudioFormModal } from '@/components/StudioFormModal';
import { TeacherFormModal } from '@/components/TeacherFormModal';
import { TeacherStatusBadge } from '@/components/TeacherStatusBadge';

type Props = {
  onBack: () => void;
};

export function StudioOwnerDashboard({ onBack }: Props) {
  const { user, signOut, ownedStoreId } = useAuth();
  const { t, tArea, tCat } = useI18n();
  const [store, setStore] = useState<Store | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStudioForm, setShowStudioForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!ownedStoreId) return;
    setLoading(true);
    setError(null);
    const [storeRes, teachersRes] = await Promise.all([
      supabase.from('stores').select('*').eq('id', ownedStoreId).maybeSingle(),
      supabase.from('teachers').select('*').eq('store_id', ownedStoreId).order('created_at', { ascending: true }),
    ]);
    if (storeRes.error || teachersRes.error) {
      setError(t('owner.loadError'));
    } else {
      setStore(storeRes.data as Store | null);
      setTeachers((teachersRes.data ?? []) as Teacher[]);
    }
    setLoading(false);
  }, [ownedStoreId, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showFlash = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(null), 3000);
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    if (!confirm(t('teachers.confirmDelete'))) return;
    const { data, error: deleteError } = await supabase.from('teachers').delete().eq('id', teacher.id).select('id');
    if (deleteError || !data || data.length === 0) {
      setError(t('teachers.saveError'));
      return;
    }
    setTeachers((prev) => prev.filter((x) => x.id !== teacher.id));
    showFlash(t('teachers.deleted'));
  };

  const closeTeacherForm = () => {
    setShowTeacherForm(false);
    setEditingTeacher(null);
  };

  const onTeacherSaved = () => {
    closeTeacherForm();
    fetchData();
    showFlash(t('teachers.saved'));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t('admin.backToSite')}
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-400 hidden sm:block">{user?.email}</span>
            <button
              onClick={signOut}
              className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm font-semibold text-stone-600 hover:border-rose-300 hover:text-rose-600 transition-colors"
            >
              {t('auth.signOut')}
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-stone-900 mb-1">{t('owner.title')}</h1>
        <p className="text-stone-500 text-sm mb-6">{t('owner.subtitle')}</p>

        {flash && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
            {flash}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : !store ? (
          <div className="text-center py-16 text-stone-400">
            <p className="text-sm">{t('owner.noStudio')}</p>
          </div>
        ) : (
          <div className="space-y-10">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 mb-3">{t('owner.studioSection')}</h2>
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0 bg-stone-100">
                  {store.image_url ? (
                    <img src={store.image_url} alt={store.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <Building2 className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2 bg-stone-100 text-stone-700">
                      {tCat(store.category)}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900">{store.name}</h3>
                    <p className="text-sm text-stone-500 mt-0.5">{tArea(store.area)} · {store.address}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => setShowStudioForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors"
                    >
                      <Pencil className="w-4 h-4" /> {t('owner.editStudio')}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                  {t('owner.teachersSection')} ({teachers.length})
                </h2>
                <button
                  onClick={() => { setEditingTeacher(null); setShowTeacherForm(true); }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors"
                >
                  <Plus className="w-4 h-4" /> {t('teachers.add')}
                </button>
              </div>

              {teachers.length === 0 ? (
                <div className="flex flex-col items-center text-center py-16 text-stone-400 bg-white rounded-2xl border border-dashed border-stone-300">
                  <Users className="w-8 h-8 mb-3" />
                  <p className="text-sm">{t('teachers.empty')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {teachers.map((teacher) => (
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
                          {teacher.academic_status && (
                            <p className="text-xs text-stone-600 mt-1 truncate">{formatQualifications(teacher.academic_status, t)}</p>
                          )}
                          <p className="text-xs text-stone-500 mt-0.5">
                            {t('teachers.experienceYears', { n: teacher.experience_years })} · {teacher.age_max !== null ? t('teachers.ageRange', { min: teacher.age_min, max: teacher.age_max }) : t('teachers.agePlus', { min: teacher.age_min })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <button
                            onClick={() => { setEditingTeacher(teacher); setShowTeacherForm(true); }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" /> {t('admin.edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(teacher)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> {t('admin.deleteClass')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {showStudioForm && store && (
        <StudioFormModal
          store={store}
          onClose={() => setShowStudioForm(false)}
          onSaved={() => {
            setShowStudioForm(false);
            fetchData();
            showFlash(t('admin.studioSaved'));
          }}
        />
      )}

      {showTeacherForm && ownedStoreId && (
        <TeacherFormModal
          teacher={editingTeacher}
          storeId={ownedStoreId}
          onClose={closeTeacherForm}
          onSaved={onTeacherSaved}
        />
      )}
    </div>
  );
}
