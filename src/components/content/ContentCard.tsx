
import React from 'react';
import { FileText, Clock, MessageSquare, Check, Play, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export type ContentStatus = 'inprogress' | 'feedback' | 'completed';

export interface ContentCardProps {
  id: string;
  title: string;
  type: 'blog' | 'linkedin';
  status: ContentStatus;
  progress: number;
  lastUpdated: string;
}

const StatusBadge = ({ status }: { status: ContentStatus }) => {
  const statusConfig = {
    inprogress: {
      label: 'In Arbeit',
      className: 'bg-status-inprogress/10 text-status-inprogress',
      icon: <Play className="h-3 w-3 mr-1" />
    },
    feedback: {
      label: 'Feedback benötigt',
      className: 'bg-status-feedback/10 text-status-feedback',
      icon: <MessageSquare className="h-3 w-3 mr-1" />
    },
    completed: {
      label: 'Abgeschlossen',
      className: 'bg-status-completed/10 text-status-completed',
      icon: <Check className="h-3 w-3 mr-1" />
    }
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn('flex items-center gap-1 px-2 py-1', config.className)}>
      {config.icon}
      <span className="text-xs font-medium">{config.label}</span>
    </Badge>
  );
};

interface WorkflowStepProps {
  completed: boolean;
  current: boolean;
  label: string;
  position: number;
  total: number;
}

const WorkflowStep = ({ completed, current, label, position, total }: WorkflowStepProps) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={cn(
          "w-2.5 h-2.5 rounded-full mb-1 transition-all",
          completed ? "bg-status-completed" : 
          current ? "bg-primary shadow-[0_0_0_3px_rgba(58,54,224,0.15)]" : 
          "bg-muted border border-muted-foreground/30"
        )}
      />
      {current && (
        <span className="text-[10px] leading-tight text-primary font-medium absolute -mt-5 whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
};

const getWorkflowSteps = (type: 'blog' | 'linkedin') => {
  return type === 'blog' 
    ? ['Stilanalyse', 'Recherche', 'Planung', 'Schreiben', 'Faktenprüfung', 'Bearbeitung', 'SEO', 'Social'] 
    : ['Stilanalyse', 'Planung', 'Schreiben', 'Bearbeitung', 'Veröffentlichung'];
};

const ContentCard = ({ id, title, type, status, progress, lastUpdated }: ContentCardProps) => {
  const navigate = useNavigate();
  const workflowSteps = getWorkflowSteps(type);
  const currentStepIndex = Math.floor((progress / 100) * workflowSteps.length);
  
  // Calculate progress color based on percentage
  const getProgressColor = (progress: number) => {
    if (status === 'completed') return 'text-status-completed';
    if (progress < 25) return 'text-red-500';
    if (progress < 50) return 'text-status-feedback';
    if (progress < 75) return 'text-blue-400';
    return 'text-status-completed';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden transition-all duration-300 hover:shadow-lg group dark:border-border/30 dark:bg-card/95 dark:backdrop-blur-sm">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText 
              className={cn(
                'h-4 w-4',
                type === 'blog' ? 'text-primary' : 'text-secondary'
              )} 
            />
            <span className="text-xs font-medium text-muted-foreground capitalize">
              {type === 'blog' ? 'Blog-Artikel' : 'LinkedIn-Post'}
            </span>
          </div>
          <StatusBadge status={status} />
        </div>
        
        <h3 className="font-semibold text-base mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="mb-3">
          <div className="flex items-center">
            <Progress 
              value={progress} 
              className={cn(
                "h-2 bg-muted flex-1 mr-2",
                getProgressColor(progress)
              )}
            />
            <span className={cn(
              "text-xs font-medium",
              getProgressColor(progress)
            )}>
              {progress}%
            </span>
          </div>
          
          {status !== 'completed' && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-xs text-primary font-medium">
                {workflowSteps[currentStepIndex] || workflowSteps[0]}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {workflowSteps[currentStepIndex + 1] || 'Abschluss'}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between relative mt-4 mb-2">
          {workflowSteps.map((step, index) => (
            <WorkflowStep 
              key={index}
              completed={progress >= ((index + 1) / workflowSteps.length) * 100}
              current={index === currentStepIndex}
              label={step}
              position={index}
              total={workflowSteps.length}
            />
          ))}
          <div className="absolute h-0.5 bg-muted top-1 left-1 right-1 -z-10"></div>
          <div 
            className={cn(
              "absolute h-0.5 top-1 left-1 -z-5 transition-all duration-500",
              getProgressColor(progress)
            )}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-border dark:border-border/30">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {lastUpdated}
          </div>
          
          <Button 
            size="sm"
            onClick={() => navigate(`/edit/${type}/${id}`)}
            className={cn(
              status === 'feedback' ? 'bg-status-feedback hover:bg-status-feedback/90' : ''
            )}
          >
            {status === 'feedback' ? (
              <>
                <MessageSquare className="h-3 w-3 mr-1" />
                Feedback geben
              </>
            ) : (
              <>
                <ArrowRight className="h-3 w-3 mr-1" />
                Fortsetzen
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
