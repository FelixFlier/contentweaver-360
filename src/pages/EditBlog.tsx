
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Save, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import StepIndicator from '@/components/workflow/StepIndicator';

// Blog workflow steps
const blogWorkflowSteps = [
  { id: 'style-analysis', label: 'Stilanalyse' },
  { id: 'research', label: 'Recherche' },
  { id: 'planning', label: 'Planung' },
  { id: 'writing', label: 'Schreiben' },
  { id: 'fact-check', label: 'Faktenprüfung' },
  { id: 'editing', label: 'Bearbeitung' },
  { id: 'seo', label: 'SEO-Optimierung' },
  { id: 'social', label: 'Social Media' },
];

// Mock blog data
const mockBlogData = {
  title: 'Die Zukunft der KI im digitalen Marketing',
  content: 'Künstliche Intelligenz revolutioniert das digitale Marketing auf vielfältige Weise...',
  currentStep: 'writing',
  completedSteps: ['style-analysis', 'research', 'planning'],
  needsFeedback: true,
};

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(mockBlogData);
  const [content, setContent] = useState(mockBlogData.content);
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    // In a real app, fetch blog data based on ID
    console.log(`Fetching blog data for ID: ${id}`);
    // setBlog(...) would happen here after fetching
  }, [id]);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
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
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Feedback gesendet");
      setActiveTab('editor');
      setFeedback('');
      setIsSubmittingFeedback(false);
      
      // Update blog state to reflect feedback submitted
      setBlog(prev => ({
        ...prev,
        needsFeedback: false,
        currentStep: 'editing',
        completedSteps: [...prev.completedSteps, 'writing']
      }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/content')}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Zurück
            </Button>
            
            <div className="bg-primary/10 p-2 rounded-full">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            
            <h1 className="text-xl font-bold truncate">{blog.title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {blog.needsFeedback && (
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('feedback')}
                className="flex items-center"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedback geben
              </Button>
            )}
            
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Wird gespeichert...' : 'Speichern'}
            </Button>
          </div>
        </div>
        
        <div className="mb-8">
          <StepIndicator 
            steps={blogWorkflowSteps}
            currentStep={blog.currentStep}
            completedSteps={blog.completedSteps}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Vorschau</TabsTrigger>
            {blog.needsFeedback && (
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="editor" className="animate-fade-in">
            <div className="bg-card border border-border rounded-lg shadow-card p-4 md:p-6">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Beginnen Sie mit dem Schreiben..."
                className="min-h-[400px] font-medium"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="animate-fade-in">
            <div className="bg-card border border-border rounded-lg shadow-card p-4 md:p-6 prose max-w-none">
              <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>
              <p>{content}</p>
            </div>
          </TabsContent>
          
          {blog.needsFeedback && (
            <TabsContent value="feedback" className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/50 border border-border rounded-lg p-4 md:p-6">
                  <h3 className="text-lg font-semibold mb-3">Inhalt zur Überprüfung</h3>
                  <div className="prose max-w-none">
                    <h4 className="text-xl font-bold mb-2">{blog.title}</h4>
                    <p>{content}</p>
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-lg shadow-card p-4 md:p-6">
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
                    >
                      Zurück
                    </Button>
                    
                    <Button 
                      onClick={handleSubmitFeedback} 
                      disabled={isSubmittingFeedback}
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
