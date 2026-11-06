import { MapPin, Clock, Users, Euro, Calendar, ChevronRight } from 'lucide-react';
import type { ClassItem } from '@/lib/supabase';
import { CATEGORY_COLORS, CATEGORY_CB_BADGES } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';

type Props = {
  cls: ClassItem;
  onSelect: (cls: ClassItem) => void;
};

export function ClassCard({ cls, onSelect }: Props) {
  const { t, tCat, tArea } = useI18n();
  const categoryColor = CATEGORY_COLORS[cls.category] ?? 'bg-stone-100 text-stone-700';
  const ageLabel = cls.age_max
    ? `${cls.age_min}–${cls.age_max} ${t('card.yrs')}`
    : `${cls.age_min}${t('card.yrsPlus')}`;

  return (
    <button
      onClick={() => onSelect(cls)}
      className="group text-left bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-teal-200 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-stone-100">
        {cls.image_url ? (
          <img
            src={cls.image_url}
            alt={cls.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <Calendar className="w-10 h-10" />
          </div>
        )}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColor} ${CATEGORY_CB_BADGES[cls.category] ?? ''}`}
        >
          {tCat(cls.category)}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-stone-400 font-medium mb-1">{cls.store?.name}</p>
        <h3 className="text-base font-bold text-stone-900 mb-2 group-hover:text-teal-600 transition-colors">
          {cls.title}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-stone-500 mb-3">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {tArea(cls.store?.area ?? '')}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {ageLabel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {cls.duration_minutes} {t('card.min')}
          </span>
        </div>

        <p className="text-sm text-stone-600 line-clamp-2 mb-3 flex-1">
          {cls.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <div className="flex items-baseline gap-1">
            <Euro className="w-4 h-4 text-stone-400" />
            <span className="text-lg font-bold text-stone-900">
              {Number(cls.price_eur).toFixed(0)}
            </span>
            <span className="text-xs text-stone-400">{t('card.perSession')}</span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-teal-600 group-hover:gap-1.5 transition-all">
            {t('card.view')} <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </button>
  );
}
