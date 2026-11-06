import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, ArrowLeft, AlertCircle, X, Accessibility } from 'lucide-react';
import { supabase, type ClassItem, type Store, type Booking } from '@/lib/supabase';
import { CATEGORIES, CATEGORY_COLORS } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { StudioFormModal } from '@/components/StudioFormModal';
import { AdminTeachersTab } from '@/components/AdminTeachersTab';

type Props = {
  onBack: () => void;
};

export function AdminDashboard({ onBack }: Props) {
  const { user, signOut } = useAuth();
  const { t, tCat } = useI18n();
  const [tab, setTab] = useState<'classes' | 'bookings' | 'studios' | 'teachers'>('classes');
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [showClassForm, setShowClassForm] = useState(false);
  const [showStudioForm, setShowStudioForm] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [classesRes, bookingsRes, storesRes] = await Promise.all([
      supabase.from('classes').select('*, store:stores(*)').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('stores').select('*').order('created_at', { ascending: true }),
    ]);
    if (classesRes.data) setClasses(classesRes.data as ClassItem[]);
    if (bookingsRes.data) setBookings(bookingsRes.data as Booking[]);
    if (storesRes.data) setStores(storesRes.data as Store[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showFlash = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(null), 3000);
  };

  const handleDeleteClass = async (cls: ClassItem) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    const { error } = await supabase.from('classes').delete().eq('id', cls.id);
    if (error) {
      alert(t('admin.errorSave'));
      return;
    }
    setClasses((prev) => prev.filter((c) => c.id !== cls.id));
    showFlash(t('admin.deleted'));
  };

  const handleDeleteStore = async (store: Store) => {
    if (!confirm(t('admin.confirmDeleteStudio'))) return;
    const { error } = await supabase.from('stores').delete().eq('id', store.id);
    if (error) {
      alert(t('admin.errorSave'));
      return;
    }
    setStores((prev) => prev.filter((s) => s.id !== store.id));
    setClasses((prev) => prev.filter((c) => c.store_id !== store.id));
    showFlash(t('admin.studioDeleted'));
  };

  const handleSaveClass = () => {
    setShowClassForm(false);
    setEditingClass(null);
    fetchData();
    showFlash(t('admin.saved'));
  };

  const handleSaveStore = () => {
    setShowStudioForm(false);
    setEditingStore(null);
    fetchData();
    showFlash(t('admin.studioSaved'));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header row */}
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

        <h1 className="text-2xl font-bold text-stone-900 mb-1">{t('admin.title')}</h1>
        <p className="text-stone-500 text-sm mb-6">{t('admin.subtitle')}</p>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-stone-200 overflow-x-auto">
          <button
            onClick={() => setTab('classes')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              tab === 'classes'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {t('admin.classes')} ({classes.length})
          </button>
          <button
            onClick={() => setTab('studios')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              tab === 'studios'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {t('admin.studios')} ({stores.length})
          </button>
          <button
            onClick={() => setTab('teachers')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              tab === 'teachers'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {t('admin.teachers')}
          </button>
          <button
            onClick={() => setTab('bookings')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              tab === 'bookings'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {t('admin.bookings')} ({bookings.length})
          </button>
        </div>

        {flash && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
            {flash}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : tab === 'classes' ? (
          <ClassesTab
            classes={classes}
            onAdd={() => { setEditingClass(null); setShowClassForm(true); }}
            onEdit={(cls) => { setEditingClass(cls); setShowClassForm(true); }}
            onDelete={handleDeleteClass}
            tCat={tCat}
          />
        ) : tab === 'studios' ? (
          <StudiosTab
            stores={stores}
            classes={classes}
            onAdd={() => { setEditingStore(null); setShowStudioForm(true); }}
            onEdit={(store) => { setEditingStore(store); setShowStudioForm(true); }}
            onDelete={handleDeleteStore}
            tCat={tCat}
          />
        ) : tab === 'teachers' ? (
          <AdminTeachersTab />
        ) : (
          <BookingsTab bookings={bookings} classes={classes} />
        )}
      </div>

      {showClassForm && (
        <ClassFormModal
          cls={editingClass}
          stores={stores}
          onClose={() => { setShowClassForm(false); setEditingClass(null); }}
          onSaved={handleSaveClass}
        />
      )}

      {showStudioForm && (
        <StudioFormModal
          store={editingStore}
          showOwnerInvite
          onClose={() => { setShowStudioForm(false); setEditingStore(null); }}
          onSaved={handleSaveStore}
        />
      )}
    </div>
  );
}

function ClassesTab({
  classes,
  onAdd,
  onEdit,
  onDelete,
  tCat,
}: {
  classes: ClassItem[];
  onAdd: () => void;
  onEdit: (cls: ClassItem) => void;
  onDelete: (cls: ClassItem) => void;
  tCat: (cat: string) => string;
}) {
  const { t } = useI18n();

  return (
    <div>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors mb-4"
      >
        <Plus className="w-4 h-4" /> {t('admin.addClass')}
      </button>

      {classes.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="text-sm">{t('admin.noClasses')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {classes.map((cls) => {
            const color = CATEGORY_COLORS[cls.category] ?? 'bg-stone-100 text-stone-700';
            return (
              <div key={cls.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex">
                <div className="w-24 h-24 flex-shrink-0 bg-stone-100">
                  {cls.image_url ? (
                    <img src={cls.image_url} alt={cls.title} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 p-3.5 flex flex-col justify-between">
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1 ${color}`}>
                      {tCat(cls.category)}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 leading-tight">{cls.title}</h3>
                    <p className="text-xs text-stone-400 mt-0.5">{cls.store?.name}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <button
                      onClick={() => onEdit(cls)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" /> {t('admin.edit')}
                    </button>
                    <button
                      onClick={() => onDelete(cls)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> {t('admin.deleteClass')}
                    </button>
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

function StudiosTab({
  stores,
  classes,
  onAdd,
  onEdit,
  onDelete,
  tCat,
}: {
  stores: Store[];
  classes: ClassItem[];
  onAdd: () => void;
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
  tCat: (cat: string) => string;
}) {
  const { t, tArea } = useI18n();
  const classCount = new Map(classes.map((c) => [c.store_id, 0]));
  for (const c of classes) {
    classCount.set(c.store_id, (classCount.get(c.store_id) ?? 0) + 1);
  }

  return (
    <div>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors mb-4"
      >
        <Plus className="w-4 h-4" /> {t('admin.addStudio')}
      </button>

      {stores.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="text-sm">{t('admin.noStudios')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex">
              <div className="w-24 h-24 flex-shrink-0 bg-stone-100">
                {store.image_url ? (
                  <img src={store.image_url} alt={store.name} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 p-3.5 flex flex-col justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1 bg-stone-100 text-stone-700">
                    {tCat(store.category)}
                  </span>
                  <h3 className="text-sm font-bold text-stone-900 leading-tight">{store.name}</h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {tArea(store.area)} · {classCount.get(store.id) ?? 0} {t('admin.classes').toLowerCase()}
                  </p>
                  {store.disability_access && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-emerald-600">
                      <Accessibility className="w-3 h-3" /> {t('detail.accessible')}
                    </span>
                  )}
                  {store.first_class_discount_pct > 0 && (
                    <span className="inline-flex items-center gap-1 ml-2 mt-1 text-xs text-emerald-600">
                      {t('detail.firstClassDiscount', { pct: store.first_class_discount_pct })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <button
                    onClick={() => onEdit(store)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> {t('admin.edit')}
                  </button>
                  <button
                    onClick={() => onDelete(store)}
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
    </div>
  );
}

function BookingsTab({
  bookings,
  classes,
}: {
  bookings: Booking[];
  classes: ClassItem[];
}) {
  const { t } = useI18n();
  const classMap = new Map(classes.map((c) => [c.id, c]));

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 text-stone-400">
        <p className="text-sm">{t('admin.noBookings')}</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wide">
            <th className="text-left py-2 px-3 font-semibold">{t('admin.participant')}</th>
            <th className="text-left py-2 px-3 font-semibold">{t('admin.age')}</th>
            <th className="text-left py-2 px-3 font-semibold">{t('admin.booker')}</th>
            <th className="text-left py-2 px-3 font-semibold hidden sm:table-cell">{t('admin.date')}</th>
            <th className="text-left py-2 px-3 font-semibold">{t('admin.status')}</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const cls = classMap.get(b.class_id);
            const statusKey = `booking.status.${b.status}`;
            return (
              <tr key={b.id} className="border-b border-stone-100 hover:bg-stone-50">
                <td className="py-2.5 px-3">
                  <div className="font-medium text-stone-800">{b.participant_name}</div>
                  {cls && <div className="text-xs text-stone-400">{cls.title}</div>}
                </td>
                <td className="py-2.5 px-3 text-stone-600">{b.participant_age}</td>
                <td className="py-2.5 px-3">
                  <div className="text-stone-700">{b.booker_name}</div>
                  <div className="text-xs text-stone-400">{b.booker_email}</div>
                  <div className="text-xs text-stone-400">{b.booker_phone}</div>
                </td>
                <td className="py-2.5 px-3 text-stone-600 hidden sm:table-cell">{b.preferred_date}</td>
                <td className="py-2.5 px-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[b.status] ?? 'bg-stone-100 text-stone-600'}`}>
                    {t(statusKey)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ClassFormModal({
  cls,
  stores,
  onClose,
  onSaved,
}: {
  cls: ClassItem | null;
  stores: Store[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t, tCat } = useI18n();
  const [form, setForm] = useState({
    store_id: cls?.store_id ?? stores[0]?.id ?? '',
    title: cls?.title ?? '',
    description: cls?.description ?? '',
    category: cls?.category ?? 'Basketball',
    instructor: cls?.instructor ?? '',
    age_min: cls?.age_min?.toString() ?? '6',
    age_max: cls?.age_max?.toString() ?? '',
    price_eur: cls?.price_eur?.toString() ?? '20',
    duration_minutes: cls?.duration_minutes?.toString() ?? '60',
    capacity: cls?.capacity?.toString() ?? '12',
    weekly_schedule: cls?.weekly_schedule ?? '',
    image_url: cls?.image_url ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      store_id: form.store_id,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      instructor: form.instructor.trim(),
      age_min: parseInt(form.age_min, 10) || 4,
      age_max: form.age_max ? parseInt(form.age_max, 10) : null,
      price_eur: parseFloat(form.price_eur) || 0,
      duration_minutes: parseInt(form.duration_minutes, 10) || 60,
      capacity: parseInt(form.capacity, 10) || 10,
      weekly_schedule: form.weekly_schedule.trim(),
      image_url: form.image_url.trim() || null,
    };

    let res;
    if (cls) {
      res = await supabase.from('classes').update(payload).eq('id', cls.id);
    } else {
      res = await supabase.from('classes').insert([payload]);
    }

    if (res.error) {
      setError(t('admin.errorSave'));
      setSaving(false);
      return;
    }
    onSaved();
  };

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder:text-stone-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all text-sm';
  const labelCls = 'block text-sm font-medium text-stone-700 mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-stone-900">
            {cls ? t('admin.editClass') : t('admin.addClass')}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Store selector */}
          <div>
            <label className={labelCls}>{t('form.category')}</label>
            <select
              value={form.store_id}
              onChange={(e) => setForm({ ...form, store_id: e.target.value })}
              required
              className={inputCls}
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.area}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>{t('form.title')}</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>{t('form.description')}</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className={`${inputCls} resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t('form.category')}</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{tCat(cat)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t('form.instructor')}</label>
              <input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} required className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t('form.ageMin')}</label>
              <input type="number" value={form.age_min} onChange={(e) => setForm({ ...form, age_min: e.target.value })} required min={0} max={120} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t('form.ageMax')}</label>
              <input type="number" value={form.age_max} onChange={(e) => setForm({ ...form, age_max: e.target.value })} min={0} max={120} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t('form.price')}</label>
              <input type="number" step="0.01" value={form.price_eur} onChange={(e) => setForm({ ...form, price_eur: e.target.value })} required min={0} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t('form.duration')}</label>
              <input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} required min={1} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t('form.capacity')}</label>
              <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required min={1} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t('form.schedule')}</label>
              <input value={form.weekly_schedule} onChange={(e) => setForm({ ...form, weekly_schedule: e.target.value })} required placeholder="Mon & Wed 17:00" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>{t('form.imageUrl')}</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className={inputCls} />
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('form.save')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-stone-200 text-stone-600 font-semibold text-sm hover:bg-stone-50 transition-colors"
            >
              {t('form.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
