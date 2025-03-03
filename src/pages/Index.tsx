
import React from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ContentCarousel from '@/components/content/ContentCarousel';
import ActivityTimeline from '@/components/activity/ActivityTimeline';
import Navbar from '@/components/layout/Navbar';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data for demo purposes
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16 mx-auto">
        {/* Hero Section */}
        <section className="mb-12 animate-fade-in">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="rounded-full bg-primary/5 text-primary w-fit mx-auto px-4 py-1 text-sm font-medium mb-4">
              KI-gestützter Content Generator
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Willkommen zum KI-gestützten Blog-Autor
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Erstellen Sie hochwertige Inhalte mit KI-Unterstützung
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/create/blog" className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Blog-Artikel erstellen
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link to="/create/linkedin" className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  LinkedIn-Post erstellen
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Content Section */}
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

        {/* Quick Access Feature */}
        <section className="rounded-xl border border-border bg-card p-6 md:p-8 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="bg-secondary/10 rounded-full p-4">
              <Sparkles className="h-8 w-8 text-secondary" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Probieren Sie die Stilanalyse</h3>
              <p className="text-muted-foreground mb-4">
                Lassen Sie Ihren Schreibstil analysieren, um bessere Inhalte zu erstellen.
              </p>
              
              <Button asChild variant="outline">
                <Link to="/analysis">Zu Stilanalyse</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
