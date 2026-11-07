import { Search, Layers, CalendarCheck, BadgeCheck } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const STEPS = [
  { icon: Search, title: 'how.s1.title', desc: 'how.s1.desc' },
  { icon: Layers, title: 'how.s2.title', desc: 'how.s2.desc' },
  { icon: CalendarCheck, title: 'how.s3.title', desc: 'how.s3.desc' },
] as const;

export function HowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-stone-900 mb-2">{t('how.title')}</h2>
        <p className="text-stone-500">{t('how.subtitle')}</p>
      </div>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-3xl font-extrabold text-stone-300" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1.5">{t(step.title)}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{t(step.desc)}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
