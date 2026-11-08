import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-client';

// Σύνδεση με τη δική σου Supabase
const supabaseUrl = 'https://supabase.co';
const supabaseAnonKey = 'sb_publishable_default'; // Το Bolt θα τραβήξει το κλειδί αυτόματα
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      // Αποθήκευση του email στη Supabase στον πίνακα subscribers
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);

      if (error) throw error;
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0,transparent_100%)] pointer-events-none" />
      
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative text-center">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
          <svg xmlns="http://w3.org" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
        </div>

        <h1 className="text-3xl font-black tracking-tight mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Book@Class
        </h1>
        <p className="text-emerald-400 font-medium text-sm tracking-wider uppercase mb-4">
          Coming Soon
        </p>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Η απόλυτη πλατφόρμα για να βρίσκεις και να κλείνεις μαθήματα στη σχολή σου. Η αναμονή σχεδόν τελείωσε!
        </p>

        {status === 'success' && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 text-sm font-medium mb-4">
            Ευχαριστούμε! Το email σου αποθηκεύτηκε με επιτυχία.
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm font-medium mb-4">
            Κάτι πήγε στραβά. Δοκίμασε ξανά!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Εισάγετε το email σας..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-sm text-slate-200 placeholder:text-slate-600 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-3 px-4 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/10 disabled:opacity-50"
          >
            {status === 'loading' ? 'Αποθήκευση...' : 'Ενημερώστε με'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
