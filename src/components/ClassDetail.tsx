import { ArrowLeft, MapPin, Phone, Mail, Clock, Users, Euro, Calendar, User, Accessibility, Building2, Tag, ImageIcon } from 'lucide-react';
import type { ClassItem } from '@/lib/supabase';
import { CATEGORY_COLORS, CATEGORY_CB_BADGES } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';
import { TeamSection } from '@/components/TeamSection';

type Props = {
  cls: ClassItem;
  onBack: () => void;
  onBook: (cls: ClassItem) => void;
};

export function ClassDetail({ cls, onBack, onBook }: Props) {
  const { t, tCat, tArea } = useI18n();
  const store = cls.store;
  const categoryColor = CATEGORY_COLORS[cls.category] ?? 'bg-stone-100 text-stone-700';
  const ageLabel = cls.age_max
    ? `${cls.age_min}–${cls.age_max} ${t('detail.years')}`
    : `${cls.age_min}${t('detail.yearsPlus')}`;

  const photos = [store?.photo_url_1, store?.photo_url_2].filter(Boolean) as string[];
  const hasDiscount = (store?.first_class_discount_pct ?? 0) > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-teal-600 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> {t('detail.back')}
      </button>

      {/* Hero image */}
      <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden bg-stone-100 mb-6">
        {cls.image_url ? (
          <img
            src={cls.image_url}
            alt={cls.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <Calendar className="w-12 h-12" />
          </div>
        )}
        <span
          className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-semibold ${categoryColor} ${CATEGORY_CB_BADGES[cls.category] ?? ''}`}
        >
          {tCat(cls.category)}
        </span>
        {hasDiscount && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-500 text-white shadow-lg">
            <Tag className="w-3.5 h-3.5" />
            {t('detail.firstClassDiscount', { pct: store?.first_class_discount_pct ?? 0 })}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2">
          <p className="text-sm text-stone-500 font-medium mb-1">{store?.name}</p>
          <h1 className="text-3xl font-bold text-stone-900 mb-4">{cls.title}</h1>

          <p className="text-stone-600 leading-relaxed mb-6">{cls.description}</p>

          {/* Key info grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <InfoCard icon={User} label={t('detail.instructor')} value={cls.instructor} />
            <InfoCard icon={Users} label={t('detail.ageRange')} value={ageLabel} />
            <InfoCard icon={Clock} label={t('detail.duration')} value={`${cls.duration_minutes} ${t('detail.minutes')}`} />
            <InfoCard icon={Users} label={t('detail.classSize')} value={`${t('detail.upTo')} ${cls.capacity}`} />
            <InfoCard icon={Calendar} label={t('detail.schedule')} value={cls.weekly_schedule} />
            <InfoCard icon={Euro} label={t('detail.price')} value={`€${Number(cls.price_eur).toFixed(0)} ${t('detail.perSession')}`} />
          </div>

          {/* Studio info */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-6">
            <h3 className="text-lg font-bold text-stone-900 mb-3">{t('detail.aboutStudio')}</h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-4">{store?.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-stone-600">
                <MapPin className="w-4 h-4 text-stone-400" /> {store?.address}
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Phone className="w-4 h-4 text-stone-400" /> {store?.phone}
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Mail className="w-4 h-4 text-stone-400" /> {store?.email}
              </div>
            </div>
          </div>

          {/* Studio photos */}
          {photos.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-stone-400" />
                {t('detail.studioPhotos')}
              </h3>
              <div className={`grid gap-4 ${photos.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                {photos.map((url, i) => (
                  <div key={i} className="h-48 rounded-xl overflow-hidden bg-stone-100">
                    <img src={url} alt={`${store?.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <TeamSection storeId={cls.store_id} />

          {/* Studio details: floor, accessibility, rates, schedule */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <h3 className="text-lg font-bold text-stone-900 mb-4">{t('detail.studioDetails')}</h3>
            <div className="space-y-3">
              {store?.floor && (
                <DetailRow icon={Building2} label={t('detail.floor')} value={store.floor} />
              )}
              <DetailRow
                icon={Accessibility}
                label={t('detail.disabilityAccess')}
                value={store?.disability_access ? t('detail.accessible') : t('detail.notAccessible')}
                valueColor={store?.disability_access ? 'text-emerald-600' : 'text-stone-500'}
              />
              {store?.rate_info && (
                <DetailRow icon={Euro} label={t('detail.rates')} value={store.rate_info} />
              )}
              {store?.weekly_schedule && (
                <DetailRow icon={Calendar} label={t('detail.studioSchedule')} value={store.weekly_schedule} />
              )}
            </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 lg:sticky lg:top-24">
            <div className="mb-4">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-stone-900">
                  €{Number(cls.price_eur).toFixed(0)}
                </span>
                <span className="text-stone-400">{t('detail.perSessionSidebar')}</span>
              </div>
              {hasDiscount && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <Tag className="w-3 h-3" />
                  {t('detail.firstClassDiscount', { pct: store?.first_class_discount_pct ?? 0 })}
                </div>
              )}
              <p className="text-sm text-stone-500 mt-2">{cls.weekly_schedule}</p>
            </div>

            <div className="space-y-2 mb-4 text-sm text-stone-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-400" /> {tArea(store?.area ?? '')}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-stone-400" /> {ageLabel}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-stone-400" /> {cls.instructor}
              </div>
              {store?.disability_access && (
                <div className="flex items-center gap-2 text-emerald-600">
                  <Accessibility className="w-4 h-4" /> {t('detail.accessible')}
                </div>
              )}
            </div>

            <button
              onClick={() => onBook(cls)}
              className="w-full py-3.5 rounded-xl bg-teal-600 text-white font-semibold text-base hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm"
            >
              {t('detail.bookClass')}
            </button>
            <p className="text-xs text-stone-400 text-center mt-3">
              {t('detail.noPayment')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-100">
      <div className="flex items-center gap-1.5 text-stone-400 text-xs font-medium uppercase tracking-wide mb-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className="text-sm font-semibold text-stone-800">{value}</p>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-medium ${valueColor ?? 'text-stone-800'}`}>{value}</p>
      </div>
    </div>
  );
}
