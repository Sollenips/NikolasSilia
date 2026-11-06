import { useState } from 'react';
import { Loader2, AlertCircle, X, Accessibility } from 'lucide-react';
import { supabase, type Store } from '@/lib/supabase';
import { CATEGORIES, AREAS } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';

type Props = {
  store: Store | null;
  showOwnerInvite?: boolean;
  onClose: () => void;
  onSaved: () => void;
};

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder:text-stone-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all text-sm';
const labelCls = 'block text-sm font-medium text-stone-700 mb-1.5';

export function StudioFormModal({ store, showOwnerInvite = false, onClose, onSaved }: Props) {
  const { t, tCat } = useI18n();
  const [form, setForm] = useState({
    name: store?.name ?? '',
    description: store?.description ?? '',
    category: store?.category ?? 'Martial Arts',
    area: store?.area ?? AREAS[0],
    address: store?.address ?? '',
    phone: store?.phone ?? '',
    email: store?.email ?? '',
    image_url: store?.image_url ?? '',
    photo_url_1: store?.photo_url_1 ?? '',
    photo_url_2: store?.photo_url_2 ?? '',
    floor: store?.floor ?? '',
    disability_access: store?.disability_access ?? false,
    rate_info: store?.rate_info ?? '',
    first_class_discount_pct: store?.first_class_discount_pct?.toString() ?? '0',
    weekly_schedule: store?.weekly_schedule ?? '',
    owner_email: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      area: form.area,
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      image_url: form.image_url.trim() || null,
      photo_url_1: form.photo_url_1.trim() || null,
      photo_url_2: form.photo_url_2.trim() || null,
      floor: form.floor.trim() || null,
      disability_access: form.disability_access,
      rate_info: form.rate_info.trim() || null,
      first_class_discount_pct: parseInt(form.first_class_discount_pct, 10) || 0,
      weekly_schedule: form.weekly_schedule.trim() || null,
    };

    let res;
    if (store) {
      res = await supabase.from('stores').update(payload).eq('id', store.id);
    } else {
      res = await supabase.from('stores').insert([payload]);
    }

    if (res.error) {
      setError(t('admin.errorSave'));
      setSaving(false);
      return;
    }

    const ownerEmail = form.owner_email.trim().toLowerCase();
    if (showOwnerInvite && store && ownerEmail) {
      const inviteRes = await supabase
        .from('studio_owner_invites')
        .upsert({ email: ownerEmail, store_id: store.id }, { onConflict: 'email' });
      if (inviteRes.error) {
        setError(t('admin.errorSave'));
        setSaving(false);
        return;
      }
    }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-stone-900">
            {store ? t('admin.editStudio') : t('admin.addStudio')}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className={labelCls}>{t('form.studioName')}</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>{t('form.studioDescription')}</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className={`${inputCls} resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t('form.studioCategory')}</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{tCat(cat)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t('form.area')}</label>
              <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className={inputCls}>
                {AREAS.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>{t('form.address')}</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t('form.phone')}</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t('form.email')}</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>{t('form.coverImage')}</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t('form.photo1')}</label>
              <input value={form.photo_url_1} onChange={(e) => setForm({ ...form, photo_url_1: e.target.value })} placeholder="https://..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t('form.photo2')}</label>
              <input value={form.photo_url_2} onChange={(e) => setForm({ ...form, photo_url_2: e.target.value })} placeholder="https://..." className={inputCls} />
            </div>
          </div>

          {(form.photo_url_1 || form.photo_url_2) && (
            <div className="grid grid-cols-2 gap-3">
              {form.photo_url_1 && (
                <div className="h-28 rounded-lg overflow-hidden bg-stone-100">
                  <img src={form.photo_url_1} alt="Photo 1" className="w-full h-full object-cover" />
                </div>
              )}
              {form.photo_url_2 && (
                <div className="h-28 rounded-lg overflow-hidden bg-stone-100">
                  <img src={form.photo_url_2} alt="Photo 2" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t('form.floor')}</label>
              <input value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} placeholder={t('form.floorPh')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t('form.firstClassDiscount')}</label>
              <input type="number" value={form.first_class_discount_pct} onChange={(e) => setForm({ ...form, first_class_discount_pct: e.target.value })} min={0} max={100} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2.5 cursor-pointer select-none p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-teal-300 transition-colors">
              <input
                type="checkbox"
                checked={form.disability_access}
                onChange={(e) => setForm({ ...form, disability_access: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-400"
              />
              <Accessibility className="w-4 h-4 text-stone-400" />
              <span className="text-sm font-medium text-stone-700">{t('form.disabilityAccess')}</span>
            </label>
          </div>

          <div>
            <label className={labelCls}>{t('form.rateInfo')}</label>
            <input value={form.rate_info} onChange={(e) => setForm({ ...form, rate_info: e.target.value })} placeholder={t('form.rateInfoPh')} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>{t('form.studioSchedule')}</label>
            <input value={form.weekly_schedule} onChange={(e) => setForm({ ...form, weekly_schedule: e.target.value })} placeholder={t('form.studioSchedulePh')} className={inputCls} />
          </div>

          {showOwnerInvite && store && (
            <div>
              <label className={labelCls}>{t('form.ownerEmail')}</label>
              <input
                type="email"
                value={form.owner_email}
                onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
                placeholder="owner@example.com"
                className={inputCls}
              />
              <p className="text-xs text-stone-400 mt-1.5">{t('form.ownerEmailHelp')}</p>
            </div>
          )}

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
