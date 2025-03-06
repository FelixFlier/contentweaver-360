
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
  Share 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import StepIndicator from '@/components/workflow/StepIndicator';

// Blog workflow steps with icons
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

// LinkedIn workflow steps with icons
const linkedinWorkflowSteps = [
  { id: 'style-analysis', label: 'Stilanalyse', description: 'Analyse und Anpassung des Schreibstils' },
  { id: 'planning', label: 'Planung', description: 'Gliederung und Strukturierung des Inhalts' },
  { id: 'writing', label: 'Schreiben', description: 'Erstellung des Inhalts' },
  { id: 'editing', label: 'Bearbeitung', description: 'Korrekturlesen und Verbesserung' },
  { id: 'publishing', label: 'Veröffentlichung', description: 'Vorbereitung zur Veröffentlichung' },
];

// Mock blog data
const mockBlogData = {
  title: 'Die Zukunft der KI im digitalen Marketing',
  content: 'Künstliche Intelligenz revolutioniert das digitale Marketing auf vielfältige Weise...',
  currentStep: 'writing',
  completedSteps: ['style-analysis', 'research', 'planning'],
  needsFeedback: true,
  type: 'blog'
};

// Mock LinkedIn data
const mockLinkedInData = {
  title: 'Warum Innovation der Schlüssel zum Erfolg ist',
  content: 'Innovation ist nicht nur ein Buzzword, sondern der entscheidende Faktor für langfristigen Erfolg...',
  currentStep: 'writing',
  completedSteps: ['style-analysis', 'planning'],
  needsFeedback: true,
  type: 'linkedin'
};

// Map workflow steps to icons
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
  const { id, type } = useParams();
  const navigate = useNavigate();
  const contentType = window.location.pathname.includes('linkedin') ? 'linkedin' : 'blog';
  const initialData = contentType === 'blog' ? mockBlogData : mockLinkedInData;
  
  const [content, setContent] = useState(initialData.content);
  const [blog, setBlog] = useState(initialData);
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isChangingPhase, setIsChangingPhase] = useState(false);
  
  const workflowSteps = contentType === 'blog' ? blogWorkflowSteps : linkedinWorkflowSteps;

  useEffect(() => {
    console.log(`Fetching ${contentType} data for ID: ${id}`);
  }, [id, contentType]);

  const handleSave = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      setBlog(prev => ({
        ...prev,
        content
      }));
      toast.success("Änderungen gespeichert");
      setIsSaving(false);
    }, 1000);
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
        
        setBlog(prev => ({
          ...prev,
          needsFeedback: false,
          currentStep: 'editing',
          completedSteps: [...prev.completedSteps, 'writing']
        }));
        
        setIsChangingPhase(false);
      }, 500);
    }, 1000);
  };

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
            
            <h1 className="text-xl font-bold truncate">{blog.title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {blog.needsFeedback && (
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
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Wird gespeichert...' : 'Speichern'}
            </Button>
          </div>
        </div>
        
        <div className="mb-8">
          <StepIndicator 
            steps={workflowSteps}
            currentStep={blog.currentStep}
            completedSteps={blog.completedSteps}
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
            {blog.needsFeedback && (
              <TabsTrigger value="feedback" className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                Feedback
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="editor" className="animate-fade-in">
            <div className="bg-card border border-border rounded-lg shadow-sm card-shadow p-4 md:p-6 dark:bg-card">
              <div className="flex items-center mb-4 gap-2 text-muted-foreground">
                <div className="p-2 bg-primary/10 rounded-full dark:bg-primary/5">
                  {getStepIcon(blog.currentStep)}
                </div>
                <div>
                  <h3 className="font-medium">
                    {workflowSteps.find(step => step.id === blog.currentStep)?.label || 'Aktueller Schritt'}
                  </h3>
                  <p className="text-sm">
                    {workflowSteps.find(step => step.id === blog.currentStep)?.description || 'Arbeiten Sie an diesem Schritt'}
                  </p>
                </div>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Beginnen Sie mit dem Schreiben..."
                className="min-h-[400px] font-medium"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="animate-fade-in">
            <div className="bg-card border border-border rounded-lg shadow-sm card-shadow p-4 md:p-6 prose max-w-none dark:bg-card">
              <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>
              <p>{content}</p>
            </div>
          </TabsContent>
          
          {blog.needsFeedback && (
            <TabsContent value="feedback" className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/50 border border-border rounded-lg p-4 md:p-6 dark:bg-muted/10">
                  <h3 className="text-lg font-semibold mb-3">Inhalt zur Überprüfung</h3>
                  <div className="prose max-w-none">
                    <h4 className="text-xl font-bold mb-2">{blog.title}</h4>
                    <p>{content}</p>
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
                      {isSubmittingFeedback ? 'Wird gesendet...' : 'Feedback senden'}
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
