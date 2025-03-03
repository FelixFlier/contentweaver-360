
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Send, 
  Book, 
  CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import StepIndicator from '@/components/workflow/StepIndicator';
import { Card, CardContent } from '@/components/ui/card';

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
  const contentType: ContentType = window.location.pathname.includes('linkedin') ? 'linkedin' : 'blog';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const workflowSteps = contentType === 'blog' ? blogWorkflowSteps : linkedinWorkflowSteps;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Bitte geben Sie einen Titel ein");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`${contentType === 'blog' ? 'Blog-Artikel' : 'LinkedIn-Post'} erstellt`);
      navigate('/content');
      setIsSubmitting(false);
    }, 1500);
  };

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
        
        <div className="mb-8 text-center">
          <div className="rounded-full bg-primary/5 text-primary w-fit mx-auto px-4 py-1 text-sm font-medium mb-4">
            {contentType === 'blog' ? 'Blog-Artikel' : 'LinkedIn-Post'}
          </div>
          
          <h1 className="text-3xl font-bold mb-4">
            Neuen {contentType === 'blog' ? 'Blog-Artikel' : 'LinkedIn-Post'} erstellen
          </h1>
          
          <p className="text-muted-foreground max-w-lg mx-auto">
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
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
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
                
                <div>
                  <Label htmlFor="style" className="text-base font-medium">
                    Stilvorlage (optional)
                  </Label>
                  <Textarea 
                    id="style"
                    placeholder="Beschreiben Sie den gewünschten Schreibstil oder verweisen Sie auf ein Stilprofil..."
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center">
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting}
              className="min-w-40"
            >
              {isSubmitting ? "Wird erstellt..." : "Erstellen"}
              {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateBlog;
