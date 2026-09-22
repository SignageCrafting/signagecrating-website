import { createContext, useContext } from 'react';
import { defaultContent } from '@/content/defaults';
import type { SiteContent } from '@/content/types';

export interface AdminContextValue {
  content: SiteContent;
  update: (path: (string | number)[], value: unknown) => void;
  pickImage: () => Promise<string | null>;
}

export const AdminContext = createContext<AdminContextValue>({
  content: defaultContent,
  update: () => {},
  pickImage: async () => null,
});

export function useAdmin() {
  return useContext(AdminContext);
}
