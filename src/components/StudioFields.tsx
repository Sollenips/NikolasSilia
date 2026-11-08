import { Accessibility } from 'lucide-react';
import { CATEGORIES, AREAS } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';
import { ImageUploadField } from '@/components/ImageUploadField';
import { studioInputCls, studioLabelCls, type StudioFormValues } from '@/lib/studioForm';

type TextField = Exclude<
  keyof StudioFormValues,
  'disability_access' | 'image_url' | 'photo_url_1' | 'photo_url_2'
>;

type Props = {
  values: StudioFormValues;
  onChange: (next: StudioFormValues) => void;
};

export function StudioFields({ values, onChange }: Props) {
  const { t, tCat, tArea } = useI18n();

  const set = <K extends keyof StudioFormValues>(field: K) => (value: StudioFormValues[K]) =>
    onChange({ ...values, [field]: value });
  const textOf = (field: TextField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    onChange({ ...values, [field]: e.target.value });

  return (
    <div className="space-y-4">
      <div>
        <label className={studioLabelCls}>{t('form.studioName')}</label>
        <input value={values.name} onChange={textOf('name')} required className={studioInputCls} />
      </div>

      <div>
        <label className={studioLabelCls}>{t('form.studioDescription')}</label>
        <textarea value={values.description} onChange={textOf('description')} required rows={3} className={`${studioInputCls} resize-none`} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={studioLabelCls}>{t('form.studioCategory')}</label>
          <select value={values.category} onChange={textOf('category')} className={studioInputCls}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{tCat(cat)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={studioLabelCls}>{t('form.area')}</label>
          <select value={values.area} onChange={textOf('area')} required className={studioInputCls}>
            <option value="" disabled>{t('listing.areaPh')}</option>
            {AREAS.map((area) => (
              <option key={area} value={area}>{tArea(area)}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={studioLabelCls}>{t('form.address')}</label>
        <input value={values.address} onChange={textOf('address')} required className={studioInputCls} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={studioLabelCls}>{t('form.phone')}</label>
          <input type="tel" value={values.phone} onChange={textOf('phone')} required className={studioInputCls} />
        </div>
        <div>
          <label className={studioLabelCls}>{t('form.email')}</label>
          <input type="email" value={values.email} onChange={textOf('email')} required className={studioInputCls} />
        </div>
      </div>

      <div>
        <label className={studioLabelCls}>{t('form.coverImage')}</label>
        <ImageUploadField value={values.image_url} onChange={set('image_url')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={studioLabelCls}>{t('form.photo1')}</label>
          <ImageUploadField value={values.photo_url_1} onChange={set('photo_url_1')} />
        </div>
        <div>
          <label className={studioLabelCls}>{t('form.photo2')}</label>
          <ImageUploadField value={values.photo_url_2} onChange={set('photo_url_2')} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={studioLabelCls}>{t('form.floor')}</label>
          <input value={values.floor} onChange={textOf('floor')} placeholder={t('form.floorPh')} className={studioInputCls} />
        </div>
        <div>
          <label className={studioLabelCls}>{t('form.firstClassDiscount')}</label>
          <input type="number" value={values.first_class_discount_pct} onChange={textOf('first_class_discount_pct')} min={0} max={100} className={studioInputCls} />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2.5 cursor-pointer select-none p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-teal-300 transition-colors">
          <input
            type="checkbox"
            checked={values.disability_access}
            onChange={(e) => set('disability_access')(e.target.checked)}
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-400"
          />
          <Accessibility className="w-4 h-4 text-stone-400" />
          <span className="text-sm font-medium text-stone-700">{t('form.disabilityAccess')}</span>
        </label>
      </div>

      <div>
        <label className={studioLabelCls}>{t('form.rateInfo')}</label>
        <input value={values.rate_info} onChange={textOf('rate_info')} placeholder={t('form.rateInfoPh')} className={studioInputCls} />
      </div>

      <div>
        <label className={studioLabelCls}>{t('form.studioSchedule')}</label>
        <input value={values.weekly_schedule} onChange={textOf('weekly_schedule')} placeholder={t('form.studioSchedulePh')} className={studioInputCls} />
      </div>
    </div>
  );
}
