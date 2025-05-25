import { Navigation } from '@/components/Navigation';
import { ProfileSection } from '@/components/ProfileSection';
import { SocialMediaCards } from '@/components/SocialMediaCards';
import { FriendsSection } from '@/components/FriendsSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ContactSection } from '@/components/ContactSection';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useLanguage } from '@/hooks/useLanguage';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Navigation />
      <AudioPlayer />
      
      <main className="pt-16">
        <ProfileSection />
        
        {/* Social Media Cards - positioned within ProfileSection */}
        <div className="max-w-4xl mx-auto px-4 -mt-10">
          <SocialMediaCards />
        </div>
        
        <FriendsSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-black text-white py-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-lg">{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
