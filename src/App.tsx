import { useState, useEffect, useCallback } from 'react';
import { supabase, type ClassItem, type BookingInput } from '@/lib/supabase';
import { I18nProvider, useI18n } from '@/lib/i18n';
import { AuthProvider, useAuth } from '@/lib/auth';
import { AccessibilityProvider } from '@/lib/accessibility';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { ClassCard } from '@/components/ClassCard';
import { ClassDetail } from '@/components/ClassDetail';
import { BookingForm } from '@/components/BookingForm';
import { BookingSuccess } from '@/components/BookingSuccess';
import { Footer } from '@/components/Footer';
import { AuthPage } from '@/components/AuthPage';
import { AdminDashboard } from '@/components/AdminDashboard';
import { StudioOwnerDashboard } from '@/components/StudioOwnerDashboard';
import { StudioListingModal } from '@/components/StudioListingModal';
import { MapView } from '@/components/MapView';
import { Search, X, Loader2, Map, LayoutGrid } from 'lucide-react';

type View =
  | { name: 'browse' }
  | { name: 'detail'; classId: string }
  | { name: 'book'; classId: string }
  | { name: 'success'; className: string }
  | { name: 'admin' };

function AppContent() {
  const { t } = useI18n();
  const { user, loading: authLoading, isAdmin, ownedStoreId, roleLoading, signOut } = useAuth();
  const [view, setView] = useState<View>({ name: 'browse' });
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAge, setFilterAge] = useState<string>('all');
  const [listingOpen, setListingOpen] = useState(false);
  const [browseMode, setBrowseMode] = useState<'list' | 'map'>('list');

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('classes')
      .select('*, store:stores(*)')
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching classes:', error);
    } else if (data) {
      setClasses(data as ClassItem[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const handleSelectClass = (cls: ClassItem) => {
    setSelectedClass(cls);
    setView({ name: 'detail', classId: cls.id });
  };

  const handleStartBooking = (cls: ClassItem) => {
    setView({ name: 'book', classId: cls.id });
  };

  const handleSubmitBooking = async (input: BookingInput) => {
    const { error } = await supabase.from('bookings').insert([input]);
    if (error) throw error;
    setView({ name: 'success', className: selectedClass?.title ?? '' });
  };

  const handleBack = () => {
    setView({ name: 'browse' });
  };

  const handleSelectArea = (area: string) => {
    setFilterArea(area);
    setView({ name: 'browse' });
    requestAnimationFrame(() => {
      document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const filtered = classes.filter((cls) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        cls.title.toLowerCase().includes(q) ||
        cls.description.toLowerCase().includes(q) ||
        cls.category.toLowerCase().includes(q) ||
        (cls.store?.name.toLowerCase().includes(q) ?? false) ||
        (cls.store?.area.toLowerCase().includes(q) ?? false);
      if (!match) return false;
    }
    if (filterArea !== 'all' && cls.store?.area !== filterArea) return false;
    if (filterCategory !== 'all' && cls.category !== filterCategory) return false;
    if (filterAge !== 'all') {
      const age = parseInt(filterAge, 10);
      if (age < cls.age_min) return false;
      if (cls.age_max !== null && age > cls.age_max) return false;
    }
    return true;
  });

  const activeFilterCount =
    (filterArea !== 'all' ? 1 : 0) +
    (filterCategory !== 'all' ? 1 : 0) +
    (filterAge !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setFilterArea('all');
    setFilterCategory('all');
    setFilterAge('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col">
      <Header
        onLogoClick={handleBack}
        onAdminClick={() => setView({ name: 'admin' })}
        filterArea={filterArea}
        onSelectArea={handleSelectArea}
      />

      <main className="flex-1">
        {view.name === 'admin' && !user && !authLoading && (
          <AuthPage onBack={handleBack} />
        )}

        {view.name === 'admin' && user && roleLoading && (
          <div className="flex items-center justify-center py-24 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}

        {view.name === 'admin' && user && !roleLoading && isAdmin && (
          <AdminDashboard onBack={handleBack} />
        )}

        {view.name === 'admin' && user && !roleLoading && !isAdmin && ownedStoreId && (
          <StudioOwnerDashboard onBack={handleBack} />
        )}

        {view.name === 'admin' && user && !roleLoading && !isAdmin && !ownedStoreId && (
          <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center bg-stone-50">
            <h1 className="text-xl font-bold text-stone-900 mb-2">{t('owner.noAccessTitle')}</h1>
            <p className="text-stone-500 text-sm max-w-md mb-6">{t('owner.noAccessText')}</p>
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors"
              >
                {t('admin.backToSite')}
              </button>
              <button
                onClick={signOut}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-600 hover:border-rose-300 hover:text-rose-600 transition-colors"
              >
                {t('auth.signOut')}
              </button>
            </div>
          </div>
        )}

        {view.name === 'browse' && (
          <>
            <Hero
              onSearch={setSearchQuery}
              searchValue={searchQuery}
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
            <HowItWorks />
            <section id="classes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-stone-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-3" />
                  <p>{t('browse.loading')}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                    <Search className="w-7 h-7 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-700 mb-1">{t('browse.noResults')}</h3>
                  <p className="text-stone-500 mb-4">{t('browse.tryAdjusting')}</p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    <X className="w-4 h-4" /> {t('browse.clearAll')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <h2 className="text-2xl font-bold text-stone-900">
                      {filtered.length} {filtered.length === 1 ? t('browse.classAvailable') : t('browse.classesAvailable')}
                    </h2>
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100 border border-stone-200 self-start sm:self-auto">
                      <button
                        onClick={() => setBrowseMode('list')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          browseMode === 'list' ? 'bg-white text-teal-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                        {t('browse.viewList')}
                      </button>
                      <button
                        onClick={() => setBrowseMode('map')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          browseMode === 'map' ? 'bg-white text-teal-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                        }`}
                      >
                        <Map className="w-4 h-4" />
                        {t('browse.viewMap')}
                      </button>
                    </div>
                  </div>
                  {browseMode === 'map' ? (
                    <>
                      <p className="text-sm text-stone-500 mb-4">{t('browse.mapHint')}</p>
                      <MapView classes={filtered} onSelectClass={handleSelectClass} />
                    </>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filtered.map((cls) => (
                        <ClassCard key={cls.id} cls={cls} onSelect={handleSelectClass} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}

        {view.name === 'detail' && selectedClass && (
          <ClassDetail
            cls={selectedClass}
            onBack={handleBack}
            onBook={handleStartBooking}
          />
        )}

        {view.name === 'book' && selectedClass && (
          <BookingForm
            cls={selectedClass}
            onBack={() => setView({ name: 'detail', classId: selectedClass.id })}
            onSubmit={handleSubmitBooking}
          />
        )}

        {view.name === 'success' && (
          <BookingSuccess className={view.className} onBack={handleBack} />
        )}
      </main>

      <Footer onListStudio={() => setListingOpen(true)} />

      <StudioListingModal open={listingOpen} onClose={() => setListingOpen(false)} />
    </div>
  );
}

export default function App() {
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
