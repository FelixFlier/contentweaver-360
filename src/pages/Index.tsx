
import React, { useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  ChevronRight, 
  Search, 
  LineChart, 
  Plus
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
                <ContentCarousel 
                  title="" 
                  items={recentContents}
                  seeAllLink="/content"
                />
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
                <ActivityTimeline activities={recentActivities.slice(0, 4)} />
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
