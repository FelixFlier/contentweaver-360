
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, ArrowRight, Loader2 } from 'lucide-react';
import ContentCard from '@/components/content/ContentCard';
import { Button } from '@/components/ui/button';
import { getUserContents } from '@/services/contentService';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { Content } from '@/services/contentService';

const ContentList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchContents = async () => {
      if (user) {
        setIsLoading(true);
        const data = await getUserContents();
        setContents(data);
        setIsLoading(false);
      }
    };
    
    fetchContents();
  }, [user]);

  // Map contents to ContentCardProps
  const mapContentsToCards = (contents: Content[]) => {
    return contents.map(content => ({
      id: content.id,
      title: content.title,
      type: content.type as 'blog' | 'linkedin',
      status: content.status === 'published' ? 'completed' as const : 'inprogress' as const,
      progress: content.status === 'published' ? 100 : 50, // Simplified example
      lastUpdated: new Date(content.updated_at).toLocaleDateString('de-DE')
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container px-4 pt-24 pb-16 mx-auto">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Anmeldung erforderlich</h1>
              <p className="text-muted-foreground mb-6">Sie müssen angemeldet sein, um Ihre Inhalte zu sehen.</p>
              <Button onClick={() => navigate('/')}>Zurück zur Startseite</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 pt-24 pb-16 mx-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Folder className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Meine Inhalte</h2>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-primary hover:text-primary"
              onClick={() => navigate('/all-contents')}
            >
              Alle anzeigen 
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : contents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mapContentsToCards(contents.slice(0, 3)).map((content) => (
                <ContentCard 
                  key={content.id}
                  {...content}
                />
              ))}
            </div>
          ) : (
            <div className="bg-muted/40 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Keine Inhalte gefunden</h3>
              <p className="text-muted-foreground mb-6">Sie haben noch keine Inhalte erstellt. Erstellen Sie jetzt Ihren ersten Inhalt.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => navigate('/create/blog')}>Blog-Artikel erstellen</Button>
                <Button variant="outline" onClick={() => navigate('/create/linkedin')}>LinkedIn-Post erstellen</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContentList;
