
import React, { useState } from 'react';
import { TrendingUp, CheckCircle, AlertCircle, Sparkles, MoveUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/layout/Navbar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type SeoSuggestion = {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
};

const SeoOptimizer = () => {
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<SeoSuggestion[]>([]);

  // Mock suggestions
  const mockSuggestions: SeoSuggestion[] = [
    {
      id: '1',
      type: 'success',
      title: 'Gute Keyword-Dichte',
      description: 'Die Hauptkeywords werden in einer optimalen Häufigkeit verwendet.'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Meta-Beschreibung optimieren',
      description: 'Die Meta-Beschreibung könnte präziser formuliert werden, um mehr Klicks zu generieren.'
    },
    {
      id: '3',
      type: 'info',
      title: 'Interne Verlinkung',
      description: 'Fügen Sie mehr interne Links hinzu, um die Vernetzung und Autorität zu verbessern.'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Längere Überschriften',
      description: 'Ihre H2-Überschriften könnten etwas länger sein, um mehr Keywords zu enthalten.'
    },
    {
      id: '5',
      type: 'success',
      title: 'Gut strukturierter Content',
      description: 'Der Inhalt ist logisch gegliedert und leicht zu lesen.'
    }
  ];

  const handleAnalyze = () => {
    if (content.trim() === '') return;
    
    setIsAnalyzing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setSeoScore(78);
      setSuggestions(mockSuggestions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Sehr gut';
    if (score >= 60) return 'Gut';
    if (score >= 40) return 'Verbesserungswürdig';
    return 'Mangelhaft';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16 mx-auto">
        <section className="mb-8 animate-fade-in">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <div className="gradient-border inline-block rounded-full bg-primary/5 text-primary px-4 py-1.5 text-sm font-medium mb-5">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" />
                SEO Tools
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-5 text-balance">
              <span className="text-gradient">SEO Optimierer</span>
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8">
              Optimieren Sie Ihre Inhalte für Suchmaschinen und erreichen Sie bessere Rankings
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Inhalt analysieren</CardTitle>
                  <CardDescription>
                    Fügen Sie Ihren Text ein und geben Sie die Ziel-Keywords an
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Ziel-Keywords</label>
                    <Input 
                      placeholder="z.B. 'Content Marketing, KI, digitale Transformation'"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Inhalt</label>
                    <Textarea 
                      placeholder="Fügen Sie hier Ihren Inhalt ein..."
                      className="min-h-[300px]"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing || content.trim() === ''}
                    className="w-full"
                  >
                    {isAnalyzing ? 'Analysiere...' : 'SEO analysieren'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Score</CardTitle>
                  <CardDescription>
                    Bewertung der Suchmaschinenoptimierung
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {seoScore === null ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Fügen Sie Inhalt hinzu und starten Sie die Analyse</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <div className={`text-6xl font-bold ${getScoreColor(seoScore)}`}>
                          {seoScore}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {getScoreText(seoScore)}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Keyword-Optimierung</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Struktur</span>
                          <span>70%</span>
                        </div>
                        <Progress value={70} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Meta-Informationen</span>
                          <span>60%</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {suggestions.length > 0 && (
            <div className="max-w-4xl mx-auto mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>SEO-Verbesserungsvorschläge</CardTitle>
                  <CardDescription>
                    Basierend auf der Analyse Ihres Inhalts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {suggestions.map((suggestion) => (
                      <AccordionItem key={suggestion.id} value={suggestion.id}>
                        <AccordionTrigger className="flex items-center">
                          <div className="flex items-center">
                            {suggestion.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
                            {suggestion.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />}
                            {suggestion.type === 'info' && <MoveUp className="h-5 w-5 text-blue-500 mr-2" />}
                            {suggestion.title}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-7">
                          {suggestion.description}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2">
                    <Sparkles className="h-4 w-4" />
                    Automatisch optimieren
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SeoOptimizer;
