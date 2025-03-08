import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Save, 
  MessageSquare, 
  Eye, 
  ChartBar, 
  BookOpen, 
  List, 
  Pen, 
  ShieldCheck, 
  Edit, 
  Target, 
  Share,
  Loader2,
  Upload,
  Trash2,
  Paperclip
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import StepIndicator from '@/components/workflow/StepIndicator';
import { getContentById, updateContent } from '@/services/contentService';
import { useAuth } from '@/contexts/AuthContext';
import { 
  uploadFile, 
  getContentFiles, 
  getFileUrl, 
  deleteFile, 
  FileRecord,
  subscribeToFiles 
} from '@/services/fileService';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';

const blogWorkflowSteps = [
  { id: 'style-analysis', label: 'Stilanalyse', description: 'Analyse und Anpassung des Schreibstils' },
  { id: 'research', label: 'Recherche', description: 'Sammlung und Bewertung von Quellen' },
  { id: 'planning', label: 'Planung', description: 'Gliederung und Strukturierung des Inhalts' },
  { id: 'writing', label: 'Schreiben', description: 'Erstellung des Inhalts' },
  { id: 'fact-check', label: 'Faktenprüfung', description: 'Überprüfung der Fakten und Quellen' },
  { id: 'editing', label: 'Bearbeitung', description: 'Korrekturlesen und Verbesserung' },
  { id: 'seo', label: 'SEO-Optimierung', description: 'Anpassung für Suchmaschinen' },
  { id: 'social', label: 'Social Media', description: 'Vorbereitung für Social Media' },
];

const linkedinWorkflowSteps = [
  { id: 'style-analysis', label: 'Stilanalyse', description: 'Analyse und Anpassung des Schreibstils' },
  { id: 'planning', label: 'Planung', description: 'Gliederung und Strukturierung des Inhalts' },
  { id: 'writing', label: 'Schreiben', description: 'Erstellung des Inhalts' },
  { id: 'editing', label: 'Bearbeitung', description: 'Korrekturlesen und Verbesserung' },
  { id: 'publishing', label: 'Veröffentlichung', description: 'Vorbereitung zur Veröffentlichung' },
];

