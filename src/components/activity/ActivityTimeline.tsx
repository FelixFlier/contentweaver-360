
import React from 'react';
import { 
  FileText, 
  MessageSquare, 
  Check, 
  Edit, 
  Clock,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ActivityType = 'created' | 'updated' | 'feedback' | 'completed';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  contentTitle: string;
  contentType: 'blog' | 'linkedin';
  timestamp: string;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const ActivityIcon = ({ type, contentType }: { type: ActivityType, contentType: 'blog' | 'linkedin' }) => {
  const baseClass = cn(
    "p-2 rounded-full",
    contentType === 'blog' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
  );
  
  switch (type) {
    case 'created':
      return <div className={baseClass}><Plus className="h-4 w-4" /></div>;
    case 'updated':
      return <div className={baseClass}><Edit className="h-4 w-4" /></div>;
    case 'feedback':
      return <div className={baseClass}><MessageSquare className="h-4 w-4" /></div>;
    case 'completed':
      return <div className={baseClass}><Check className="h-4 w-4" /></div>;
    default:
      return <div className={baseClass}><FileText className="h-4 w-4" /></div>;
  }
};

const ActivityDescription = ({ type, contentTitle, contentType }: { 
  type: ActivityType, 
  contentTitle: string,
  contentType: 'blog' | 'linkedin'
}) => {
  const contentTypeLabel = contentType === 'blog' ? 'Blog-Artikel' : 'LinkedIn-Post';
  
  switch (type) {
    case 'created':
      return <p className="text-sm"><span className="font-medium">{contentTypeLabel}</span> "{contentTitle}" erstellt</p>;
    case 'updated':
      return <p className="text-sm"><span className="font-medium">{contentTypeLabel}</span> "{contentTitle}" aktualisiert</p>;
    case 'feedback':
      return <p className="text-sm">Feedback für <span className="font-medium">{contentTypeLabel}</span> "{contentTitle}" gegeben</p>;
    case 'completed':
      return <p className="text-sm"><span className="font-medium">{contentTypeLabel}</span> "{contentTitle}" abgeschlossen</p>;
    default:
      return <p className="text-sm">{contentTitle}</p>;
  }
};

const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Letzte Aktivitäten</h2>
      
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex items-start gap-3">
              <ActivityIcon type={activity.type} contentType={activity.contentType} />
              
              <div className="flex-1">
                <ActivityDescription 
                  type={activity.type} 
                  contentTitle={activity.contentTitle} 
                  contentType={activity.contentType}
                />
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted rounded-lg border border-border p-6 text-center">
          <p className="text-muted-foreground">Keine Aktivitäten vorhanden</p>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
