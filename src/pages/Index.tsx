// src/pages/Index.tsx
import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  ChevronRight, 
  Search, 
  LineChart, 
  Plus,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ContentCarousel from '@/components/content/ContentCarousel';
import ActivityTimeline from '@/components/activity/ActivityTimeline';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import TutorialDialog from '@/components/tutorial/TutorialDialog';
import { useTutorial } from '@/hooks/use-tutorial';
import { cn } from '@/lib/utils';
import { getUserContents, Content } from '@/services/contentService';
import { ContentCardProps } from '@/components/content/ContentCard';

const featureCards = [
  {
    title: 'Blog-Artikel',
    description: 'Erstellen Sie professionelle Blog-Artikel mit KI-Unterstützung und verbessern Sie Ihre Online-Präsenz.',
    icon: <FileText className="h-6 w-6 text-primary" />,
    path: '/create/blog',
  },
  {
    title: 'LinkedIn-Posts',
    description: 'Gestalten Sie wirkungsvolle LinkedIn-Posts, die Ihre berufliche Marke stärken und mehr Engagement erzielen.',
    icon: <FileText className="h-6 w-6 text-secondary" />,
    path: '/create/linkedin',
  },
  {
    title: 'Quellenmanagement',
    description: 'Verwalten Sie Ihre Quellen und Referenzen effizient, um die Glaubwürdigkeit Ihrer Inhalte zu erhöhen.',
    icon: <Lightbulb className="h-6 w-6 text-accent" />,
    path: '/resources/sources',
  },
  {
    title: 'Stilanalyse',
    description: 'Analysieren Sie den Stil Ihrer Inhalte und erhalten Sie Vorschläge zur Verbesserung.',
    icon: <LineChart className="h-6 w-6 text-purple-500" />,
    path: '/analysis',
  },
  {
    title: 'Recherche-Assistent',
    description: 'Lassen Sie den KI-Assistenten Recherchen zu Ihren Themen durchführen.',
    icon: <Search className="h-6 w-6 text-orange-500" />,
    path: '/research',
  },
  {
    title: 'SEO-Optimierung',
    description: 'Optimieren Sie Ihre Inhalte für Suchmaschinen und erhöhen Sie Ihre Sichtbarkeit.',
    icon: <Sparkles className="h-6 w-6 text-emerald-500" />,
    path: '/seo',
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { hasSeenTutorial, showTutorial, setHasSeenTutorial, setShowTutorial } = useTutorial();
  const [recentContents, setRecentContents] = useState<ContentCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generiere Aktivitäten basierend auf Inhalten
  const generateActivities = (contents: Content[]) => {
    const activities = [];
    
    for (const content of contents) {
      // Erstelle eine "erstellt" Aktivität
      activities.push({
        id: `created-${content.id}`,
        type: 'created' as const,
        contentTitle: content.title,
        contentType: content.type as 'blog' | 'linkedin',
        timestamp: `Vor ${getTimeAgo(new Date(content.created_at))}`
      });
      
      // Wenn die letzte Aktualisierung nach der Erstellung liegt, füge "aktualisiert" hinzu
      const createdAt = new Date(content.created_at).getTime();
      const updatedAt = new Date(content.updated_at).getTime();
      
      if (updatedAt > createdAt) {
        activities.push({
          id: `updated-${content.id}`,
          type: 'updated' as const,
          contentTitle: content.title,
          contentType: content.type as 'blog' | 'linkedin',
          timestamp: `Vor ${getTimeAgo(new Date(content.updated_at))}`
        });
      }
      
      // Wenn veröffentlicht, füge "abgeschlossen" hinzu
      if (content.status === 'published') {
        activities.push({
          id: `completed-${content.id}`,
          type: 'completed' as const,
          contentTitle: content.title,
          contentType: content.type as 'blog' | 'linkedin',
          timestamp: `Vor ${getTimeAgo(new Date(content.updated_at))}`
        });
      }
    }
    
    // Sortiere nach neustem Datum zuerst
    return activities.sort((a, b) => {
      const timeA = parseTimeAgo(a.timestamp);
      const timeB = parseTimeAgo(b.timestamp);
      return timeA - timeB;
    });
  };
  
  // Hilfsfunktion zum Parsen von "Vor X [Einheit]" zu Millisekunden
  const parseTimeAgo = (timeAgo: string) => {
    const match = timeAgo.match(/Vor\s+(\d+)\s+(\w+)/);
    if (!match) return 0;
    
    const [_, amount, unit] = match;
    const value = parseInt(amount);
    
    switch(unit) {
      case 'Minuten':
      case 'Minute':
        return value * 60 * 1000;
      case 'Stunden':
      case 'Stunde':
        return value * 60 * 60 * 1000;
      case 'Tagen':
      case 'Tag':
        return value * 24 * 60 * 60 * 1000;
      case 'Wochen':
      case 'Woche':
        return value * 7 * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  };
  
  // Hilfsfunktion zur Berechnung von "Vor X [Einheit]"
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    
    if (diffMins < 60) {
      return `${diffMins} Minuten`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} Stunden`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      return `${diffDays} Tagen`;
    }
    
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks} Wochen`;
  };

  // ContentCard-Daten aus Content-Objekten erstellen
  const mapContentsToCards = (contents: Content[]): ContentCardProps[] => {
    return contents.map(content => ({
      id: content.id,
      title: content.title,
      type: content.type,
      status: content.status === 'published' ? 'completed' as const : 'inprogress' as const,
      progress: content.status === 'published' ? 100 : 50, // Vereinfacht
      lastUpdated: `Vor ${getTimeAgo(new Date(content.updated_at))}`
    }));
  };

  useEffect(() => {
    if (!hasSeenTutorial) {
      setShowTutorial(true);
      setHasSeenTutorial(true);
    }
    
    // Lade Inhalte beim Start
    const fetchContents = async () => {
      setIsLoading(true);
      try {
        const contents = await getUserContents();
        // Sortiere nach letzter Aktualisierung
        contents.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        const cardProps = mapContentsToCards(contents);
        setRecentContents(cardProps);
      } catch (error) {
        console.error('Fehler beim Laden der Inhalte:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContents();
  }, [hasSeenTutorial, setHasSeenTutorial, setShowTutorial]);

  // Generiere Aktivitäten basierend auf den geladenen Inhalten
  const recentActivities = recentContents.length > 0 
    ? generateActivities(recentContents.map(card => ({
        id: card.id,
        title: card.title,
        type: card.type,
        status: card.status === 'completed' ? 'published' : 'draft',
        created_at: new Date().toISOString(), // Fallback
        updated_at: new Date().toISOString(), // Fallback
        user_id: '',
        content: '',
        description: ''
      })))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <TutorialDialog open={showTutorial} onOpenChange={setShowTutorial} />
      
      <main className="content-container max-w-7xl">
        {/* Hero Section */}
        <section className="mb-16 animate-fade-in">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-balance leading-tight">
              <span className="text-gradient">Willkommen zum KI-gestützten Blog-Autor</span>
            </h1>
            
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Erstellen Sie hochwertige Inhalte mit KI-Unterstützung und optimieren Sie Ihren Content-Workflow
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto button-primary"
                onClick={() => navigate('/create/blog')}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Blog-Artikel erstellen
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-secondary/30 text-secondary hover:bg-secondary/10 hover:text-secondary hover:border-secondary"
                onClick={() => navigate('/create/linkedin')}
              >
                <FileText className="mr-2 h-5 w-5" />
                LinkedIn-Post erstellen
              </Button>
            </div>
          </div>
        </section>

        {/* Content and Activity Sections */}
        <div className="grid grid-cols-1 gap-10 mb-16">
          {/* My Content Section */}
          <div className="w-full">
            <Card className="shadow-card bg-card overflow-hidden border-border/40 glassmorphism-enhanced">
              <div className="border-b border-border/20 bg-gradient-to-r from-primary/5 to-muted p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground mb-0">Meine Inhalte</h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/content')}
                    className="text-primary hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    Alle anzeigen
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-6 pt-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                ) : (
                  <ContentCarousel 
                    title="" 
                    items={recentContents}
                    seeAllLink="/content"
                  />
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Activities Section */}
          <div className="w-full">
            <Card className="shadow-card bg-card overflow-hidden border-border/40 glassmorphism-enhanced">
              <div className="border-b border-border/20 bg-gradient-to-r from-secondary/5 to-muted p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary/10 p-2 rounded-full">
                      <ChevronRight className="h-5 w-5 text-secondary" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-0 text-foreground">Aktivitäten</h2>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 pt-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                ) : (
                  <ActivityTimeline activities={recentActivities.slice(0, 4)} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gradient">Funktionen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, index) => (
              <Card 
                key={index} 
                className={cn(
                  "overflow-hidden hover-lift cursor-pointer border-border/30 glassmorphism-card",
                  index % 3 === 0 && "bg-soft-blue",
                  index % 3 === 1 && "bg-soft-purple",
                  index % 3 === 2 && "bg-soft-green"
                )}
                onClick={() => navigate(card.path)}
              >
                <div className="p-6">
                  <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/60 dark:bg-white/10 shadow-sm">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                  <p className="text-foreground/80 mb-5 leading-relaxed">
                    {card.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-primary hover:text-primary hover:bg-primary/10 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(card.path);
                    }}
                  >
                    <span>Öffnen</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
