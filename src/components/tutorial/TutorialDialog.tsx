
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  Search, 
  TrendingUp, 
  Lightbulb, 
  BookOpen,
  ArrowRight,
  Check,
  X
} from 'lucide-react';

type TutorialStep = {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  image?: string;
};

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Blog-Artikel erstellen',
    description: 'Erstellen Sie professionelle Blog-Artikel mit KI-Unterstützung, die Ihre Marke stärken und Leser begeistern.',
    icon: <FileText className="h-8 w-8 text-primary" />,
    path: '/create/blog',
    color: 'primary'
  },
  {
    title: 'LinkedIn-Posts verfassen',
    description: 'Verfassen Sie wirkungsvolle LinkedIn-Posts, die Ihre berufliche Marke stärken und mehr Engagement erzielen.',
    icon: <FileText className="h-8 w-8 text-secondary" />,
    path: '/create/linkedin',
    color: 'secondary'
  },
  {
    title: 'Stilanalyse durchführen',
    description: 'Analysieren Sie Ihren Schreibstil, um konsistente und auf Ihre Zielgruppe zugeschnittene Inhalte zu erstellen.',
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    path: '/analysis',
    color: 'primary'
  },
  {
    title: 'Research Agent nutzen',
    description: 'Recherchieren Sie effizient mit KI-Unterstützung, um fundierte Argumente und aktuelle Daten für Ihre Inhalte zu finden.',
    icon: <Search className="h-8 w-8 text-secondary" />,
    path: '/research',
    color: 'secondary'
  },
  {
    title: 'SEO optimieren',
    description: 'Verbessern Sie das Ranking Ihrer Inhalte in Suchmaschinen mit datengestützten SEO-Empfehlungen.',
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    path: '/seo',
    color: 'primary'
  },
  {
    title: 'Quellen verwalten',
    description: 'Organisieren Sie Ihre Quellen und Referenzen, um die Glaubwürdigkeit Ihrer Inhalte zu erhöhen.',
    icon: <Lightbulb className="h-8 w-8 text-secondary" />,
    path: '/resources/sources',
    color: 'secondary'
  }
];

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TutorialDialog = ({ open, onOpenChange }: TutorialDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    onOpenChange(false);
  };
  
  const goToFeature = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };
  
  const step = tutorialSteps[currentStep];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <div className="relative">
          {/* Progress Indicators */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
            {tutorialSteps.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          {/* Close Button */}
          <button 
            onClick={handleSkip}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 z-10"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className={`p-6 bg-${step.color}/5 dark:bg-${step.color}/10 border-b`}>
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-full bg-${step.color}/10 mr-4`}>
                {step.icon}
              </div>
              <DialogTitle className="text-2xl font-bold">
                {step.title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-base">
              {step.description}
            </DialogDescription>
          </div>
          
          <div className="p-6">
            <div className="rounded-lg border p-4 mb-6 bg-card">
              <h3 className="font-medium mb-2">Hauptvorteile:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Zeitersparnis durch KI-gestützte Inhaltsvorschläge</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Konsistente Qualität über alle Ihre Kanäle hinweg</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Datengestützte Entscheidungen für bessere Ergebnisse</span>
                </li>
              </ul>
            </div>
            
            <DialogFooter className="flex sm:justify-between gap-2">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  Zurück
                </Button>
                <Button 
                  onClick={handleNext}
                >
                  {currentStep < tutorialSteps.length - 1 ? 'Weiter' : 'Fertig'}
                </Button>
              </div>
              <Button 
                variant="secondary"
                onClick={() => goToFeature(step.path)}
                className="flex items-center"
              >
                Jetzt ausprobieren
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;
