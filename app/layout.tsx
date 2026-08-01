// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/AuthHeader.tsx';

export const metadata: Metadata = {
  title: 'GroupFind.ci',
  description: 'Trouve des groupes WhatsApp par thème et région en Côte d’Ivoire.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}