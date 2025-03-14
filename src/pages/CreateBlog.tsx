import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Send, 
  Book, 
  CheckCircle,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import StepIndicator from '@/components/workflow/StepIndicator';
import { Card, CardContent } from '@/components/ui/card';
import StyleSelector from '@/components/style/StyleSelector';
import { createContent } from '@/services/contentService';
import { useAuth } from '@/contexts/AuthContext';

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

// LinkedIn workflow steps
const linkedinWorkflowSteps = [
  { id: 'style-analysis', label: 'Stilanalyse' },
  { id: 'planning', label: 'Planung' },
  { id: 'writing', label: 'Schreiben' },
  { id: 'editing', label: 'Bearbeitung' },
  { id: 'social', label: 'Veröffentlichung' },
];

type ContentType = 'blog' | 'linkedin';

const CreateBlog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const contentType: ContentType = window.location.pathname.includes('linkedin') ? 'linkedin' : 'blog';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [styleId, setStyleId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const workflowSteps = contentType === 'blog' ? blogWorkflowSteps : linkedinWorkflowSteps;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user && localStorage.getItem('isLoggedIn') !== 'true') {
      toast.error('Sie müssen angemeldet sein, um Inhalte zu erstellen');
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Bitte geben Sie einen Titel ein");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the contentService which now uses the API
      const content = await createContent({
        title,
        description,
        type: contentType,
        styleId
      });
      
      if (content) {
        toast.success(`${contentType === 'blog' ? 'Blog-Artikel' : 'LinkedIn-Post'} erfolgreich erstellt`);
        navigate('/content');
      } else {
        throw new Error('Failed to create content');
      }
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Fehler beim Erstellen des Inhalts');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container px-4 pt-24 pb-16 mx-auto flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-primary mx-auto animate-spin mb-4" />
            <p>Überprüfe Anmeldestatus...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16 mx-auto max-w-3xl">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6 flex items-center"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-full ${contentType === 'blog' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
              <FileText className={`h-5 w-5 ${contentType === 'blog' ? 'text-primary' : 'text-secondary'}`} />
            </div>
            
            <h1 className="text-2xl font-bold">
              Neuen {contentType === 'blog' ? 'Blog-Artikel' : 'LinkedIn-Post'} erstellen
            </h1>
          </div>
          
          <p className="text-muted-foreground max-w-lg">
            Füllen Sie die folgenden Felder aus, um mit der Erstellung zu beginnen. 
            Sie können später jederzeit Änderungen vornehmen.
          </p>
        </div>
        
        <div className="mb-8">
          <StepIndicator 
            steps={workflowSteps}
            currentStep="style-analysis"
            completedSteps={[]}
          />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <Card className="overflow-hidden border-border">
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-4 border-b border-border">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Grundinformationen
              </h2>
            </div>
            <CardContent className="pt-6">
              <div className="space-y-5">
                <div>
                  <Label htmlFor="title" className="text-base font-medium">
                    Titel
                  </Label>
                  <Input 
                    id="title"
                    placeholder={`${contentType === 'blog' ? 'Blog-Artikel' : 'LinkedIn-Post'} Titel...`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 text-lg"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-base font-medium">
                    Beschreibung / Hauptthemen
                  </Label>
                  <Textarea 
                    id="description"
                    placeholder="Beschreiben Sie kurz, worum es in Ihrem Inhalt gehen soll..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 min-h-24"
                  />
                </div>
                
                <StyleSelector 
                  selectedStyle={styleId}
                  onChange={setStyleId}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-8">
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting}
              className="relative overflow-hidden group min-w-40"
            >
              <span className="relative z-10 flex items-center">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird erstellt...
                  </>
                ) : (
                  <>
                    Erstellen
                    <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateBlog;
