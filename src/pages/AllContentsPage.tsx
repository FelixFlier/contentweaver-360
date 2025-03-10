// src/pages/AllContentsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Filter, Plus, Search, Grid2X2, List as ListIcon, ChevronDown, Loader2 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import ContentCard, { ContentCardProps } from '@/components/content/ContentCard';
import Navbar from '@/components/layout/Navbar';
import { getUserContents, Content } from '@/services/contentService';

type ContentType = 'all' | 'blog' | 'linkedin';
type ContentStatus = 'all' | 'inprogress' | 'feedback' | 'completed';
type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'progress';

const AllContentsPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [typeFilter, setTypeFilter] = useState<ContentType>('all');
  const [statusFilter, setStatusFilter] = useState<ContentStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState<Content[]>([]);
  
  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      try {
        const data = await getUserContents();
        setContents(data);
      } catch (error) {
        console.error('Error fetching contents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContents();
  }, []);

  // Map contents to ContentCardProps
  const mapToContentCard = (content: Content): ContentCardProps => {
    // Map status from content.status ('draft'/'published') to ContentCardProps status
    let status: 'inprogress' | 'feedback' | 'completed' = 'inprogress';
    if (content.status === 'published') {
      status = 'completed';
    }
    
    return {
      id: content.id,
      title: content.title,
      type: content.type,
      status: status,
      progress: content.status === 'published' ? 100 : 50, // Vereinfacht
      lastUpdated: new Date(content.updated_at).toLocaleDateString('de-DE')
    };
  };

  // Filter and sort content
  const filteredContents = contents
    .filter(content => {
      const matchesType = typeFilter === 'all' || content.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'completed' && content.status === 'published') || 
                           (statusFilter === 'inprogress' && content.status === 'draft');
      const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesType && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'oldest':
          return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'progress':
          if (a.status === 'published' && b.status !== 'published') return -1;
          if (a.status !== 'published' && b.status === 'published') return 1;
          return 0;
        default:
          return 0;
      }
    });

  const contentCards = filteredContents.map(mapToContentCard);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16 mx-auto max-w-6xl">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6 text-primary hover:text-primary/80 hover:bg-primary/10"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gradient">Alle Inhalte</h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/analysis')}
              className="hidden md:flex border-primary/20 text-primary hover:text-primary hover:bg-primary/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Stilanalyse
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/create/linkedin')}
              className="border-secondary/20 text-secondary hover:text-secondary hover:bg-secondary/10"
            >
              <Plus className="h-4 w-4 mr-1" />
              LinkedIn-Post
            </Button>
            
            <Button 
              onClick={() => navigate('/create/blog')}
              className="bg-gradient-primary text-white hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-1" />
              Blog-Artikel
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-cool p-6 rounded-lg mb-8 shadow-md animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Inhaltsverwaltung</h2>
              <p className="text-sm text-foreground/80">Verwalten Sie Ihre Inhalte an einem Ort</p>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-medium bg-white/30 text-foreground px-3 py-1 rounded-full">
                {filteredContents.length} Inhalte
              </span>
              <span className="text-sm font-medium bg-accent/20 text-accent-foreground px-3 py-1 rounded-full">
                {contents.filter(c => c.status === 'published').length} Abgeschlossen
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button 
                size="sm" 
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Sortieren: {sortBy === 'newest' ? 'Neueste' : 
                              sortBy === 'oldest' ? 'Älteste' : 
                              sortBy === 'alphabetical' ? 'A-Z' : 
                              'Fortschritt'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('newest')}>
                  Neueste zuerst
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                  Älteste zuerst
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
                  Alphabetisch (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('progress')}>
                  Nach Fortschritt
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex-1 md:flex-none">
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ContentType)}>
                <SelectTrigger className="h-9 w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Typ filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Typen</SelectItem>
                  <SelectItem value="blog">Blog-Artikel</SelectItem>
                  <SelectItem value="linkedin">LinkedIn-Posts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 md:flex-none">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ContentStatus)}>
                <SelectTrigger className="h-9 w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="inprogress">In Arbeit</SelectItem>
                  <SelectItem value="feedback">Feedback benötigt</SelectItem>
                  <SelectItem value="completed">Abgeschlossen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Suchen..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 w-full md:w-[260px]"
              />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="recent">Kürzlich bearbeitet</TabsTrigger>
            <TabsTrigger value="favorite">Favoriten</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : contentCards.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
              }>
                {contentCards.map(content => (
                  <ContentCard key={content.id} {...content} />
                ))}
              </div>
            ) : (
              <div className="bg-muted rounded-lg border border-border p-8 text-center">
                <p className="text-muted-foreground mb-4">Keine Inhalte gefunden</p>
                <Button onClick={() => navigate('/create/blog')} className="bg-gradient-primary text-white">
                  Ersten Inhalt erstellen
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
              }>
                {contentCards.slice(0, 3).map(content => (
                  <ContentCard key={content.id} {...content} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorite" className="mt-4">
            <div className="bg-muted rounded-lg border border-border p-8 text-center">
              <p className="text-muted-foreground mb-4">Keine Favoriten vorhanden</p>
              <Button variant="outline" onClick={() => {}} className="border-primary/20 text-primary">
                Inhalte als Favorit markieren
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AllContentsPage;
