import { I18nProvider } from '@/lib/i18n';
import { AccessibilityProvider } from '@/lib/accessibility';
import { AuthProvider } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';

function App() {
  return (
    <I18nProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
            <Header />
            <main>
              <Hero />
              <HowItWorks />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </AccessibilityProvider>
    </I18nProvider>
  );
}

export default App;
