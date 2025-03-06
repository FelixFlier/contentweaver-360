
import React, { useState } from 'react';
import { 
  Check, 
  ChartBar, 
  Search, 
  FileText, 
  Pen, 
  ClipboardCheck, 
  Edit, 
  BarChart, 
  Share,
  BookOpen,
  List,
  Rocket,
  ShieldCheck,
  Target,
  Upload 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type WorkflowStep = {
  id: string;
  label: string;
  description?: string;
};

interface StepIndicatorProps {
  steps: WorkflowStep[];
  currentStep: string;
  completedSteps: string[];
}

// Helper function to get the appropriate icon for each step
const getStepIcon = (stepId: string) => {
  switch (stepId) {
    case 'style-analysis':
      return <ChartBar className="h-4 w-4" />;
    case 'research':
      return <BookOpen className="h-4 w-4" />;
    case 'planning':
      return <List className="h-4 w-4" />;
    case 'writing':
      return <Pen className="h-4 w-4" />;
    case 'fact-check':
      return <ShieldCheck className="h-4 w-4" />;
    case 'editing':
      return <Edit className="h-4 w-4" />;
    case 'seo':
      return <Target className="h-4 w-4" />;
    case 'social':
      return <Share className="h-4 w-4" />;
    case 'publishing':
      return <Rocket className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

// Enhanced tooltip component that shows more info after delay
const EnhancedTooltip = ({ 
  children, 
  title, 
  description, 
  status,
  open,
  onOpenChange 
}: { 
  children: React.ReactNode; 
  title: string; 
  description?: string; 
  status: 'completed' | 'current' | 'upcoming';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [showExtended, setShowExtended] = useState(false);
  
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      timer = setTimeout(() => {
        setShowExtended(true);
      }, 1500);
    } else {
      setShowExtended(false);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [open]);
  
  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={onOpenChange}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="bottom"
          className={cn(
            "p-4 max-w-[220px] bg-card shadow-lg rounded-lg border border-border tooltip-slide-up",
            showExtended ? "min-h-[100px]" : ""
          )}
        >
          <div className="space-y-2">
            <h3 className="font-medium text-sm">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            
            {showExtended && (
              <div className="pt-2 border-t border-border mt-2">
                <p className="text-xs">
                  {status === 'completed' && "Diese Phase wurde erfolgreich abgeschlossen."}
                  {status === 'current' && "Sie arbeiten gerade an dieser Phase."}
                  {status === 'upcoming' && "Diese Phase steht noch bevor."}
                </p>
              </div>
            )}
            
            {status === 'current' && (
              <p className="text-xs text-primary font-medium pt-1">
                Aktuelle Phase
              </p>
            )}
            {status === 'completed' && (
              <p className="text-xs text-status-completed font-medium pt-1">
                Abgeschlossen
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const StepIndicator = ({ steps, currentStep, completedSteps }: StepIndicatorProps) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const toggleTooltip = (stepId: string | null) => {
    setActiveTooltip(stepId);
  };
  
  // Function to determine if a step should pulsate
  const shouldPulsate = (stepId: string) => {
    return stepId === currentStep;
  };

  return (
    <div className="w-full">
      {/* Desktop version - horizontal */}
      <div className="hidden md:flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isActive = isCompleted || isCurrent;
          const status = isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming';
          
          return (
            <React.Fragment key={step.id}>
              {/* Step Indicator */}
              <div className="flex flex-col items-center relative">
                <EnhancedTooltip
                  title={step.label}
                  description={step.description}
                  status={status}
                  open={activeTooltip === step.id}
                  onOpenChange={(open) => open ? toggleTooltip(step.id) : toggleTooltip(null)}
                >
                  <div 
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full transition-all z-10 cursor-pointer",
                      isCompleted ? "bg-status-completed text-white shadow-sm" : 
                                  isCurrent ? "bg-primary text-primary-foreground shadow-[0_0_0_4px_rgba(58,54,224,0.25)]" : 
                                  "bg-muted text-muted-foreground border border-border",
                      shouldPulsate(step.id) && "animate-pulse-subtle"
                    )}
                    onClick={() => toggleTooltip(activeTooltip === step.id ? null : step.id)}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      getStepIcon(step.id)
                    )}
                  </div>
                </EnhancedTooltip>
                
                <span 
                  className={cn(
                    "text-xs mt-2 font-medium text-center",
                    isCurrent ? "text-primary" : 
                    isCompleted ? "text-foreground" : 
                    "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div 
                    className={cn(
                      "h-1 w-full rounded-full overflow-hidden",
                      steps.findIndex(s => s.id === currentStep) > index ? 
                        "bg-gradient-to-r from-primary to-secondary shimmer" : 
                        "bg-muted"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Mobile version - improved visualization */}
      <div className="md:hidden">
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="relative">
            {/* Progress bar */}
            <div className="h-1 bg-muted rounded-full mb-6 relative">
              <div 
                className="h-1 bg-gradient-to-r from-primary to-secondary shimmer rounded-full absolute top-0 left-0"
                style={{ 
                  width: `${(steps.findIndex(s => s.id === currentStep) / (steps.length - 1)) * 100}%` 
                }}
              />
            </div>
            
            {/* Step indicators */}
            <div className="flex justify-between w-full absolute top-0 -mt-2">
              {steps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                const isCurrent = step.id === currentStep;
                const isPastCurrent = steps.findIndex(s => s.id === currentStep) >= index;
                
                return (
                  <div 
                    key={step.id}
                    className="flex flex-col items-center"
                  >
                    <div 
                      className={cn(
                        "flex items-center justify-center w-5 h-5 rounded-full z-10",
                        isCompleted ? "bg-status-completed text-white" : 
                        isCurrent ? "bg-primary text-white shadow-[0_0_0_3px_rgba(58,54,224,0.15)] animate-pulse-subtle" : 
                        isPastCurrent ? "bg-muted-foreground/30 border border-muted-foreground/50" :
                        "bg-muted border border-muted-foreground/30"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <span className="text-[10px]">{index + 1}</span>
                      )}
                    </div>
                    
                    {isCurrent && (
                      <span className="text-[10px] font-medium text-primary mt-1 whitespace-nowrap absolute -bottom-5">
                        {step.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Current step details */}
          <div className="mt-8 pt-2 border-t border-border">
            <div className="flex items-center">
              <div 
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full mr-3",
                  "bg-primary text-white"
                )}
              >
                {getStepIcon(currentStep)}
              </div>
              <div>
                <h3 className="text-sm font-medium">
                  {steps.find(s => s.id === currentStep)?.label || 'Aktueller Schritt'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {steps.find(s => s.id === currentStep)?.description || 'Arbeiten Sie an diesem Schritt'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
