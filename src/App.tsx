import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, AlertCircle, LayoutList, Map as MapIcon, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ClassCard } from '@/components/ClassCard';
import { ClassDetail } from '@/components/ClassDetail';
import { BookingForm } from '@/components/BookingForm';
import { BookingSuccess } from '@/components/BookingSuccess';
import { MapView } from '@/components/MapView';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';
import { StudioListingModal } from '@/components/StudioListingModal';
import { AuthPage } from '@/components/AuthPage';
import { AdminDashboard } from '@/components/AdminDashboard';
import { StudioOwnerDashboard } from '@/components/StudioOwnerDashboard';
import { AccessibilityProvider } from '@/lib/accessibility';
import { AuthProvider, useAuth } from '@/lib/auth';
import { I18nProvider, useI18n } from '@/lib/i18n';
import { supabase, type BookingInput, type ClassItem, type Store } from '@/lib/supabase';

type View = 'browse' | 'detail' | 'booking' | 'success' | 'auth' | 'dashboard';

const AGE_RANGES: Record<string, [number, number]> = {
  '4': [4, 6],
  '7': [7, 9],
  '10': [10, 12],
  '13': [13, 17],
  '18': [18, 99],
};

function matchesAge(cls: ClassItem, ageKey: string) {
  const range = AGE_RANGES[ageKey];
  if (!range) return true;
  const [lo, hi] = range;
  return cls.age_min <= hi && (cls.age_max ?? 99) >= lo;
}

function AppContent() {
  const { t } = useI18n();
  const { user, isAdmin, roleLoading } = useAuth();

  const [view, setView] = useState<View>('browse');
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [schools, setSchools] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [listingOpen, setListingOpen] = useState(false);
  const [layout, setLayout] = useState<'list' | 'map'>('list');

  const [search, setSearch] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAge, setFilterAge] = useState('all');
  const [filterSchool, setFilterSchool] = useState<string | null>(null);

  const goTo = useCallback((next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    const [classesRes, storesRes] = await Promise.all([
      supabase.from('classes').select('*, store:stores(*)').order('created_at', { ascending: false }),
      supabase.from('stores').select('*').order('name', { ascending: true }),
    ]);
    if (classesRes.error || !Array.isArray(classesRes.data) || storesRes.error || !Array.isArray(storesRes.data)) {
      setLoadError(true);
    } else {
      setClasses(classesRes.data as ClassItem[]);
      setSchools(storesRes.data as Store[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    if (user && view === 'auth') goTo('dashboard');
  }, [user, view, goTo]);

  const filteredClasses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return classes.filter((cls) => {
      if (filterSchool && cls.store_id !== filterSchool) return false;
      if (filterArea !== 'all' && cls.store?.area !== filterArea) return false;
      if (filterCategory !== 'all' && cls.category !== filterCategory) return false;
      if (!matchesAge(cls, filterAge)) return false;
      if (!q) return true;
      return [cls.title, cls.instructor, cls.category, cls.store?.name ?? '']
        .some((field) => field.toLowerCase().includes(q));
    });
  }, [classes, search, filterSchool, filterArea, filterCategory, filterAge]);

  const activeFilterCount =
    (search.trim() ? 1 : 0) +
    (filterSchool ? 1 : 0) +
    (filterArea !== 'all' ? 1 : 0) +
    (filterCategory !== 'all' ? 1 : 0) +
    (filterAge !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setSearch('');
    setFilterSchool(null);
    setFilterArea('all');
    setFilterCategory('all');
    setFilterAge('all');
  };

  const handleSelectClass = (cls: ClassItem) => {
    setSelectedClass(cls);
    goTo('detail');
  };

  const handleSelectSchool = (schoolId: string | null) => {
    setFilterSchool(schoolId);
    if (view !== 'browse') {
      goTo('browse');
      return;
    }
    document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBookingSubmit = async (input: BookingInput) => {
    const { error } = await supabase.from('bookings').insert(input);
    if (error) throw new Error(t('booking.errorGeneric'));
    goTo('success');
  };

  const handleAccountClick = () => {
    goTo(user ? 'dashboard' : 'auth');
  };

  const renderHome = () => (
    <>
      <Hero
        onSearch={setSearch}
        searchValue={search}
        filterArea={filterArea}
        setFilterArea={setFilterArea}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterAge={filterAge}
        setFilterAge={setFilterAge}
        activeFilterCount={activeFilterCount}
        onClear={clearFilters}
      />

      <section id="classes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-stone-500">
              {filteredClasses.length}{' '}
              {filteredClasses.length === 1 ? t('browse.classAvailable') : t('browse.classesAvailable')}
            </p>
            {filterSchool && (
              <button
                onClick={() => setFilterSchool(null)}
                className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition-colors"
              >
                {schools.find((s) => s.id === filterSchool)?.name}
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="inline-flex rounded-xl border border-stone-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setLayout('list')}
              aria-pressed={layout === 'list'}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                layout === 'list' ? 'bg-teal-600 text-white' : 'text-stone-600 hover:text-teal-600'
              }`}
            >
              <LayoutList className="w-4 h-4" />
              {t('browse.viewList')}
            </button>
            <button
              onClick={() => setLayout('map')}
              aria-pressed={layout === 'map'}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                layout === 'map' ? 'bg-teal-600 text-white' : 'text-stone-600 hover:text-teal-600'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              {t('browse.viewMap')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-stone-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm font-medium">{t('browse.loading')}</span>
          </div>
        ) : loadError ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{t('browse.loadError')}</span>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-lg font-semibold text-stone-800">{t('browse.noResults')}</p>
            <p className="mt-2 text-sm text-stone-500">{t('browse.tryAdjusting')}</p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
              >
                {t('browse.clearAll')}
              </button>
            )}
          </div>
        ) : layout === 'map' ? (
          <div className="space-y-3">
            <p className="text-sm text-stone-500">{t('browse.mapHint')}</p>
            <MapView classes={filteredClasses} onSelectClass={handleSelectClass} />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((cls) => (
              <ClassCard key={cls.id} cls={cls} onSelect={handleSelectClass} />
            ))}
          </div>
        )}
      </section>

      <HowItWorks />
    </>
  );

  const renderView = () => {
    switch (view) {
      case 'detail':
        return selectedClass && (
          <ClassDetail cls={selectedClass} onBack={() => goTo('browse')} onBook={() => goTo('booking')} />
        );
      case 'booking':
        return selectedClass && (
          <BookingForm cls={selectedClass} onBack={() => goTo('detail')} onSubmit={handleBookingSubmit} />
        );
      case 'success':
        return <BookingSuccess className={selectedClass?.title ?? ''} onBack={() => goTo('browse')} />;
      case 'auth':
        return <AuthPage onBack={() => goTo('browse')} />;
      case 'dashboard':
        if (roleLoading) {
          return (
            <div className="flex justify-center py-24 text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          );
        }
        return isAdmin
          ? <AdminDashboard onBack={() => goTo('browse')} />
          : <StudioOwnerDashboard onBack={() => goTo('browse')} />;
      default:
        return renderHome();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Header
        onLogoClick={() => goTo('browse')}
        onAdminClick={handleAccountClick}
        onListSchool={() => setListingOpen(true)}
        schools={schools}
        filterSchool={filterSchool}
        onSelectSchool={handleSelectSchool}
      />
      <main className="flex-1">{renderView()}</main>
      <Footer onListStudio={() => setListingOpen(true)} />
      <StudioListingModal open={listingOpen} onClose={() => setListingOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AccessibilityProvider>
          <AppContent />
        </AccessibilityProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
