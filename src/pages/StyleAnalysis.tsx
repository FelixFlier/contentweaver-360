import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import UnifiedInputPanel from '@/components/shared/UnifiedInputPanel';

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
  const [result, setResult] = useState<StyleResult | null>(null);

  const handleAnalyze = () => {
    if (sampleText.trim().length < 100) {
      toast.error("Bitte geben Sie mindestens 100 Zeichen ein für eine genaue Analyse");
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock result
      const mockResult: StyleResult = {
        metrics: [
          { name: "Formalität", value: 65, label: "Formal" },
          { name: "Technische Tiefe", value: 40, label: "Mittel" },
          { name: "Persönlichkeit", value: 75, label: "Persönlich" },
          { name: "Überzeugungskraft", value: 60, label: "Überzeugend" },
        ],
        guidelines: [
          "Verwenden Sie persönliche Ansprache",
          "Setzen Sie auf konkrete Beispiele",
          "Halten Sie Sätze unter 20 Wörtern",
          "Mischen Sie Fachbegriffe mit einfachen Erklärungen"
        ],
        strengths: [
          "Gute Balance zwischen fachlich und zugänglich",
          "Effektiver Einsatz von persönlicher Ansprache",
          "Klare Struktur der Argumente"
        ],
        improvements: [
          "Einige Sätze könnten kürzer sein",
          "Mehr visuelle Sprachelemente verwenden",
          "Technische Begriffe konsequenter erklären"
        ]
      };
      
      setResult(mockResult);
      setIsAnalyzing(false);
      toast.success("Stilanalyse abgeschlossen");
    }, 2000);
  };

  const handleSaveProfile = () => {
    toast.success("Stilprofil gespeichert");
  };

  const handleReset = () => {
    setResult(null);
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
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-secondary/10 p-2 rounded-full">
            <Sparkles className="h-6 w-6 text-secondary" />
          </div>
          <h1 className="text-2xl font-bold">Stilanalyse-Tool</h1>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {!result ? (
            <UnifiedInputPanel 
              onSubmit={handleInputSubmit}
              placeholder="Fügen Sie hier einen Beispieltext ein (mindestens 100 Zeichen)..."
            />
          ) : (
          <div className="animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Stilmetriken</CardTitle>
                  <CardDescription>
                    Quantitative Analyse Ihres Schreibstils
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {result.metrics.map((metric) => (
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
              
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Stilrichtlinien</CardTitle>
                  <CardDescription>
                    Empfehlungen für konsistentes Schreiben
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.guidelines.map((guideline, index) => (
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
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Stärken</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-status-completed mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Verbesserungspotential</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.improvements.map((improvement, index) => (
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
