import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Media | FreakyHub',
  description: 'Browse movies and TV shows on FreakyHub',
};

export default function MediaLayout({ children }: { children: ReactNode }) {
  return <div className="container mx-auto py-8">{children}</div>;
}
