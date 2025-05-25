import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/hooks/useLanguage';
import { useLocation } from 'wouter';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { t, toggleLanguage, flagIcon, langText } = useLanguage();
  const [, setLocation] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'admin') {
      setLocation('/admin');
    } else {
      setLocation('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect bg-white/95 dark:bg-black/95 border-b border-gold/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => setLocation('/')}
              className="text-2xl font-bold text-gold hover:text-gold-light transition-colors duration-300"
            >
              aka
            </button>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <Button
              onClick={() => {
                toggleLanguage();
                setTimeout(() => window.location.reload(), 100);
              }}
              variant="ghost"
              size="sm"
              className="h-10 px-3 rounded-xl bg-card/50 hover:bg-card border border-gold/20 hover:border-gold/40 transition-all duration-300 flex items-center gap-2 hover:scale-105"
            >
              <span className="text-lg transition-transform duration-200">{flagIcon}</span>
              <span className="text-sm font-medium text-gold">{langText}</span>
            </Button>
            
            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-xl bg-card/50 hover:bg-card border border-gold/20 hover:border-gold/40 transition-all duration-300"
            >
              <i className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'} text-gold text-lg transition-transform duration-300 ${isDarkMode ? 'rotate-12' : 'rotate-0'}`} />
            </Button>
            
            {/* Hamburger Menu */}
            <Button
              onClick={toggleMenu}
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-xl bg-card/50 hover:bg-card border border-gold/20 hover:border-gold/40 transition-all duration-300"
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center">
                <span 
                  className={`w-5 h-0.5 bg-gold mb-1 transition-all duration-300 ${
                    isMenuOpen ? 'transform rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span 
                  className={`w-5 h-0.5 bg-gold mb-1 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span 
                  className={`w-5 h-0.5 bg-gold transition-all duration-300 ${
                    isMenuOpen ? 'transform -rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </div>
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-gold/20 bg-card/30 rounded-b-xl mx-4 mb-4">
            <div className="px-4 py-4 space-y-2">
              {[
                { key: 'nav.home', section: 'home' },
                { key: 'nav.friends', section: 'friends' },
                { key: 'nav.projects', section: 'projects' },
                { key: 'nav.contact', section: 'contact' },
                { key: 'nav.admin', section: 'admin' }
              ].map((item, index) => (
                <button
                  key={item.section}
                  onClick={() => scrollToSection(item.section)}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 transform hover:translate-x-2 ${
                    item.section === 'admin' 
                      ? 'text-gold hover:bg-gold/10 border border-gold/20' 
                      : 'text-foreground hover:text-gold hover:bg-gold/10'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="flex items-center gap-3">
                    <i className={`fas ${
                      item.section === 'home' ? 'fa-home' :
                      item.section === 'friends' ? 'fa-users' :
                      item.section === 'projects' ? 'fa-code' :
                      item.section === 'contact' ? 'fa-envelope' :
                      'fa-cog'
                    } w-4`} />
                    {t(item.key as any)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
