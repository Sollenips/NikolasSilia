import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type CBMode = 'off' | 'protanopia' | 'deuteranopia' | 'tritanopia';

type Ctx = {
  cbMode: CBMode;
  setCbMode: (m: CBMode) => void;
  cbEnabled: boolean;
};

const AccessibilityContext = createContext<Ctx | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [cbMode, setCbModeState] = useState<CBMode>(() => {
    if (typeof window === 'undefined') return 'off';
    return (localStorage.getItem('byc-cb-mode') as CBMode) || 'off';
  });

  useEffect(() => {
    localStorage.setItem('byc-cb-mode', cbMode);
    const root = document.documentElement;
    if (cbMode !== 'off') {
      root.classList.add('cb-mode');
      root.classList.remove('cb-protanopia', 'cb-deuteranopia', 'cb-tritanopia');
      root.classList.add(`cb-${cbMode}`);
    } else {
      root.classList.remove('cb-mode', 'cb-protanopia', 'cb-deuteranopia', 'cb-tritanopia');
    }
  }, [cbMode]);

  const setCbMode = (m: CBMode) => setCbModeState(m);
  const cbEnabled = cbMode !== 'off';

  return (
    <AccessibilityContext.Provider value={{ cbMode, setCbMode, cbEnabled }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
