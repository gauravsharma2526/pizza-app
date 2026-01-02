import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { CartDrawer } from '../cart/CartDrawer';
import { ToastContainer, FloatingCartButton } from '../ui';

/**
 * Main layout wrapper with header, footer, cart drawer and toast notifications
 * Includes floating cart button for mobile UX
 */
export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark bg-pizza-pattern">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
      <FloatingCartButton />
    </div>
  );
};

export default Layout;
