import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuery } from '@tanstack/react-query';

export function ContactSection() {
  const { t } = useLanguage();
  
  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
  });

  return (
    <section id="contact" className="py-20 bg-muted/30 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">{t('contact.title')}</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Email */}
          <Card className="bg-card shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <i className="fas fa-envelope text-3xl text-gold mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('contact.email')}</h3>
              <p className="text-muted-foreground">aka@example.com</p>
            </CardContent>
          </Card>
          
          {/* WhatsApp */}
          <Card className="bg-card shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <i className="fab fa-whatsapp text-3xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
              <a 
                href={settings?.whatsappUrl || "https://wa.me/6281266950382"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-dark transition-colors"
              >
                +62 812-6695-0382
              </a>
            </CardContent>
          </Card>
          
          {/* Telegram */}
          <Card className="bg-card shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <i className="fab fa-telegram text-3xl text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Telegram</h3>
              <p className="text-muted-foreground">@aka_telegram</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
