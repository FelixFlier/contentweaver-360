
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const StepIndicator = ({ steps, currentStep, completedSteps }: StepIndicatorProps) => {
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
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-colors z-10",
                    isCompleted ? "bg-primary text-white" 
                              : isCurrent ? "bg-primary text-white" 
                              : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                
                <span 
                  className={cn(
                    "text-xs mt-2 font-medium text-center",
                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
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
                      "h-0.5 w-full",
                      steps.findIndex(s => s.id === currentStep) > index ? "bg-primary" : "bg-muted"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Mobile version - compact current step display */}
      <div className="md:hidden">
        <div className="bg-muted rounded-md p-3">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            
            // Only show the current step and completed steps on mobile
            if (!isCurrent && !isCompleted) return null;
            
            return (
              <div 
                key={step.id}
                className={cn(
                  "flex items-center mb-2 last:mb-0",
                  isCurrent ? "bg-primary/5 p-2 rounded" : ""
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full mr-2",
                    isCompleted ? "bg-primary text-white" 
                              : isCurrent ? "bg-primary text-white" 
                              : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                
                <span 
                  className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
                
                {isCurrent && (
                  <span className="text-xs bg-primary text-white px-2 py-0.5 rounded ml-auto">
                    Aktuell
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
