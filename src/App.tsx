import React, { useState } from 'react';
import { Timer, Mail, CheckCircle2, Globe, Instagram, Facebook } from 'lucide-react';

function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background Διακοσμητικά Εφέ (Glow) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header / Logo */}
      <header className="container mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Globe className="h-6 w-6 text-blue-500" />
          <span className="text-xl font-bold tracking-wider bg-gradient-to-r bg-clip-text text-transparent from-white to-slate-400">
            NIKOLAS SILIA
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 flex flex-col items-center justify-center text-center flex-grow relative z-10 max-w-2xl">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 font-medium mb-8 animate-pulse">
          <Timer className="h-4 w-4" />
          <span>Έρχεται Σύντομα / Coming Soon</span>
        </div>

        {/* Τίτλος */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Κάτι εξαιρετικό είναι{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            καθ' οδόν
          </span>
        </h1>

        {/* Περιγραφή */}
        <p className="text-slate-400 text-lg md:text-xl mb-12 leading-relaxed">
          Ετοιμάζουμε τη νέα μας πλατφόρμα. Συμπληρώστε το email σας παρακάτω για να ενημερωθείτε πρώτοι μόλις είμαστε live!
        </p>

        {/* Φόρμα Email */}
        <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-2xl p-2 backdrop-blur-sm">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-5 w-5" />
                <input
                  type="email"
                  required
                  placeholder="Εισάγετε το email σας..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl px-6 py-3 transition-all duration-200 shadow-lg shadow-blue-600/20 active:scale-[0.98]"
              >
                Ενημέρωσή με
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center space-x-2 py-3 text-green-400 font-medium">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>Ευχαριστούμε! Θα ενημερωθείτε σύντομα.</span>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Social Links */}
      <footer className="container mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center border-t border-slate-900 text-sm text-slate-500 relative z-10 gap-4">
        <p>© {new Date().getFullYear()} Nikolas Silia. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-slate-300 transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-slate-300 transition-colors">
            <Facebook className="h-5 w-5" />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
