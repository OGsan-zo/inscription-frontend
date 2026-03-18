'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { InitialData } from '@/lib/db'; 

const DataContext = createContext<InitialData | null>(null);

export function DataProvider({ children, data }: { children: React.ReactNode, data: InitialData }) {
  // ✅ 2. On met les données initiales dans un State
  const [currentData, setCurrentData] = useState<InitialData>(data);

  // ✅ 3. On écoute les changements venant du router.refresh()
  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  return (
    <DataContext.Provider value={currentData}>
      {children}
    </DataContext.Provider>
  );
}

export const useInitialData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useInitialData doit être utilisé dans un DataProvider");
  return context;
};