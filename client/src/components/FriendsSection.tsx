import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuery } from '@tanstack/react-query';

export function FriendsSection() {
  const { t } = useLanguage();
  
  const { data: friends, isLoading } = useQuery({
    queryKey: ['/api/friends'],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('friends.title')}</h2>
          
          <div className="overflow-x-auto scroll-container">
            <div className="flex space-x-6 pb-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="min-w-[300px] animate-pulse">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4" />
                    <div className="w-32 h-6 bg-muted rounded mx-auto mb-2" />
                    <div className="w-full h-4 bg-muted rounded" />
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
    <section id="friends" className="py-20 bg-muted/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('friends.title')}</h2>
        
        <div className="overflow-x-auto scroll-container">
          <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
            {friends?.map((friend) => (
              <Card 
                key={friend.id} 
                className="bg-card shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 min-w-[300px]"
              >
                <CardContent className="p-6">
                  <img 
                    src={friend.imageUrl} 
                    alt={`${friend.name} Profile`} 
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-center mb-2">{friend.name}</h3>
                  <p className="text-muted-foreground text-center">{friend.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
