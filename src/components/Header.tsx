import { CalendarCheck, Languages, LogIn, LayoutDashboard, Eye, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useAccessibility } from '@/lib/accessibility';
import { AREAS } from '@/lib/constants';

type Props = {
  onLogoClick: () => void;
  onAdminClick: () => void;
  filterArea: string;
  onSelectArea: (area: string) => void;
};

type OpenMenu = 'accessibility' | 'areas' | null;

export function Header({ onLogoClick, onAdminClick, filterArea, onSelectArea }: Props) {
  const { t, tArea, lang, setLang } = useI18n();
  const { user } = useAuth();
  const { cbMode, setCbMode } = useAccessibility();
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const areaMenuRef = useRef<HTMLDivElement>(null);
  const a11yMenuRef = useRef<HTMLDivElement>(null);

  const toggleLang = () => setLang(lang === 'en' ? 'el' : 'en');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (areaMenuRef.current?.contains(target) || a11yMenuRef.current?.contains(target)) return;
      setOpenMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleMenu = (menu: Exclude<OpenMenu, null>) =>
    setOpenMenu((current) => (current === menu ? null : menu));

  const cbOptions = [
    { value: 'off' as const, label: lang === 'en' ? 'Off' : 'Ανενεργό' },
    { value: 'protanopia' as const, label: lang === 'en' ? 'Red-blind (Protanopia)' : 'Κόκκινο-τυφλός (Πρωτανοπία)' },
    { value: 'deuteranopia' as const, label: lang === 'en' ? 'Green-blind (Deuteranopia)' : 'Πράσινο-τυφλός (Δευτερανοπία)' },
    { value: 'tritanopia' as const, label: lang === 'en' ? 'Blue-blind (Tritanopia)' : 'Μπλε-τυφλός (Τριτανοπία)' },
  ];

  const handleSelectArea = (area: string) => {
    onSelectArea(area);
    setOpenMenu(null);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2.5 group"
            aria-label="Book@Class home"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-stone-900 tracking-tight">
              Book<span className="text-teal-600">{t('nav.yourClass')}</span>
            </span>
          </button>

          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
              <a href="#classes" className="hover:text-teal-600 transition-colors">
                {t('nav.browse')}
              </a>
              <a href="#how-it-works" className="hover:text-teal-600 transition-colors">
                {t('nav.howItWorks')}
              </a>

              <div className="relative" ref={areaMenuRef}>
                <button
                  onClick={() => toggleMenu('areas')}
                  className={`inline-flex items-center gap-1 transition-colors hover:text-teal-600 ${
                    filterArea !== 'all' ? 'text-teal-600' : ''
                  }`}
                  aria-expanded={openMenu === 'areas'}
                  aria-haspopup="listbox"
                >
                  {t('nav.areas')}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${openMenu === 'areas' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openMenu === 'areas' && (
                  <div
                    role="listbox"
                    className="absolute left-1/2 -translate-x-1/2 mt-3 w-[min(90vw,28rem)] bg-white rounded-2xl border border-stone-200 shadow-xl p-2 z-50"
                  >
                    <button
                      role="option"
                      aria-selected={filterArea === 'all'}
                      onClick={() => handleSelectArea('all')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        filterArea === 'all'
                          ? 'bg-teal-50 text-teal-700 font-semibold'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {t('filter.allAreas')}
                      {filterArea === 'all' && <Check className="w-4 h-4" />}
                    </button>
                    <div className="grid grid-cols-2 gap-0.5 mt-1 max-h-80 overflow-y-auto">
                      {AREAS.map((area) => {
                        const selected = filterArea === area;
                        return (
                          <button
                            key={area}
                            role="option"
                            aria-selected={selected}
                            onClick={() => handleSelectArea(area)}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                              selected
                                ? 'bg-teal-50 text-teal-700 font-semibold'
                                : 'text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            {tArea(area)}
                            {selected && <Check className="w-4 h-4 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Colorblind accessibility toggle */}
            <div className="relative" ref={a11yMenuRef}>
              <button
                onClick={() => toggleMenu('accessibility')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors ${
                  cbMode !== 'off'
                    ? 'border-teal-500 text-teal-700 bg-teal-50'
                    : 'border-stone-200 text-stone-600 hover:border-teal-300 hover:text-teal-600'
                }`}
                aria-label="Colorblind mode"
                aria-expanded={openMenu === 'accessibility'}
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.accessibility')}</span>
              </button>
              {openMenu === 'accessibility' && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl border border-stone-200 shadow-lg py-2 z-50">
                  <p className="px-3 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">
                    {t('nav.colorblindMode')}
                  </p>
                  {cbOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setCbMode(opt.value);
                        setOpenMenu(null);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        cbMode === opt.value
                          ? 'bg-teal-50 text-teal-700 font-semibold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onAdminClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-sm font-semibold text-stone-600 hover:border-teal-300 hover:text-teal-600 transition-colors"
            >
              {user ? (
                <>
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('admin.title')}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('auth.signIn')}</span>
                </>
              )}
            </button>

            <button
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-sm font-semibold text-stone-600 hover:border-teal-300 hover:text-teal-600 transition-colors"
              aria-label="Switch language"
            >
              <Languages className="w-4 h-4" />
              {lang === 'en' ? 'EL' : 'EN'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
