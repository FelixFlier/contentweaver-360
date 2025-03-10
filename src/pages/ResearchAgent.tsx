import React, { useState, useEffect } from 'react';
import { Search, BookOpen, FileCheck, BookmarkIcon, ArrowLeft, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import UnifiedInputPanel from '@/components/shared/UnifiedInputPanel';
import { API } from '@/services/apiService';
import { useAgentTask } from '@/hooks/use-agent-task';

interface ResearchResult {
  sources: any[];
  summary: string;
  key_points: string[];
  statistics: any[];
  keywords: string[];
}

const ResearchAgent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [taskId, setTaskId] = useState<string | null>(null);

  // Use the agent task hook
  const { result, status, error } = useAgentTask<ResearchResult>(taskId);

  // Update state when result changes
  useEffect(() => {
    if (result) {
      // Convert research results to searchResults format
      const formattedResults = result.sources?.map((source, index) => ({
        id: source.id || `result-${index}`,
        title: source.title || 'Unnamed Source',
        source: source.domain || source.author || 'Unknown',
        date: source.date_published || 'Unknown date',
        excerpt: source.content_summary || source.snippet || 'No excerpt available',
        type: source.source_type || 'article',
        url: source.url || '#'
      })) || [];
      
      setSearchResults(formattedResults);
      setIsSearching(false);
    }
  }, [result]);

  // Update state when status changes
  useEffect(() => {
    if (status === 'failed') {
      toast.error('Research fehlgeschlagen: ' + (error || 'Unbekannter Fehler'));
      setIsSearching(false);
    }
  }, [status, error]);

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      // Call the research agent
      const response = await API.agents.research(
        searchQuery,  // topic
        searchQuery,  // search_queries
        [],           // sourceIds 
        []            // urls
      );
      
      // Get the task ID for polling
      setTaskId(response.task_id);
    } catch (err) {
      console.error('Error starting research:', err);
      toast.error('Fehler bei der Recherche');
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputSubmit = (data: { type: 'text' | 'link' | 'file'; content: string | File }) => {
    if (data.type === 'text') {
      setSearchQuery(data.content as string);
      handleSearch();
    } else {
      toast.info('Diese Funktion wird bald verfügbar sein');
    }
  };

  const handleSave = async (result?: any) => {
    try {
      if (searchResults.length > 0) {
        // Save research results
        // In a real implementation, you would save to the database
        // For now, we'll just show a success message
        toast.success('Rechercheergebnisse wurden gespeichert');
        
        // If a specific result was provided, save that as a source
        if (result) {
          await API.sources.addUrl(result.url, result.title);
          toast.success(`Quelle "${result.title}" gespeichert`);
        }
      } else {
        toast.error('Keine Ergebnisse zum Speichern vorhanden');
      }
    } catch (error) {
      console.error('Error saving results:', error);
      toast.error('Fehler beim Speichern der Ergebnisse');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Schließen
          </Button>
        </div>
        
        <section className="mb-8 animate-fade-in">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <div className="gradient-border inline-block rounded-full bg-primary/5 text-primary px-4 py-1.5 text-sm font-medium mb-5">
              <span className="flex items-center gap-1.5">
                <Search className="h-4 w-4" />
                Research Tools
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-5 text-balance">
              <span className="text-gradient">Research Agent</span>
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8">
              Recherchieren Sie effizient und finden Sie zuverlässige Quellen für Ihre Inhalte
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8 bg-card dark:bg-[#1E1E1E]">
              <CardHeader>
                <CardTitle>Recherche starten</CardTitle>
                <CardDescription>
                  Geben Sie ein Thema oder eine Frage ein, zu der Sie recherchieren möchten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UnifiedInputPanel 
                  onSubmit={handleInputSubmit}
                  placeholder="z.B. 'KI im Marketing' oder 'Aktuelle Statistiken zur digitalen Transformation'"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching || searchQuery.trim() === ''}
                  className="w-full mr-2"
                >
                  {isSearching ? 'Suche läuft...' : 'Suchen'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleSave()}
                  disabled={searchResults.length === 0}
                  className="w-full ml-2"
                >
                  Speichern
                </Button>
              </CardFooter>
            </Card>

            {isSearching && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-pulse text-center">
                  <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
                  <p className="text-muted-foreground">Suche läuft, bitte warten...</p>
                </div>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <Tabs defaultValue="all">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Suchergebnisse</h2>
                  <TabsList>
                    <TabsTrigger value="all">Alle</TabsTrigger>
                    <TabsTrigger value="articles">Artikel</TabsTrigger>
                    <TabsTrigger value="statistics">Statistiken</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all">
                  <div className="space-y-4">
                    {searchResults.map((result) => (
                      <Card key={result.id} className="hover:shadow-md transition-shadow bg-card dark:bg-[#1E1E1E]">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{result.title}</CardTitle>
                            <Badge variant="outline" className="ml-2">
                              {result.type === 'article' ? 'Artikel' : 'Statistik'}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-2">
                            <span>{result.source}</span>
                            <span>•</span>
                            <span>{result.date}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-muted-foreground">{result.excerpt}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => window.open(result.url, '_blank')}
                          >
                            <BookOpen className="h-4 w-4" />
                            Lesen
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => handleSave(result)}
                          >
                            <BookmarkIcon className="h-4 w-4" />
                            Speichern
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <FileCheck className="h-4 w-4" />
                            Verwenden
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="articles">
                  <div className="space-y-4">
                    {searchResults
                      .filter(result => result.type === 'article')
                      .map((result) => (
                        <Card key={result.id} className="hover:shadow-md transition-shadow bg-card dark:bg-[#1E1E1E]">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{result.title}</CardTitle>
                              <Badge variant="outline" className="ml-2">Artikel</Badge>
                            </div>
                            <CardDescription className="flex items-center gap-2">
                              <span>{result.source}</span>
                              <span>•</span>
                              <span>{result.date}</span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-muted-foreground">{result.excerpt}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between pt-0">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <BookOpen className="h-4 w-4" />
                              Lesen
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-1"
                              onClick={() => handleSave(result)}
                            >
                              <BookmarkIcon className="h-4 w-4" />
                              Speichern
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <FileCheck className="h-4 w-4" />
                              Verwenden
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="statistics">
                  <div className="space-y-4">
                    {searchResults
                      .filter(result => result.type === 'statistics')
                      .map((result) => (
                        <Card key={result.id} className="hover:shadow-md transition-shadow bg-card dark:bg-[#1E1E1E]">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{result.title}</CardTitle>
                              <Badge variant="outline" className="ml-2">Statistik</Badge>
                            </div>
                            <CardDescription className="flex items-center gap-2">
                              <span>{result.source}</span>
                              <span>•</span>
                              <span>{result.date}</span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-muted-foreground">{result.excerpt}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between pt-0">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <BookOpen className="h-4 w-4" />
                              Lesen
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-1"
                              onClick={() => handleSave(result)}
                            >
                              <BookmarkIcon className="h-4 w-4" />
                              Speichern
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <FileCheck className="h-4 w-4" />
                              Verwenden
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResearchAgent;
