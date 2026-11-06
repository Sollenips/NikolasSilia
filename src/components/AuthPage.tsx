import { useState } from 'react';
import { CalendarCheck, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';

type Props = {
  onBack: () => void;
};

type Mode = 'signIn' | 'signUp';

export function AuthPage({ onBack }: Props) {
  const { signIn, signUp } = useAuth();
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignUp = mode === 'signUp';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (isSignUp) {
        setError(t('auth.errorSignUp'));
      } else if (msg.includes('Invalid login')) {
        setError(t('auth.errorInvalid'));
      } else {
        setError(t('auth.errorGeneric'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-stone-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="bg-teal-600 px-6 py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
              <CalendarCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">
              {isSignUp ? t('auth.signUpTitle') : t('auth.signInTitle')}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {isSignUp && (
              <p className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-xl p-3">
                {t('auth.signUpHelp')}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder:text-stone-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isSignUp ? 6 : undefined}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder:text-stone-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all text-sm"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-teal-600 text-white font-semibold text-base hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isSignUp ? t('auth.signUpBtn') : t('auth.signInBtn')
              )}
            </button>
          </form>

          <div className="px-6 pb-6 text-center space-y-3">
            <button
              onClick={() => {
                setError(null);
                setMode(isSignUp ? 'signIn' : 'signUp');
              }}
              className="text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors"
            >
              {isSignUp ? t('auth.haveAccount') : t('auth.needAccount')}
            </button>
            <div>
              <button
                onClick={onBack}
                className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
              >
                {t('admin.backToSite')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
