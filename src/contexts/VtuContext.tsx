import React, { createContext, useContext, ReactNode } from 'react';
import { useVtu } from '../hooks/useVtu';

const VtuContext = createContext<ReturnType<typeof useVtu> | undefined>(undefined);

interface VtuProviderProps {
  children: ReactNode;
}

export const VtuProvider: React.FC<VtuProviderProps> = ({ children }) => {
  const vtuState = useVtu();

  return (
    <VtuContext.Provider value={vtuState}>
      {children}
    </VtuContext.Provider>
  );
};

export const useVtuContext = () => {
  const context = useContext(VtuContext);
  if (context === undefined) {
    throw new Error('useVtuContext must be used within a VtuProvider');
  }
  return context;
};
