import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Filter, 
  Plus, 
  Search, 
  Grid2X2, 
  List as ListIcon,
  FileText,
  Sparkles,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/layout/Navbar';
import ContentCard, { ContentCardProps } from '@/components/content/ContentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

type ContentType = 'all' | 'blog' | 'linkedin';
type ContentStatus = 'all' | 'inprogress' | 'feedback' | 'completed';
type ViewMode = 'grid' | 'list';

const ContentList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [typeFilter, setTypeFilter] = useState<ContentType>('all');
  const [statusFilter, setStatusFilter] = useState<ContentStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('contents');

  const mockContents: ContentCardProps[] = [
    {
      id: '1',
      title: 'Die Zukunft der KI im digitalen Marketing',
      type: 'blog',
      status: 'inprogress',
      progress: 45,
      lastUpdated: 'Vor 2 Stunden'
    },
    {
      id: '2',
      title: 'Warum Innovation der Schlüssel zum Erfolg ist',
      type: 'linkedin',
      status: 'feedback',
      progress: 75,
      lastUpdated: 'Gestern'
    },
    {
      id: '3',
      title: 'Beste Praktiken für Remote-Teams im Jahr 2023',
      type: 'blog',
      status: 'completed',
      progress: 100,
      lastUpdated: 'Vor 3 Tagen'
    },
    {
      id: '4',
      title: 'Die 5 wichtigsten Trends in der digitalen Transformation',
      type: 'blog',
      status: 'inprogress',
      progress: 30,
      lastUpdated: 'Vor 1 Tag'
    },
    {
      id: '5',
      title: '10 Tipps für erfolgreiches Content Marketing',
      type: 'blog',
      status: 'completed',
      progress: 100,
      lastUpdated: 'Vor 1 Woche'
    },
    {
      id: '6',
      title: 'Die Macht der Datenanalyse für Geschäftsentscheidungen',
      type: 'linkedin',
      status: 'inprogress',
      progress: 15,
      lastUpdated: 'Vor 4 Stunden'
    }
  ];

  const filteredContents = mockContents.filter(content => {
    const matchesType = typeFilter === 'all' || content.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const stats = {
    active: mockContents.filter(c => c.status !== 'completed').length,
    completed: mockContents.filter(c => c.status === 'completed').length,
    avgTime: '2.5 Tage'
  };

  const getWorkflowSteps = (type: 'blog' | 'linkedin') => {
    return type === 'blog' 
      ? ['Stilanalyse', 'Recherche', 'Planung', 'Schreiben', 'Faktenprüfung', 'Bearbeitung', 'SEO', 'Social'] 
      : ['Stilanalyse', 'Planung', 'Schreiben', 'Bearbeitung', 'Veröffentlichung'];
  };

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
          <h1 className="text-2xl font-bold text-gradient">Meine Inhalte</h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/analysis')}
              className="hidden md:flex border-primary/20 text-primary hover:text-primary hover:bg-primary/10"
            >
              <Sparkles className="h-4 w-4 mr-2" />
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="contents">Inhalte</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <TabsContent value="contents" className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Neueste Inhalte</h2>
            <Button 
              variant="link" 
              onClick={() => navigate('/all-contents')}
              className="text-primary flex items-center"
            >
              Alle anzeigen
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
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
              
              <div className="flex-1 md:flex-none">
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ContentType)}>
                  <SelectTrigger className="h-9 w-full md:w-[180px]">
                    <FileText className="h-4 w-4 mr-2" />
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
          
          {filteredContents.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
            }>
              {filteredContents.map(content => (
                viewMode === 'grid' ? (
                  <ContentCard key={content.id} {...content} />
                ) : (
                  <div 
                    key={content.id}
                    className="flex items-center bg-white rounded-lg border border-border shadow-card p-3 hover:shadow-lg transition-all"
                  >
                    <div className="mr-3">
                      <FileText 
                        className={content.type === 'blog' ? 'text-primary' : 'text-secondary'} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm truncate">{content.title}</h3>
                        <span 
                          className={`text-xs px-2 py-0.5 rounded-full flex items-center
                            ${content.status === 'inprogress' ? 'bg-status-inprogress/10 text-status-inprogress' : 
                            content.status === 'feedback' ? 'bg-status-feedback/10 text-status-feedback' : 
                            'bg-status-completed/10 text-status-completed'}`}
                        >
                          {content.status === 'feedback' && <MessageSquare className="h-3 w-3 mr-1" />}
                          {content.status === 'inprogress' ? 'In Arbeit' : 
                           content.status === 'feedback' ? 'Feedback benötigt' : 
                           'Abgeschlossen'}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {content.lastUpdated} • {content.type === 'blog' ? 'Blog-Artikel' : 'LinkedIn-Post'}
                      </div>
                      
                      <div className="w-full">
                        <Progress 
                          value={content.progress} 
                          className={`h-1.5 
                            ${content.status === 'inprogress' ? 'text-status-inprogress' : 
                             content.status === 'feedback' ? 'text-status-feedback' : 
                             'text-status-completed'}`}
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{content.progress}%</span>
                          {content.status !== 'completed' && (
                            <span className="text-xs text-primary">
                              {getWorkflowSteps(content.type)[Math.floor((content.progress / 100) * getWorkflowSteps(content.type).length)]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/edit/${content.type}/${content.id}`)}
                      className="ml-3 whitespace-nowrap"
                    >
                      {content.status === 'feedback' ? 'Feedback geben' : 'Fortsetzen'}
                    </Button>
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="bg-muted rounded-lg border border-border p-8 text-center">
              <p className="text-muted-foreground mb-4">Keine Inhalte gefunden</p>
              <Button onClick={() => navigate('/create/blog')}>
                Ersten Inhalt erstellen
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="dashboard" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-border shadow-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Aktive Inhalte</h3>
              <p className="text-3xl font-bold">{stats.active}</p>
            </div>
            
            <div className="bg-white rounded-lg border border-border shadow-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Abgeschlossene Inhalte</h3>
              <p className="text-3xl font-bold">{stats.completed}</p>
            </div>
            
            <div className="bg-white rounded-lg border border-border shadow-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Durchschnittliche Erstellungszeit</h3>
              <p className="text-3xl font-bold">{stats.avgTime}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-border shadow-card p-6">
            <h3 className="text-lg font-medium mb-4">Aktivitätsübersicht</h3>
            <div className="h-64 flex items-center justify-center border border-dashed border-muted rounded-md">
              <p className="text-muted-foreground">Aktivitätsdiagramm (Vereinfacht)</p>
            </div>
          </div>
        </TabsContent>
      </main>
    </div>
  );
};

export default ContentList;
