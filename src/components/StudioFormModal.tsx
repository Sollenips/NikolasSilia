import { useState } from 'react';
import { Loader2, AlertCircle, X } from 'lucide-react';
import { supabase, type Store } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import { StudioFields } from '@/components/StudioFields';
import { EMPTY_STUDIO_VALUES, studioInputCls, studioLabelCls, type StudioFormValues } from '@/lib/studioForm';

type Props = {
  store: Store | null;
  showOwnerInvite?: boolean;
  onClose: () => void;
  onSaved: () => void;
};

const toFormValues = (store: Store | null): StudioFormValues =>
  store
    ? {
        name: store.name,
        description: store.description ?? '',
        category: store.category,
        area: store.area,
        address: store.address ?? '',
        phone: store.phone ?? '',
        email: store.email ?? '',
        image_url: store.image_url ?? '',
        photo_url_1: store.photo_url_1 ?? '',
        photo_url_2: store.photo_url_2 ?? '',
        floor: store.floor ?? '',
        disability_access: store.disability_access ?? false,
        rate_info: store.rate_info ?? '',
        first_class_discount_pct: store.first_class_discount_pct?.toString() ?? '0',
        weekly_schedule: store.weekly_schedule ?? '',
      }
    : EMPTY_STUDIO_VALUES;

export function StudioFormModal({ store, showOwnerInvite = false, onClose, onSaved }: Props) {
  const { t } = useI18n();
  const [form, setForm] = useState<StudioFormValues>(() => toFormValues(store));
  const [ownerEmail, setOwnerEmail] = useState('');
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
      image_url: form.image_url || null,
      photo_url_1: form.photo_url_1 || null,
      photo_url_2: form.photo_url_2 || null,
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

    const invitedEmail = ownerEmail.trim().toLowerCase();
    if (showOwnerInvite && store && invitedEmail) {
      const inviteRes = await supabase
        .from('studio_owner_invites')
        .upsert({ email: invitedEmail, store_id: store.id }, { onConflict: 'email' });
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
          <StudioFields values={form} onChange={setForm} />

          {showOwnerInvite && store && (
            <div>
              <label className={studioLabelCls}>{t('form.ownerEmail')}</label>
              <input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="owner@example.com"
                className={studioInputCls}
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
