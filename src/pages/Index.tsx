
import React, { useEffect } from 'react';
import { FileText, Sparkles, BookOpen, Lightbulb, ChevronRight, Search, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ContentCarousel from '@/components/content/ContentCarousel';
import ActivityTimeline from '@/components/activity/ActivityTimeline';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import TutorialDialog from '@/components/tutorial/TutorialDialog';
import { useTutorial } from '@/hooks/use-tutorial';

const recentContents = [
  {
    id: '1',
    title: 'Die Zukunft der KI im digitalen Marketing',
    type: 'blog' as const,
    status: 'inprogress' as const,
    progress: 45,
    lastUpdated: 'Vor 2 Stunden'
  },
  {
    id: '2',
    title: 'Warum Innovation der Schlüssel zum Erfolg ist',
    type: 'linkedin' as const,
    status: 'feedback' as const,
    progress: 75,
    lastUpdated: 'Gestern'
  },
  {
    id: '3',
    title: 'Beste Praktiken für Remote-Teams im Jahr 2023',
    type: 'blog' as const,
    status: 'completed' as const,
    progress: 100,
    lastUpdated: 'Vor 3 Tagen'
  },
  {
    id: '4',
    title: 'Die 5 wichtigsten Trends in der digitalen Transformation',
    type: 'blog' as const,
    status: 'inprogress' as const,
    progress: 30,
    lastUpdated: 'Vor 1 Tag'
  }
];

const recentActivities = [
  {
    id: '1',
    type: 'feedback' as const,
    contentTitle: 'Warum Innovation der Schlüssel zum Erfolg ist',
    contentType: 'linkedin' as const,
    timestamp: 'Vor 1 Stunde'
  },
  {
    id: '2',
    type: 'updated' as const,
    contentTitle: 'Die Zukunft der KI im digitalen Marketing',
    contentType: 'blog' as const,
    timestamp: 'Vor 2 Stunden'
  },
  {
    id: '3',
    type: 'created' as const,
    contentTitle: 'Die 5 wichtigsten Trends in der digitalen Transformation',
    contentType: 'blog' as const,
    timestamp: 'Vor 1 Tag'
  },
  {
    id: '4',
    type: 'completed' as const,
    contentTitle: 'Beste Praktiken für Remote-Teams im Jahr 2023',
    contentType: 'blog' as const,
    timestamp: 'Vor 3 Tagen'
  },
  {
    id: '5',
    type: 'created' as const,
    contentTitle: 'Warum Innovation der Schlüssel zum Erfolg ist',
    contentType: 'linkedin' as const,
    timestamp: 'Vor 4 Tagen'
  }
];

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

  useEffect(() => {
    if (!hasSeenTutorial) {
      setShowTutorial(true);
      setHasSeenTutorial(true);
    }
  }, [hasSeenTutorial, setHasSeenTutorial, setShowTutorial]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <TutorialDialog open={showTutorial} onOpenChange={setShowTutorial} />
      
      <main className="container px-4 pt-20 pb-16 mx-auto">
        <section className="mb-10 animate-fade-in">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-5 text-balance">
              <span className="text-gradient">Willkommen zum KI-gestützten Blog-Autor</span>
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Erstellen Sie hochwertige Inhalte mit KI-Unterstützung und optimieren Sie Ihren Content-Workflow
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                onClick={() => navigate('/create/blog')}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Blog-Artikel erstellen
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => navigate('/create/linkedin')}
              >
                <FileText className="mr-2 h-5 w-5" />
                LinkedIn-Post erstellen
              </Button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 mb-12">
          <div className="w-full">
            <Card className="shadow-sm bg-card glassmorphism-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Meine Inhalte</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/content')}
                    className="text-primary"
                  >
                    Alle anzeigen
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                
                <ContentCarousel 
                  title="" 
                  items={recentContents}
                  seeAllLink="/content"
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full">
            <Card className="shadow-sm bg-card glassmorphism-enhanced">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6 text-foreground">Aktivitäten</h2>
                <ActivityTimeline activities={recentActivities.slice(0, 4)} />
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featureCards.map((card, index) => (
            <Card 
              key={index} 
              className="p-6 hover-lift glassmorphism-enhanced cursor-pointer"
              onClick={() => navigate(card.path)}
            >
              <div className="mb-4 bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
              <p className="text-muted-foreground mb-5">
                {card.description}
              </p>
              <Button 
                variant="ghost" 
                className="text-primary flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(card.path);
                }}
              >
                Öffnen
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Index;
