import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuery } from '@tanstack/react-query';

export function ProjectsSection() {
  const { t } = useLanguage();
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-background transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('projects.title')}</h2>
          
          <div className="overflow-x-auto scroll-container">
            <div className="flex space-x-6 pb-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="min-w-[350px] overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-muted" />
                  <CardContent className="p-6">
                    <div className="w-32 h-6 bg-muted rounded mb-2" />
                    <div className="w-full h-4 bg-muted rounded mb-4" />
                    <div className="w-full h-10 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('projects.title')}</h2>
        
        <div className="overflow-x-auto scroll-container">
          <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
            {projects?.map((project) => (
              <Card 
                key={project.id} 
                className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 min-w-[350px]"
              >
                <img 
                  src={project.imageUrl} 
                  alt={`${project.name} Project`} 
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <Button 
                    asChild
                    className="w-full bg-gold text-white hover:bg-gold-dark transition-colors"
                  >
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                      {t('projects.view')}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
