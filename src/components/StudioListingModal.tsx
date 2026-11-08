import { useState } from 'react';
import { X, Check, Store, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import { StudioFields } from '@/components/StudioFields';
import { EMPTY_STUDIO_VALUES, type StudioFormValues } from '@/lib/studioForm';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function StudioListingModal({ open, onClose }: Props) {
  const { t } = useI18n();
  const [form, setForm] = useState<StudioFormValues>(EMPTY_STUDIO_VALUES);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const { error } = await supabase.from('pre_registrations').insert([
      {
        email: form.email.trim().toLowerCase(),
        role: 'store',
        name: form.name.trim(),
        phone: form.phone.trim(),
        area: form.area,
        description: form.description.trim(),
        category: form.category,
        address: form.address.trim(),
        image_url: form.image_url || null,
        photo_url_1: form.photo_url_1 || null,
        photo_url_2: form.photo_url_2 || null,
        floor: form.floor.trim() || null,
        disability_access: form.disability_access,
        rate_info: form.rate_info.trim() || null,
        first_class_discount_pct: parseInt(form.first_class_discount_pct, 10) || 0,
        weekly_schedule: form.weekly_schedule.trim() || null,
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
    setForm(EMPTY_STUDIO_VALUES);
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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
            <StudioFields values={form} onChange={setForm} />

            {status === 'error' && (
              <p className="text-sm text-rose-600 font-medium">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3.5 rounded-xl bg-teal-600 text-white font-semibold text-base hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'submitting' && <Loader2 className="w-4 h-4 animate-spin" />}
              {status === 'submitting' ? t('listing.submitting') : t('listing.submit')}
            </button>

            <p className="text-xs text-stone-400 text-center">{t('listing.privacy')}</p>
          </form>
        )}
      </div>
    </div>
  );
}
