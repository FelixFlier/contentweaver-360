
import React, { useState } from 'react';
import { Search, BookOpen, FileCheck, BookmarkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import { Badge } from '@/components/ui/badge';

const ResearchAgent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Mock research results
  const mockResults = [
    {
      id: '1',
      title: 'KI im Marketing: Eine Analyse der aktuellen Trends',
      source: 'Wirtschaftswoche',
      date: '12.05.2023',
      excerpt: 'Die Studie zeigt, dass 78% der Unternehmen KI-Tools für Content-Erstellung nutzen...',
      type: 'article',
      url: '#'
    },
    {
      id: '2',
      title: 'Statistiken zur digitalen Transformation 2023',
      source: 'Statista',
      date: '03.07.2023',
      excerpt: 'Die digitale Transformation hat in den letzten zwei Jahren um 45% zugenommen...',
      type: 'statistics',
      url: '#'
    },
    {
      id: '3',
      title: 'Zukunftstrends im Content Marketing',
      source: 'Marketing Journal',
      date: '21.03.2023',
      excerpt: 'Personalisierung und KI-generierte Inhalte dominieren die Content-Strategien von Vorreitern...',
      type: 'article',
      url: '#'
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim() === '') return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16 mx-auto">
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
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recherche starten</CardTitle>
                <CardDescription>
                  Geben Sie ein Thema oder eine Frage ein, zu der Sie recherchieren möchten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input 
                    placeholder="z.B. 'KI im Marketing' oder 'Aktuelle Statistiken zur digitalen Transformation'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSearch} 
                    disabled={isSearching || searchQuery.trim() === ''}
                  >
                    {isSearching ? 'Suche läuft...' : 'Suchen'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {isSearching && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-pulse text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
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
                      <Card key={result.id} className="hover:shadow-md transition-shadow">
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
                          <Button variant="ghost" size="sm" className="gap-1">
                            <BookOpen className="h-4 w-4" />
                            Lesen
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
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
                        <Card key={result.id} className="hover:shadow-md transition-shadow">
                          {/* Same card structure as above */}
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
                            <Button variant="ghost" size="sm" className="gap-1">
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
                        <Card key={result.id} className="hover:shadow-md transition-shadow">
                          {/* Same card structure as above */}
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
                            <Button variant="ghost" size="sm" className="gap-1">
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
