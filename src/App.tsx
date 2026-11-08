import { useMemo, useState } from 'react';
import { I18nProvider } from '@/lib/i18n';
import { AccessibilityProvider } from '@/lib/accessibility';
import { AuthProvider } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';
import { AdminDashboard } from '@/components/AdminDashboard';

type View = 'home' | 'admin';

function Site() {
  const [view, setView] = useState<View>('home');
  const [searchValue, setSearchValue] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAge, setFilterAge] = useState('');

  const activeFilterCount = useMemo(
    () => [filterArea, filterCategory, filterAge].filter(Boolean).length,
    [filterArea, filterCategory, filterAge]
  );

  const clearFilters = () => {
    setSearchValue('');
    setFilterArea('');
    setFilterCategory('');
    setFilterAge('');
  };

  if (view === 'admin') {
    return <AdminDashboard onBack={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <Header
        onLogoClick={() => setView('home')}
        onAdminClick={() => setView('admin')}
        filterArea={filterArea}
        onSelectArea={setFilterArea}
      />
      <main>
        <Hero
          onSearch={setSearchValue}
          searchValue={searchValue}
          filterArea={filterArea}
          setFilterArea={setFilterArea}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterAge={filterAge}
          setFilterAge={setFilterAge}
          activeFilterCount={activeFilterCount}
          onClear={clearFilters}
          onListStudio={() => undefined}
        />
        <HowItWorks />
      </main>
      <Footer onListStudio={() => undefined} />
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <Site />
        </AuthProvider>
      </AccessibilityProvider>
    </I18nProvider>
  );
}

export default App;
