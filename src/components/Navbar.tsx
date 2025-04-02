
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, Users, School, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 transition-all duration-300 z-50",
        scrolled 
          ? "bg-background/80 backdrop-blur-lg shadow-sm py-4" 
          : "bg-background py-6"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 animate-hover">
            <School className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Adarsha Ma.vi (Buddhashanti)</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={cn(
                "nav-link flex items-center space-x-1", 
                isActive("/") && "active"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/teachers" 
              className={cn(
                "nav-link flex items-center space-x-1", 
                isActive("/teachers") && "active"
              )}
            >
              <Users className="h-4 w-4" />
              <span>Teachers</span>
            </Link>
            <Link 
              to="/classes" 
              className={cn(
                "nav-link flex items-center space-x-1", 
                isActive("/classes") && "active"
              )}
            >
              <School className="h-4 w-4" />
              <span>Classes</span>
            </Link>
            <Link 
              to="/schedule" 
              className={cn(
                "nav-link flex items-center space-x-1", 
                isActive("/schedule") && "active"
              )}
            >
              <CalendarDays className="h-4 w-4" />
              <span>Schedule</span>
            </Link>
          </nav>
          
          <div className="md:hidden">
            {/* Mobile menu would go here */}
            <button className="p-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16m-7 6h7" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
