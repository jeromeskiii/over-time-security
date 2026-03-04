import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { MobileCTA } from './MobileCTA';
import { ScrollToTop } from '../ScrollToTop';
import { Backdrop } from './Backdrop';

export function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-base text-text-primary font-sans overflow-hidden">
      <Backdrop />
      <ScrollToTop />
      <Navbar />
      <main className="relative z-10 flex-1 pt-[88px] md:pt-[104px] pb-[60px] md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileCTA />
    </div>
  );
}
