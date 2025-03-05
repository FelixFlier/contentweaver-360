
import React, { useState } from 'react';
import { Check, ChartBar, Search, FileText, Pen, ClipboardCheck, Edit, BarChart, Share } from 'lucide-react';
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
      return <Search className="h-4 w-4" />;
    case 'planning':
      return <FileText className="h-4 w-4" />;
    case 'writing':
      return <Pen className="h-4 w-4" />;
    case 'fact-check':
      return <ClipboardCheck className="h-4 w-4" />;
    case 'editing':
      return <Edit className="h-4 w-4" />;
    case 'seo':
      return <BarChart className="h-4 w-4" />;
    case 'social':
      return <Share className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const StepIndicator = ({ steps, currentStep, completedSteps }: StepIndicatorProps) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const toggleTooltip = (stepId: string | null) => {
    setActiveTooltip(stepId);
  };

  return (
    <div className="w-full">
      {/* Desktop version - horizontal */}
      <div className="hidden md:flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isActive = isCompleted || isCurrent;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step Indicator */}
              <div className="flex flex-col items-center relative">
                <TooltipProvider>
                  <Tooltip open={activeTooltip === step.id}>
                    <TooltipTrigger asChild>
                      <div 
                        className={cn(
                          "flex items-center justify-center w-9 h-9 rounded-full transition-all z-10 cursor-pointer",
                          isCompleted ? "bg-status-completed text-white shadow-sm" : 
                                    isCurrent ? "bg-primary text-primary-foreground shadow-[0_0_0_4px_rgba(58,54,224,0.25)]" : 
                                    "bg-muted text-muted-foreground border border-border"
                        )}
                        onClick={() => toggleTooltip(activeTooltip === step.id ? null : step.id)}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          getStepIcon(step.id)
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="bottom"
                      className="p-4 max-w-[220px] bg-card shadow-lg rounded-lg border border-border"
                    >
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm">{step.label}</h3>
                        {step.description && (
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                        )}
                        {isCurrent && (
                          <p className="text-xs text-primary font-medium pt-1">
                            Aktuelle Phase
                          </p>
                        )}
                        {isCompleted && (
                          <p className="text-xs text-status-completed font-medium pt-1">
                            Abgeschlossen
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
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
                      "h-1 w-full rounded-full",
                      steps.findIndex(s => s.id === currentStep) > index ? 
                        "bg-status-completed" : 
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
                className="h-1 bg-status-completed rounded-full absolute top-0 left-0"
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
                        isCurrent ? "bg-primary text-white shadow-[0_0_0_3px_rgba(58,54,224,0.25)]" : 
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
                  "flex items-center justify-center w-7 h-7 rounded-full mr-2",
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
