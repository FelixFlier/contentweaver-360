import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Check, AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import UnifiedInputPanel from '@/components/shared/UnifiedInputPanel';
import { API } from '@/services/apiService';
import { useAgentTask } from '@/hooks/use-agent-task';

interface StyleMetric {
  name: string;
  value: number;
  label: string;
}

interface StyleResult {
  metrics: StyleMetric[];
  guidelines: string[];
  strengths: string[];
  improvements: string[];
}

const StyleAnalysis = () => {
  const navigate = useNavigate();
  const [sampleText, setSampleText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  
  // Use the agent task hook
  const { result, status, error } = useAgentTask<StyleResult>(taskId);

  const handleAnalyze = async () => {
    if (sampleText.trim().length < 100) {
      toast.error("Bitte geben Sie mindestens 100 Zeichen ein für eine genaue Analyse");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Call the style analysis API
      const response = await API.agents.styleAnalysis(sampleText);
      
      // Get the task ID for polling
      setTaskId(response.task_id);
    } catch (err) {
      console.error('Error starting style analysis:', err);
      toast.error('Fehler bei der Stilanalyse');
      setIsAnalyzing(false);
    }
  };

  const handleSaveProfile = async () => {
    if (result) {
      // In a real implementation, this would save the style profile to the database
      toast.success("Stilprofil gespeichert");
    } else {
      toast.error("Es gibt kein Stilprofil zum Speichern");
    }
  };

  const handleReset = () => {
    setTaskId(null);
    setSampleText('');
  };

  const handleInputSubmit = (data: { type: 'text' | 'link' | 'file'; content: string | File }) => {
    if (data.type === 'text') {
      setSampleText(data.content as string);
      handleAnalyze();
    } else {
      // Handle other input types as needed
      toast.info('Diese Funktion wird bald verfügbar sein');
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
        
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-secondary/10 p-2 rounded-full">
            <Sparkles className="h-6 w-6 text-secondary" />
          </div>
          <h1 className="text-2xl font-bold">Stilanalyse-Tool</h1>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {!result && status !== 'completed' ? (
            <Card className="bg-card dark:bg-[#1E1E1E]">
              <CardHeader>
                <CardTitle>Stilanalyse durchführen</CardTitle>
                <CardDescription>
                  Fügen Sie einen Beispieltext ein, um Ihren Schreibstil zu analysieren
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UnifiedInputPanel 
                  onSubmit={handleInputSubmit}
                  placeholder="Fügen Sie hier einen Beispieltext ein (mindestens 100 Zeichen)..."
                />
              </CardContent>
              <CardFooter>
                {isAnalyzing && status !== 'completed' && status !== 'failed' && (
                  <div className="w-full text-center">
                    <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
                    <p className="text-muted-foreground">Analyse läuft, bitte warten...</p>
                  </div>
                )}
              </CardFooter>
            </Card>
          ) : (
          <div className="animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="shadow-card bg-card dark:bg-[#1E1E1E]">
                <CardHeader>
                  <CardTitle>Stilmetriken</CardTitle>
                  <CardDescription>
                    Quantitative Analyse Ihres Schreibstils
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {result?.metrics.map((metric) => (
                      <div key={metric.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{metric.name}</span>
                          <span className="text-muted-foreground">{metric.label}</span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card bg-card dark:bg-[#1E1E1E]">
                <CardHeader>
                  <CardTitle>Stilrichtlinien</CardTitle>
                  <CardDescription>
                    Empfehlungen für konsistentes Schreiben
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result?.guidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-status-completed mt-0.5 flex-shrink-0" />
                        <span>{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="shadow-card bg-card dark:bg-[#1E1E1E]">
                <CardHeader>
                  <CardTitle>Stärken</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result?.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-status-completed mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="shadow-card bg-card dark:bg-[#1E1E1E]">
                <CardHeader>
                  <CardTitle>Verbesserungspotential</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result?.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-status-feedback mt-0.5 flex-shrink-0" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
                Neue Analyse
              </Button>
              
              <Button onClick={handleSaveProfile}>
                Stilprofil speichern
              </Button>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
};

export default StyleAnalysis;
