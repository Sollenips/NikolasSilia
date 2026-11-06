import { CheckCircle2, Calendar, Home } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

type Props = {
  className: string;
  onBack: () => void;
};

export function BookingSuccess({ className, onBack }: Props) {
  const { t } = useI18n();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden text-center">
        <div className="bg-teal-50 px-6 pt-12 pb-8">
          <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-12 h-12 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">{t('success.title')}</h1>
          <p className="text-stone-600 max-w-md mx-auto">
            {t('success.desc')} <span className="font-semibold text-stone-800">{className}</span>{' '}
            {t('success.toStudio')}
          </p>
        </div>

        <div className="p-6">
          <div className="bg-stone-50 rounded-xl p-4 mb-6 flex items-start gap-3 text-left">
            <Calendar className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-stone-800">{t('success.nextSteps')}</p>
              <ul className="text-sm text-stone-500 mt-1 space-y-0.5">
                <li>{t('success.step1')}</li>
                <li>{t('success.step2')}</li>
                <li>{t('success.step3')}</li>
              </ul>
            </div>
          </div>

          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors"
          >
            <Home className="w-4 h-4" /> {t('success.back')}
          </button>
        </div>
      </div>
    </div>
  );
}
