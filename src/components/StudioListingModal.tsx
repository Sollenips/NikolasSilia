import { useState } from 'react';
import { X, Check, Store } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import { AREAS } from '@/lib/constants';

type Props = {
  open: boolean;
  onClose: () => void;
};

type ListingForm = {
  studioName: string;
  email: string;
  phone: string;
  area: string;
  studioInfo: string;
};

const EMPTY_FORM: ListingForm = { studioName: '', email: '', phone: '', area: '', studioInfo: '' };

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 placeholder:text-stone-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all';
const LABEL_CLASS = 'block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2';

export function StudioListingModal({ open, onClose }: Props) {
  const { t, tArea } = useI18n();
  const [form, setForm] = useState<ListingForm>(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!open) return null;

  const updateField = (field: keyof ListingForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((current) => ({ ...current, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const { error } = await supabase.from('pre_registrations').insert([
      {
        email: form.email.trim().toLowerCase(),
        role: 'store',
        name: form.studioName.trim(),
        phone: form.phone.trim(),
        area: form.area,
        studio_info: form.studioInfo.trim(),
      },
    ]);

    if (error) {
      setErrorMsg(error.code === '23505' ? t('listing.duplicate') : t('listing.error'));
      setStatus('error');
      return;
    }

    setStatus('success');
  };

  const handleClose = () => {
    setStatus('idle');
    setForm(EMPTY_FORM);
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 px-6 py-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label={t('listing.close')}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">{t('listing.title')}</h2>
          </div>
          <p className="text-teal-50/90 text-sm leading-relaxed">{t('listing.desc')}</p>
        </div>

        {status === 'success' ? (
          <div className="px-6 py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">{t('listing.successTitle')}</h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">{t('listing.successDesc')}</p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors"
            >
              {t('listing.close')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            <div>
              <label className={LABEL_CLASS}>{t('listing.studioName')}</label>
              <input
                type="text"
                required
                value={form.studioName}
                onChange={updateField('studioName')}
                placeholder={t('listing.studioNamePh')}
                className={INPUT_CLASS}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>{t('listing.email')}</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={updateField('email')}
                  placeholder="you@example.com"
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>{t('listing.phone')}</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={updateField('phone')}
                  placeholder={t('listing.phonePh')}
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div>
              <label className={LABEL_CLASS}>{t('listing.area')}</label>
              <select
                required
                value={form.area}
                onChange={updateField('area')}
                className={`${INPUT_CLASS} bg-white`}
              >
                <option value="" disabled>
                  {t('listing.areaPh')}
                </option>
                {AREAS.map((area) => (
                  <option key={area} value={area}>
                    {tArea(area)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={LABEL_CLASS}>{t('listing.info')}</label>
              <textarea
                required
                rows={4}
                value={form.studioInfo}
                onChange={updateField('studioInfo')}
                placeholder={t('listing.infoPh')}
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-rose-600 font-medium">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3.5 rounded-xl bg-teal-600 text-white font-semibold text-base hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? t('listing.submitting') : t('listing.submit')}
            </button>

            <p className="text-xs text-stone-400 text-center">{t('listing.privacy')}</p>
          </form>
        )}
      </div>
    </div>
  );
}
