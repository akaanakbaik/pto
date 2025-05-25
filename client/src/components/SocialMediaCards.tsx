import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuery } from '@tanstack/react-query';
import type { SocialMedia } from '@shared/schema';

export function SocialMediaCards() {
  const { t } = useLanguage();
  
  const { data: socialMedia, isLoading } = useQuery<SocialMedia[]>({
    queryKey: ['/api/social-media'],
  });

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center slide-in-left">{t('home.social')}</h2>
        <div className="overflow-x-auto scroll-container">
          <div className="flex space-x-6 pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="min-w-[280px] animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-muted rounded mr-4" />
                      <div>
                        <div className="w-20 h-4 bg-muted rounded mb-2" />
                        <div className="w-16 h-3 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="w-16 h-8 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8 text-center slide-in-left">{t('home.social')}</h2>
      <div className="overflow-x-auto scroll-container">
        <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
          {socialMedia?.map((social, index) => (
            <Card 
              key={social.id} 
              className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 min-w-[280px] border border-gold/20 hover:border-gold/40 scale-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center group">
                    <div className="relative">
                      <i className={`${social.iconClass} text-4xl mr-4 transition-transform duration-300 group-hover:scale-110 bounce-animation`} 
                         style={{ animationDelay: `${index * 200}ms` }} />
                      <div className="absolute -inset-2 bg-gradient-to-r from-gold/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-gold transition-colors duration-300">{social.name}</h3>
                      <p className="text-muted-foreground text-sm">{social.username}</p>
                    </div>
                  </div>
                  <Button 
                    asChild
                    className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 pulse-glow"
                  >
                    <a href={social.url} target="_blank" rel="noopener noreferrer">
                      <span className="flex items-center gap-2">
                        {t('home.view')}
                        <i className="fas fa-external-link-alt text-sm" />
                      </span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
