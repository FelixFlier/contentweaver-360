
import React, { useState } from 'react';
import { Lightbulb, Plus, ExternalLink, Trash2, BookmarkIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Source = {
  id: string;
  title: string;
  url: string;
  author?: string;
  date?: string;
  type: 'article' | 'book' | 'study' | 'website';
  tags: string[];
};

const SourceManagement = () => {
  const [sources, setSources] = useState<Source[]>([
    {
      id: '1',
      title: 'KI im Content Marketing: Strategien für 2023',
      url: 'https://example.com/ai-content-marketing',
      author: 'Maria Schmidt',
      date: '15.03.2023',
      type: 'article',
      tags: ['KI', 'Marketing', 'Content']
    },
    {
      id: '2',
      title: 'Digitale Transformation: Herausforderungen und Chancen',
      url: 'https://example.com/digital-transformation',
      author: 'Thomas Weber',
      date: '22.05.2023',
      type: 'study',
      tags: ['Digital', 'Transformation', 'Business']
    },
    {
      id: '3',
      title: 'Content-Strategie für B2B-Unternehmen',
      url: 'https://example.com/b2b-content',
      author: 'Sarah Müller',
      date: '07.04.2023',
      type: 'article',
      tags: ['B2B', 'Strategie', 'Content']
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSource, setNewSource] = useState<Partial<Source>>({
    title: '',
    url: '',
    author: '',
    type: 'article',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [isAddingSource, setIsAddingSource] = useState(false);

  const handleAddSource = () => {
    if (!newSource.title || !newSource.url || !newSource.type) return;
    
    const source: Source = {
      id: Date.now().toString(),
      title: newSource.title,
      url: newSource.url,
      author: newSource.author || undefined,
      date: new Date().toLocaleDateString('de-DE'),
      type: newSource.type as 'article' | 'book' | 'study' | 'website',
      tags: newSource.tags || []
    };
    
    setSources([...sources, source]);
    setNewSource({
      title: '',
      url: '',
      author: '',
      type: 'article',
      tags: []
    });
    setIsAddingSource(false);
  };

  const handleAddTag = () => {
    if (!newTag.trim() || !newSource.tags) return;
    setNewSource({
      ...newSource,
      tags: [...(newSource.tags || []), newTag.trim()]
    });
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewSource({
      ...newSource,
      tags: (newSource.tags || []).filter(tag => tag !== tagToRemove)
    });
  };

  const handleRemoveSource = (id: string) => {
    setSources(sources.filter(source => source.id !== id));
  };

  const filteredSources = sources.filter(source =>
    source.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (source.author && source.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    source.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sourcesByType = {
    article: filteredSources.filter(source => source.type === 'article'),
    study: filteredSources.filter(source => source.type === 'study'),
    book: filteredSources.filter(source => source.type === 'book'),
    website: filteredSources.filter(source => source.type === 'website')
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16 mx-auto">
        <section className="mb-8 animate-fade-in">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <div className="gradient-border inline-block rounded-full bg-primary/5 text-primary px-4 py-1.5 text-sm font-medium mb-5">
              <span className="flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4" />
                Quellenmanagement
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-5 text-balance">
              <span className="text-gradient">Quellenmanagement</span>
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8">
              Verwalten Sie Ihre Quellen effizient und verbessern Sie die Glaubwürdigkeit Ihrer Inhalte
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="flex-1">
                <Input 
                  placeholder="Quellen durchsuchen..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Dialog open={isAddingSource} onOpenChange={setIsAddingSource}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Neue Quelle
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Neue Quelle hinzufügen</DialogTitle>
                    <DialogDescription>
                      Fügen Sie die Details Ihrer Quelle hinzu. Die URL ist wichtig für spätere Referenzen.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Titel</Label>
                      <Input
                        id="title"
                        placeholder="Titel der Quelle"
                        value={newSource.title || ''}
                        onChange={(e) => setNewSource({...newSource, title: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        placeholder="https://example.com"
                        value={newSource.url || ''}
                        onChange={(e) => setNewSource({...newSource, url: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="author">Autor (optional)</Label>
                      <Input
                        id="author"
                        placeholder="Name des Autors"
                        value={newSource.author || ''}
                        onChange={(e) => setNewSource({...newSource, author: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Typ</Label>
                      <Select
                        defaultValue={newSource.type || 'article'}
                        onValueChange={(value) => setNewSource({...newSource, type: value as any})}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Wählen Sie einen Typ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">Artikel</SelectItem>
                          <SelectItem value="book">Buch</SelectItem>
                          <SelectItem value="study">Studie</SelectItem>
                          <SelectItem value="website">Webseite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {newSource.tags && newSource.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button 
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 rounded-full hover:bg-destructive/10 p-0.5"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Neuer Tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <Button type="button" size="sm" onClick={handleAddTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingSource(false)}>Abbrechen</Button>
                    <Button onClick={handleAddSource} disabled={!newSource.title || !newSource.url}>
                      Hinzufügen
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Alle</TabsTrigger>
                <TabsTrigger value="article">Artikel ({sourcesByType.article.length})</TabsTrigger>
                <TabsTrigger value="study">Studien ({sourcesByType.study.length})</TabsTrigger>
                <TabsTrigger value="book">Bücher ({sourcesByType.book.length})</TabsTrigger>
                <TabsTrigger value="website">Webseiten ({sourcesByType.website.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {filteredSources.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Lightbulb className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                      <p className="text-muted-foreground text-center">
                        Keine Quellen gefunden. Erstellen Sie eine neue Quelle mit dem "Neue Quelle" Button.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredSources.map((source) => (
                      <SourceCard 
                        key={source.id} 
                        source={source} 
                        onRemove={handleRemoveSource} 
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {Object.entries(sourcesByType).map(([type, sources]) => (
                <TabsContent key={type} value={type}>
                  {sources.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Lightbulb className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                        <p className="text-muted-foreground text-center">
                          Keine {type === 'article' ? 'Artikel' : 
                                  type === 'study' ? 'Studien' : 
                                  type === 'book' ? 'Bücher' : 'Webseiten'} gefunden.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {sources.map((source) => (
                        <SourceCard 
                          key={source.id} 
                          source={source} 
                          onRemove={handleRemoveSource} 
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
};

// Source Card Component
const SourceCard = ({ source, onRemove }: { source: Source; onRemove: (id: string) => void }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">{source.title}</CardTitle>
            {source.author && (
              <CardDescription>
                {source.author} • {source.date}
              </CardDescription>
            )}
          </div>
          <Badge>
            {source.type === 'article' ? 'Artikel' : 
             source.type === 'study' ? 'Studie' : 
             source.type === 'book' ? 'Buch' : 'Webseite'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          {source.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
        <a 
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          {source.url}
        </a>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="ghost" size="sm" className="gap-1">
          <BookmarkIcon className="h-4 w-4" />
          Verwenden
        </Button>
        <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onRemove(source.id)}>
          <Trash2 className="h-4 w-4" />
          Löschen
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SourceManagement;
