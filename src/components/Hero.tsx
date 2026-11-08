import { useState } from 'react';
import { Search, MapPin, Sparkles, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { AREAS, CATEGORIES } from '@/lib/constants';

type Props = {
  onSearch: (value: string) => void;
  searchValue: string;
  filterArea: string;
  setFilterArea: (v: string) => void;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  filterAge: string;
  setFilterAge: (v: string) => void;
  activeFilterCount: number;
  onClear: () => void;
};

export function Hero({
  onSearch,
  searchValue,
  filterArea,
  setFilterArea,
  filterCategory,
  setFilterCategory,
  filterAge,
  setFilterAge,
  activeFilterCount,
  onClear,
}: Props) {
  const { t, tArea, tCat } = useI18n();
  const [showAllAreas, setShowAllAreas] = useState(false);
  const visibleAreas = showAllAreas ? AREAS : AREAS.slice(0, 6);

  const AGE_OPTIONS = [
    { value: 'all', label: t('filter.allAges') },
    { value: '4', label: t('filter.age.4-6') },
    { value: '7', label: t('filter.age.7-9') },
    { value: '10', label: t('filter.age.10-12') },
    { value: '13', label: t('filter.age.13-17') },
    { value: '18', label: t('filter.age.18plus') },
  ];

  const selectClass =
    'w-full appearance-none px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm font-medium text-stone-800 outline-none transition-all hover:border-teal-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 cursor-pointer';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            {t('hero.badge', { count: AREAS.length })}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-4">
            {t('hero.title1')}
            <span className="block text-teal-100">{t('hero.title2')}</span>
          </h1>

          <p className="text-lg text-teal-50/90 mb-8 max-w-xl leading-relaxed">
            {t('hero.desc')}
          </p>

          {/* Parent search */}
          <div className="max-w-xl bg-white/95 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-xl shadow-teal-900/20">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-stone-800 placeholder:text-stone-400 text-base border border-stone-200 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <label className="block">
                <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wide mb-1 ml-1">
                  {t('hero.age')}
                </span>
                <select value={filterAge} onChange={(e) => setFilterAge(e.target.value)} className={selectClass}>
                  {AGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wide mb-1 ml-1">
                  {t('hero.location')}
                </span>
                <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)} className={selectClass}>
                  <option value="all">{t('filter.allAreas')}</option>
                  {AREAS.map((area) => (
                    <option key={area} value={area}>
                      {tArea(area)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wide mb-1 ml-1">
                  {t('hero.interest')}
                </span>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={selectClass}>
                  <option value="all">{t('filter.allCategories')}</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {tCat(cat)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex items-center justify-between mt-3 px-1">
                <span className="text-xs font-semibold text-teal-700">
                  {activeFilterCount} {t('filter.active')}
                </span>
                <button
                  onClick={onClear}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-rose-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> {t('filter.clear')}
                </button>
              </div>
            )}
          </div>

          {/* Area chips */}
          <div className="mt-6 max-w-2xl">
            <span className="block text-teal-50/70 text-sm font-medium mb-2">{t('hero.areas')}</span>
            <div className="flex flex-wrap items-center gap-2">
              {visibleAreas.map((area) => {
                const active = filterArea === area;
                return (
                  <button
                    key={area}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilterArea(active ? 'all' : area)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all active:scale-[0.97] ${
                      active
                        ? 'bg-white text-teal-700 border-white font-semibold shadow-md'
                        : 'bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {tArea(area)}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setShowAllAreas((v) => !v)}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold text-white underline underline-offset-4 decoration-white/50 hover:decoration-white transition-colors"
              >
                {showAllAreas ? t('hero.showFewerAreas') : t('hero.showAllAreas', { count: AREAS.length })}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="relative">
        <svg viewBox="0 0 1440 80" className="w-full h-12 sm:h-16 fill-stone-50" preserveAspectRatio="none">
          <path d="M0,32 C320,80 720,0 1080,32 C1260,48 1380,64 1440,48 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