const getStepIcon = (stepId: string) => {
  switch (stepId) {
    case 'style-analysis':
      return <ChartBar className="h-5 w-5" />;
    case 'research':
      return <BookOpen className="h-5 w-5" />;
    case 'planning':
      return <List className="h-5 w-5" />;
    case 'writing':
      return <Pen className="h-5 w-5" />;
    case 'fact-check':
      return <ShieldCheck className="h-5 w-5" />;
    case 'editing':
      return <Edit className="h-5 w-5" />;
    case 'seo':
      return <Target className="h-5 w-5" />;
    case 'social':
    case 'publishing':
      return <Share className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const EditBlog = () => {
  const { id } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const contentType = window.location.pathname.includes('linkedin') ? 'linkedin' : 'blog';
  
  const [content, setContent] = useState<any>(null);
  const [contentText, setContentText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isChangingPhase, setIsChangingPhase] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  
  const workflowSteps = contentType === 'blog' ? blogWorkflowSteps : linkedinWorkflowSteps;

  useEffect(() => {
    const fetchContent = async () => {
      if (user && id) {
        setIsLoading(true);
        const contentData = await getContentById(id);
        
        if (contentData) {
          setContent(contentData);
          setContentText(contentData.content || '');
          
          const contentFiles = await getContentFiles(id);
          setFiles(contentFiles);
        } else {
          toast.error('Inhalt nicht gefunden');
          navigate('/content');
        }
        
        setIsLoading(false);
      }
    };
    
    fetchContent();
    
    let unsubscribe: () => void;
    if (id) {
      unsubscribe = subscribeToFiles(id, (payload) => {
        console.log('Realtime file update:', payload);
        const { eventType, new: newRecord, old: oldRecord } = payload;
        
        switch (eventType) {
          case 'INSERT':
            setFiles(prev => [...prev, newRecord as FileRecord]);
            break;
          case 'UPDATE':
            setFiles(prev => prev.map(file => 
              file.id === newRecord.id ? (newRecord as FileRecord) : file
            ));
            break;
          case 'DELETE':
            if (oldRecord) {
              setFiles(prev => prev.filter(file => file.id !== oldRecord.id));
            }
            break;
        }
      });
    }
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, id, navigate]);

  const handleSave = async () => {
    if (!content) return;
    
    setIsSaving(true);
    
    const updated = await updateContent(content.id, {
      content: contentText
    });
    
    if (updated) {
      setContent(updated);
    }
    
    setIsSaving(false);
  };

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      toast.error("Bitte geben Sie Ihr Feedback ein");
      return;
    }
    
    setIsSubmittingFeedback(true);
    
    setTimeout(() => {
      setIsChangingPhase(true);
      
      setTimeout(() => {
        toast.success("Feedback gesendet");
        setActiveTab('editor');
        setFeedback('');
        setIsSubmittingFeedback(false);
        
        updateContent(content.id, {
          status: 'published'
        }).then(updated => {
          if (updated) {
            setContent(updated);
          }
        });
        
        setIsChangingPhase(false);
      }, 500);
    }, 1000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && content) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Datei zu groß (Maximalgröße: 5MB)");
        return;
      }
      
      setIsUploadingFile(true);
      
      const uploaded = await uploadFile({
        file,
        content_id: content.id
      });
      
      if (uploaded) {
        setFiles(prev => [...prev, uploaded]);
      }
      
      setIsUploadingFile(false);
      
      e.target.value = '';
    }
  };

  const handleDeleteFile = async (file: FileRecord) => {
    if (window.confirm(`Möchten Sie die Datei "${file.name}" wirklich löschen?`)) {
      const deleted = await deleteFile(file.id, file.path);
      
      if (deleted) {
        setFiles(prev => prev.filter(f => f.id !== file.id));
      }
    }
  };

  const handleOpenFile = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container px-4 pt-24 pb-16 mx-auto">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Anmeldung erforderlich</h1>
              <p className="text-muted-foreground mb-6">Sie müssen angemeldet sein, um Inhalte zu bearbeiten.</p>
              <Button onClick={() => navigate('/')}>Zurück zur Startseite</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading || !content) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container px-4 pt-24 pb-16 mx-auto">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Inhalte werden geladen...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className={`container px-4 pt-24 pb-16 mx-auto ${isChangingPhase ? 'opacity-50 transition-opacity duration-500' : 'opacity-100 transition-opacity duration-500'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/content')}
              className="mr-2 button-glow"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Zurück
            </Button>
            
            <div className={`p-2 rounded-full ${contentType === 'blog' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
              <FileText className={`h-5 w-5 ${contentType === 'blog' ? 'text-primary' : 'text-secondary'}`} />
            </div>
            
            <h1 className="text-xl font-bold truncate">{content.title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {content.status === 'draft' && (
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('feedback')}
                className="flex items-center button-share"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedback geben
              </Button>
            )}
            
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex items-center button-save shimmer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Wird gespeichert...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Speichern
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="mb-8">
          <StepIndicator 
            steps={workflowSteps}
            currentStep={content.status === 'published' ? 'social' : 'writing'}
            completedSteps={content.status === 'published' ? ['style-analysis', 'research', 'planning', 'writing', 'fact-check', 'editing', 'seo'] : ['style-analysis', 'research', 'planning']}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="editor" className="flex items-center gap-1.5">
              <Pen className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              Vorschau
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-1.5">
              <Paperclip className="h-4 w-4" />
              Dateien
            </TabsTrigger>
            {content.status === 'draft' && (
              <TabsTrigger value="feedback" className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                Feedback
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="editor" className="animate-fade-in">
            <div className="bg-card border border-border rounded-lg shadow-sm card-shadow p-4 md:p-6 dark:bg-card">
              <div className="flex items-center mb-4 gap-2 text-muted-foreground">
                <div className="p-2 bg-primary/10 rounded-full">
                  {getStepIcon(content.status === 'published' ? 'social' : 'writing')}
                </div>
                <div>
                  <h3 className="font-medium">
                    {content.status === 'published' 
                      ? (contentType === 'blog' ? 'Veröffentlichung' : 'Veröffentlichung') 
                      : 'Schreiben'}
                  </h3>
                  <p className="text-sm">
                    {content.status === 'published' 
                      ? 'Ihr Inhalt ist veröffentlicht und kann geteilt werden' 
                      : 'Erstellen Sie den Inhalt Ihres Beitrags'}
                  </p>
                </div>
              </div>
              <Textarea
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Beginnen Sie mit dem Schreiben..."
                className="min-h-[400px] font-medium"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="animate-fade-in">
            <div className="bg-card border border-border rounded-lg shadow-sm card-shadow p-4 md:p-6 prose max-w-none dark:bg-card">
              <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: contentText.replace(/\n/g, '<br>') }} />
            </div>
          </TabsContent>
          
          <TabsContent value="files" className="animate-fade-in">
            <div className="bg-card border border-border rounded-lg shadow-sm card-shadow p-4 md:p-6 dark:bg-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Dateien und Anhänge</h3>
                <Label 
                  htmlFor="file-upload" 
                  className={`cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${isUploadingFile ? 'opacity-70' : ''}`}
                >
                  {isUploadingFile ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Wird hochgeladen...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Datei hochladen
                    </>
                  )}
                  <Input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    disabled={isUploadingFile}
                  />
                </Label>
              </div>
              
              {files.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {files.map((file) => (
                    <Card key={file.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-start p-4">
                          <div className="p-2 bg-primary/10 rounded-md mr-4">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{file.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB • {new Date(file.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>{file.name}</DialogTitle>
                                  <DialogDescription>
                                    Hochgeladen am {new Date(file.created_at).toLocaleDateString()}
                                  </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="h-[600px] rounded-md border p-4">
                                  {file.type.startsWith('image/') ? (
                                    <img 
                                      src={getFileUrl(file.path)} 
                                      alt={file.name} 
                                      className="max-w-full" 
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center p-8">
                                      <div className="text-center">
                                        <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                                        <h3 className="font-medium mb-2">{file.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                          {file.type} • {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                        <Button 
                                          onClick={() => handleOpenFile(getFileUrl(file.path))}
                                        >
                                          Datei öffnen
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-full h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteFile(file)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Paperclip className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="text-lg font-medium mb-1">Keine Dateien</h3>
                  <p className="text-muted-foreground">
                    Laden Sie Dateien hoch, um sie Ihrem Inhalt hinzuzufügen
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {content.status === 'draft' && (
            <TabsContent value="feedback" className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/50 border border-border rounded-lg p-4 md:p-6 dark:bg-muted/10">
                  <h3 className="text-lg font-semibold mb-3">Inhalt zur Überprüfung</h3>
                  <div className="prose max-w-none">
                    <h4 className="text-xl font-bold mb-2">{content.title}</h4>
                    <div dangerouslySetInnerHTML={{ __html: contentText.replace(/\n/g, '<br>') }} />
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-lg shadow-sm card-shadow p-4 md:p-6 dark:bg-card">
                  <h3 className="text-lg font-semibold mb-3">Ihr Feedback</h3>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Geben Sie Ihr Feedback zum Inhalt ein..."
                    className="min-h-[200px] mb-4"
                  />
                  
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('editor')}
                      className="button-glow"
                    >
                      Zurück
                    </Button>
                    
                    <Button 
                      onClick={handleSubmitFeedback} 
                      disabled={isSubmittingFeedback}
                      className="button-save shimmer bg-gradient-to-r from-primary to-secondary text-white"
                    >
                      {isSubmittingFeedback ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Wird gesendet...
                        </>
                      ) : (
                        'Feedback senden'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default EditBlog;
