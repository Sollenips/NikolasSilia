import { CalendarCheck, MapPin, Store } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { AREAS } from '@/lib/constants';

type Props = {
  onListStudio: () => void;
};

export function Footer({ onListStudio }: Props) {
  const { t, tArea } = useI18n();

  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <CalendarCheck className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Book<span className="text-teal-400">{t('nav.yourClass')}</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
              {t('footer.areasCover')}
            </h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {AREAS.map((area) => (
                <li key={area} className="flex items-center gap-1.5 text-stone-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> {tArea(area)}
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-stone-800 mt-8 pt-6">
          <button
            onClick={onListStudio}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors mb-4"
          >
            <Store className="w-4 h-4" />
            {t('listing.cta')}
          </button>
          <p className="text-sm text-stone-500 text-center">
            {t('footer.madeFor')}
          </p>
          <p className="text-xs text-stone-600 text-center mt-2">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
