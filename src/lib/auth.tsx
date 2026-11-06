import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

type AuthCtx = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  ownedStoreId: string | null;
  roleLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ownedStoreId, setOwnedStoreId] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      setOwnedStoreId(null);
      setRoleLoading(false);
      return;
    }
    let cancelled = false;
    setRoleLoading(true);
    (async () => {
      const [adminRes, ownerRes] = await Promise.all([
        supabase.from('app_admins').select('user_id').eq('user_id', userId).maybeSingle(),
        supabase.from('store_owners').select('store_id').eq('user_id', userId).maybeSingle(),
      ]);
      if (cancelled) return;
      setIsAdmin(!adminRes.error && adminRes.data !== null);
      setOwnedStoreId(ownerRes.error ? null : (ownerRes.data?.store_id ?? null));
      setRoleLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        isAdmin,
        ownedStoreId,
        roleLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
