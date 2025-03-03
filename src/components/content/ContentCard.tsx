
import React from 'react';
import { FileText, Clock, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

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
      icon: null
    },
    feedback: {
      label: 'Feedback benötigt',
      className: 'bg-status-feedback/10 text-status-feedback',
      icon: <MessageSquare className="h-3 w-3 mr-1" />
    },
    completed: {
      label: 'Abgeschlossen',
      className: 'bg-status-completed/10 text-status-completed',
      icon: null
    }
  };

  const config = statusConfig[status];

  return (
    <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center', config.className)}>
      {config.icon}
      {config.label}
    </span>
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
          "w-2 h-2 rounded-full mb-1",
          completed ? "bg-primary" : 
          current ? "bg-primary" : 
          "bg-muted"
        )}
      />
      {current && (
        <span className="text-[10px] text-primary font-medium absolute -mt-5">{label}</span>
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

  return (
    <div className="bg-white rounded-lg border border-border shadow-card overflow-hidden transition-all duration-300 hover:shadow-lg">
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
        
        <h3 className="font-semibold text-base mb-3 line-clamp-2">{title}</h3>
        
        <div className="mb-3">
          <Progress 
            value={progress} 
            className={cn(
              "h-1.5 bg-muted",
              status === 'inprogress' ? 'text-status-inprogress' : 
              status === 'feedback' ? 'text-status-feedback' : 
              'text-status-completed'
            )}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">{progress}%</span>
            {status !== 'completed' && (
              <span className="text-xs text-primary">
                {workflowSteps[currentStepIndex] || workflowSteps[0]}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between relative mt-3 mb-1">
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
            className="absolute h-0.5 bg-primary top-1 left-1 -z-5"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {lastUpdated}
          </div>
          
          <Button 
            size="sm"
            onClick={() => navigate(`/edit/${type}/${id}`)}
          >
            {status === 'feedback' ? 'Feedback geben' : 'Fortsetzen'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
