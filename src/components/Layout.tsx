
import React from 'react';
import Navbar from './Navbar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-10 animate-fade-in">
        {children}
      </main>
      <footer className="py-6 bg-secondary">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} School Schedule Management System</p>
          <p className="mt-1">Software developed by Ishwor Bhattarai</p>
          <p className="mt-1">Designed with precision and care</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
