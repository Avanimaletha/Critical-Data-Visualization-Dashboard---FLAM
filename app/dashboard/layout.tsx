import { ReactNode } from 'react';
import { DataProvider } from '@/components/providers/DataProvider';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DataProvider>{children}</DataProvider>;
}
