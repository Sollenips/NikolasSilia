import { useEffect, useMemo, useState } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
import { AccessibilityProvider } from '@/lib/accessibility';
import { AuthProvider, useAuth } from '@/lib/auth';
import { supabase, type BookingInput, type ClassItem } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';
import { ClassCard } from '@/components/ClassCard';
import { ClassDetail } from '@/components/ClassDetail';
import { BookingForm } from '@/components/BookingForm';
import { BookingSuccess } from '@/components/BookingSuccess';
import { MapView } from '@/components/MapView';
import { StudioListingModal } from '@/components/StudioListingModal';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AuthPage } from '@/components/AuthPage';
import { StudioOwnerDashboard } from '@/components/StudioOwnerDashboard';

type View =
  | { name: 'home' }
  | { name: 'class'; cls: ClassItem }
  | { name: 'booking'; cls: ClassItem }
  | { name: 'success'; className: string }
  | { name: 'admin' }
  | { name: 'studio' }
  | { name: 'auth' };

function matchesAge(cls: ClassItem, age: number) {
  return cls.age_min <= age && (cls.age_max === null || cls.age_max >= age);
}

function PlatformApp() {
  const { user, isAdmin, ownedStoreId } = useAuth();
  const { t } = useI18n();
  const [view, setView] = useState<View>({ name: 'home' });
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [listingOpen, setListingOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAge, setFilterAge] = useState('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*, store:stores(*)')
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error('Error fetching classes:', error);
        setLoadError(true);
        return;
      }
      setClasses((data ?? []) as ClassItem[]);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredClasses = useMemo(() => {
    const q = search.trim().toLowerCase();
    const ageNum = filterAge === 'all' ? null : Number(filterAge);
    return classes.filter((cls) => {
      if (filterArea !== 'all' && cls.store?.area !== filterArea) return false;
      if (filterCategory !== 'all' && cls.category !== filterCategory) return false;
      if (ageNum !== null && !matchesAge(cls, ageNum)) return false;
      if (q) {
        const haystack = `${cls.title} ${cls.instructor} ${cls.store?.name ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [classes, search, filterArea, filterCategory, filterAge]);

  const activeFilterCount =
    [search.trim() !== '', filterArea !== 'all', filterCategory !== 'all', filterAge !== 'all'].filter(Boolean).length;

  const clearFilters = () => {
    setSearch('');
    setFilterArea('all');
    setFilterCategory('all');
    setFilterAge('all');
  };

  const handleAdminClick = () => {
    if (user && isAdmin) setView({ name: 'admin' });
    else if (user && ownedStoreId) setView({ name: 'studio' });
    else setView({ name: 'auth' });
  };

  const handleBookingSubmit = async (input: BookingInput) => {
    const { error } = await supabase.from('bookings').insert([input]);
    if (error) throw error;
    const cls = view.name === 'booking' ? view.cls : null;
    setView({ name: 'success', className: cls?.title ?? '' });
  };

  const goHome = () => setView({ name: 'home' });

  if (view.name === 'admin') return <AdminDashboard onBack={goHome} />;
  if (view.name === 'studio') return <StudioOwnerDashboard onBack={goHome} />;
  if (view.name === 'auth') return <AuthPage onBack={goHome} />;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      <Header
        onLogoClick={goHome}
        onAdminClick={handleAdminClick}
        filterArea={filterArea}
        onSelectArea={setFilterArea}
      />

      {view.name === 'home' && (
        <main className="flex-1">
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
            onListStudio={() => setListingOpen(true)}
          />

          <section id="classes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
            <h2 className="text-3xl font-extrabold text-stone-900 mb-6">{t('nav.browse')}</h2>
            {loadError ? (
              <p className="text-rose-600 text-sm font-medium">{t('admin.errorSave')}</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClasses.map((cls) => (
                    <ClassCard key={cls.id} cls={cls} onSelect={() => setView({ name: 'class', cls })} />
                  ))}
                </div>
                {filteredClasses.length > 0 && (
                  <div className="mt-12">
                    <MapView classes={filteredClasses} onSelectClass={(cls) => setView({ name: 'class', cls })} />
                  </div>
                )}
              </>
            )}
          </section>

          <HowItWorks />
        </main>
      )}

      {view.name === 'class' && (
        <main className="flex-1">
          <ClassDetail
            cls={view.cls}
            onBack={goHome}
            onBook={() => setView({ name: 'booking', cls: view.cls })}
          />
        </main>
      )}

      {view.name === 'booking' && (
        <main className="flex-1">
          <BookingForm
            cls={view.cls}
            onBack={() => setView({ name: 'class', cls: view.cls })}
            onSubmit={handleBookingSubmit}
          />
        </main>
      )}

      {view.name === 'success' && (
        <main className="flex-1">
          <BookingSuccess className={view.className} onBack={goHome} />
        </main>
      )}

      <Footer onListStudio={() => setListingOpen(true)} />

      <StudioListingModal open={listingOpen} onClose={() => setListingOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <PlatformApp />
        </AuthProvider>
      </AccessibilityProvider>
    </I18nProvider>
  );
}
