import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import { useQuery } from '@tanstack/react-query';
import type { Settings } from '@shared/schema';

export function ProfileSection() {
  const { t, currentLang } = useLanguage();
  
  const { data: settings } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  const { displayText } = useTypingAnimation({
    texts: settings?.statusTexts || { id: ['Pelajar'], en: ['Student'] },
    currentLang,
    speed: 3000
  });

  if (!settings) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-background to-muted/20 text-foreground transition-colors duration-500 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-20 relative z-10">
        <div className="text-center animate-slide-up">
          {/* Profile Image */}
          <div className="relative inline-block mb-8">
            <img 
              src={settings.profileImageUrl} 
              alt={`${settings.profileName} profile`} 
              className="w-32 h-32 rounded-full mx-auto border-4 border-gold shadow-2xl object-cover float-animation"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gold/20 to-transparent animate-pulse" />
            <div className="absolute -inset-4 rounded-full border-2 border-gold/30 animate-ping" style={{ animationDuration: '3s' }} />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gold slide-in-left bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            {settings.profileName}
          </h1>
          
          <div className="space-y-3 text-lg md:text-xl mb-8 slide-in-right">
            <p className="transform hover:scale-105 transition-transform duration-300">
              <span className="text-muted-foreground">{t('home.age')}:</span> 
              <span className="text-gold font-semibold ml-1">{settings.profileAge} tahun</span>
            </p>
            <p className="transform hover:scale-105 transition-transform duration-300">
              <span className="text-muted-foreground">{t('home.origin')}</span>
            </p>
            <div className="h-8">
              <p>
                <span className="text-muted-foreground">{t('home.status')}</span> 
                <span className="typing-animation text-gold font-medium ml-2 relative">
                  {displayText}
                  <span className="absolute right-0 top-0 w-0.5 h-full bg-gold animate-pulse" />
                </span>
              </p>
            </div>
          </div>
          
          <blockquote className="text-xl md:text-2xl italic text-muted-foreground mb-8 scale-in">
            {t('home.quote')}
          </blockquote>
          
          <Button asChild className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold text-white font-bold px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 pulse-glow">
            <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer">
              <span className="flex items-center gap-3">
                <i className="fab fa-whatsapp text-xl bounce-animation" />
                {t('home.contact')}
                <i className="fas fa-arrow-right text-sm transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
