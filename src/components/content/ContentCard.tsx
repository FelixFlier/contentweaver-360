
import React from 'react';
import { FileText, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
      className: 'bg-status-inprogress/10 text-status-inprogress'
    },
    feedback: {
      label: 'Feedback benötigt',
      className: 'bg-status-feedback/10 text-status-feedback'
    },
    completed: {
      label: 'Abgeschlossen',
      className: 'bg-status-completed/10 text-status-completed'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-full', config.className)}>
      {config.label}
    </span>
  );
};

const ContentCard = ({ id, title, type, status, progress, lastUpdated }: ContentCardProps) => {
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
        
        <div className="w-full bg-muted rounded-full h-1.5 mb-3">
          <div 
            className={cn(
              "h-1.5 rounded-full",
              status === 'inprogress' ? 'bg-status-inprogress' : 
              status === 'feedback' ? 'bg-status-feedback' : 
              'bg-status-completed'
            )} 
            style={{ width: `${progress}%` }} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {lastUpdated}
          </div>
          
          <Button asChild size="sm">
            <Link to={`/edit/${type}/${id}`}>
              Fortsetzen
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
