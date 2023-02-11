import { ReactNode } from 'react';
// guards
// import AuthGuard from '../guards/AuthGuard';
// components
import MainLayout from './main';
import SearchLayout from './search';
import SimpleLayout from './simple';
import LogoOnlyLayout from './LogoOnlyLayout';
import AuthGuard from 'src/guards/AuthGuard';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
  variant?: 'main' | 'search' | 'logoOnly' | 'simple' | 'noSidebar';
};

export default function Layout({ variant = 'main', children }: Props) {
  if (variant === 'logoOnly') {
    return <LogoOnlyLayout> {children} </LogoOnlyLayout>;
  }

  if (variant === 'main') {
    return <MainLayout>{children}</MainLayout>;
  }

  if (variant === 'simple') {
    return (
      <AuthGuard>
        <SimpleLayout>{children}</SimpleLayout>
      </AuthGuard>
    );
  }

  return (
    // <AuthGuard>
    <SearchLayout> {children} </SearchLayout>
    // </AuthGuard>
  );
}
