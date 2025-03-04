import React from 'react';
import { FileText, Sparkles, BookOpen, Lightbulb, ChevronRight, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ContentCarousel from '@/components/content/ContentCarousel';
import ActivityTimeline from '@/components/activity/ActivityTimeline';
import Navbar from '@/components/layout/Navbar';
import { useIsMobile } from '@/hooks/use-mobile';

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

const Index = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16 mx-auto">
        {/* Hero Section - modernisiert */}
        <section className="mb-16 animate-fade-in">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="gradient-border inline-block rounded-full bg-primary/5 text-primary px-4 py-1.5 text-sm font-medium mb-5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                KI-gestützter Content Generator
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-5 text-balance relative">
              <span className="text-gradient">Willkommen zum KI-gestützten Blog-Autor</span>
              <div className="absolute -top-6 -right-12 w-16 h-16 bg-primary/5 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -bottom-4 -left-8 w-20 h-20 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
            </h1>
            
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              Erstellen Sie hochwertige Inhalte mit KI-Unterstützung und optimieren Sie Ihren Content-Workflow
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto button-glow bg-gradient-to-r from-primary to-primary/90"
                onClick={() => navigate('/create/blog')}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Blog-Artikel erstellen
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-2"
                onClick={() => navigate('/create/linkedin')}
              >
                <FileText className="mr-2 h-5 w-5" />
                LinkedIn-Post erstellen
              </Button>
            </div>
          </div>
          
          {/* Content Section - verbessert */}
          <div className="w-full mb-12 animate-slide-in">
            <ContentCarousel 
              title="Aktuelle Inhalte" 
              items={recentContents}
              seeAllLink="/content"
            />
          </div>
          
          {/* Activity Timeline */}
          <div className="w-full max-w-2xl mx-auto animate-slide-in">
            <ActivityTimeline activities={recentActivities} />
          </div>
        </section>

        {/* Feature Cards - Updated with Research and SEO Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-modern p-6 hover:shadow-lg transition-all duration-300">
            <div className="mb-4 bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Stilanalyse</h3>
            <p className="text-muted-foreground mb-5">
              Lassen Sie Ihren Schreibstil analysieren, um bessere Inhalte zu erstellen und konsistent zu bleiben.
            </p>
            <Button 
              variant="ghost" 
              className="text-primary flex items-center gap-2"
              onClick={() => navigate('/analysis')}
            >
              Zu Stilanalyse
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="card-modern p-6 hover:shadow-lg transition-all duration-300">
            <div className="mb-4 bg-secondary/10 w-12 h-12 flex items-center justify-center rounded-full">
              <Search className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Research Agent</h3>
            <p className="text-muted-foreground mb-5">
              Nutzen Sie KI-gestützte Recherche, um fundierte Argumente und aktuelle Daten für Ihre Inhalte zu finden.
            </p>
            <Button 
              variant="ghost" 
              className="text-secondary flex items-center gap-2"
              onClick={() => navigate('/research')}
            >
              Zu Research
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="card-modern p-6 hover:shadow-lg transition-all duration-300">
            <div className="mb-4 bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">SEO Optimierer</h3>
            <p className="text-muted-foreground mb-5">
              Optimieren Sie Ihre Inhalte für Suchmaschinen und verbessern Sie Ihre Rankings mit datengestützten Empfehlungen.
            </p>
            <Button 
              variant="ghost" 
              className="text-primary flex items-center gap-2"
              onClick={() => navigate('/seo')}
            >
              Zu SEO
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
